import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getServiceRequestById, getUserServiceProvider } from '@/services/modul8Service';
import { createProposal, getProposalsByRequestId } from '@/services/proposalService';
import { ServiceRequest, ServiceProvider, Proposal } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Building2, DollarSign, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { createServiceRequestComment } from '@/services/commentService';

const Labr8RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [proposalData, setProposalData] = useState({
    quote_amount: '',
    timeline: '',
    scope_details: '',
    terms: ''
  });

  useEffect(() => {
    loadData();
  }, [requestId, session?.user?.id]);

  const loadData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    try {
      const [request, provider, requestProposals] = await Promise.all([
        getServiceRequestById(requestId),
        getUserServiceProvider(session.user.id),
        getProposalsByRequestId(requestId)
      ]);
      
      if (!request) {
        toast({
          title: "Error",
          description: "Service request not found",
          variant: "destructive"
        });
        navigate('/labr8/dashboard');
        return;
      }

      if (!provider) {
        toast({
          title: "Error",
          description: "Service provider profile not found",
          variant: "destructive"
        });
        navigate('/labr8/setup');
        return;
      }

      // Check if provider is assigned to this request
      if (request.service_provider_id !== provider.id) {
        toast({
          title: "Error",
          description: "You are not assigned to this request",
          variant: "destructive"
        });
        navigate('/labr8/dashboard');
        return;
      }
      
      setServiceRequest(request);
      setServiceProvider(provider);
      setProposals(requestProposals);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load request details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceRequest || !session?.user?.id) return;
    
    setSubmitting(true);
    try {
      await createProposal({
        service_request_id: serviceRequest.id,
        from_user_id: session.user.id,
        proposal_type: 'initial',
        quote_amount: proposalData.quote_amount ? parseFloat(proposalData.quote_amount) : undefined,
        timeline: proposalData.timeline || undefined,
        scope_details: proposalData.scope_details || undefined,
        terms: proposalData.terms || undefined
      });
      
      // Add status comment
      await createServiceRequestComment({
        service_request_id: serviceRequest.id,
        user_id: session.user.id,
        comment_type: 'general',
        content: `Proposal submitted: $${proposalData.quote_amount ? parseFloat(proposalData.quote_amount).toLocaleString() : 'TBD'} • ${proposalData.timeline || 'Timeline TBD'}`
      });
      
      toast({
        title: "Success!",
        description: "Your proposal has been sent to the organizer."
      });
      
      // Reset form
      setProposalData({
        quote_amount: '',
        timeline: '',
        scope_details: '',
        terms: ''
      });
      
      loadData();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit proposal",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeclineRequest = async () => {
    if (!confirm('Are you sure you want to decline this request?')) return;
    
    try {
      await createServiceRequestComment({
        service_request_id: serviceRequest!.id,
        user_id: session!.user!.id,
        comment_type: 'status_change',
        content: 'Request declined by service provider'
      });
      
      toast({
        title: "Request Declined",
        description: "The organizer has been notified"
      });
      
      navigate('/labr8/dashboard');
    } catch (error) {
      console.error('Error declining request:', error);
      toast({
        title: "Error",
        description: "Failed to decline request",
        variant: "destructive"
      });
    }
  };

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return 'Budget: TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Budget: TBD';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'negotiating': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'agreed': return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Request Not Found</h1>
            <Button onClick={() => navigate('/labr8/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasSubmittedProposal = proposals.some(p => p.from_user_id === session?.user?.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/labr8/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Request Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{serviceRequest.title}</CardTitle>
                      <Badge className={`${getStatusColor(serviceRequest.status)} font-medium mt-2`} variant="outline">
                        {serviceRequest.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {serviceRequest.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-muted-foreground">{serviceRequest.description}</p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{formatBudget(serviceRequest.budget_range)}</span>
                    </div>
                    
                    {serviceRequest.timeline && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{serviceRequest.timeline}</span>
                      </div>
                    )}
                  </div>

                  {serviceRequest.milestones && serviceRequest.milestones.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Milestones</h4>
                      <div className="space-y-1">
                        {serviceRequest.milestones.map((milestone, index) => (
                          <div key={index} className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                            {typeof milestone === 'string' ? milestone : JSON.stringify(milestone)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Organizer Info */}
              {serviceRequest.organizer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Organization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="font-medium">{serviceRequest.organizer.organization_name}</h3>
                      {serviceRequest.organizer.description && (
                        <p className="text-sm text-muted-foreground">
                          {serviceRequest.organizer.description}
                        </p>
                      )}
                      {serviceRequest.organizer.focus_areas && serviceRequest.organizer.focus_areas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {serviceRequest.organizer.focus_areas.map((area, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Proposals */}
              {proposals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Proposals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {proposals.filter(p => p.from_user_id === session?.user?.id).map((proposal) => (
                        <div key={proposal.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={proposal.status === 'accepted' ? 'default' : 'secondary'}>
                              {proposal.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(proposal.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {proposal.quote_amount && (
                              <div>
                                <span className="font-medium">Quote: </span>
                                <span>${proposal.quote_amount.toLocaleString()}</span>
                              </div>
                            )}
                            {proposal.timeline && (
                              <div>
                                <span className="font-medium">Timeline: </span>
                                <span>{proposal.timeline}</span>
                              </div>
                            )}
                          </div>
                          
                          {proposal.scope_details && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Scope: </span>
                              <p className="text-sm text-muted-foreground mt-1">{proposal.scope_details}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Action Panel */}
            <div className="space-y-6">
              {!hasSubmittedProposal ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Your Proposal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitProposal} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="quote_amount">Your Quote ($)</Label>
                        <Input
                          id="quote_amount"
                          type="number"
                          value={proposalData.quote_amount}
                          onChange={(e) => setProposalData(prev => ({ ...prev, quote_amount: e.target.value }))}
                          placeholder="Enter your quote amount"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline">Proposed Timeline</Label>
                        <Input
                          id="timeline"
                          value={proposalData.timeline}
                          onChange={(e) => setProposalData(prev => ({ ...prev, timeline: e.target.value }))}
                          placeholder="e.g., 4-6 weeks"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scope_details">Scope Details</Label>
                        <Textarea
                          id="scope_details"
                          value={proposalData.scope_details}
                          onChange={(e) => setProposalData(prev => ({ ...prev, scope_details: e.target.value }))}
                          placeholder="Describe what you will deliver and how you'll approach this project..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="terms">Terms & Conditions</Label>
                        <Textarea
                          id="terms"
                          value={proposalData.terms}
                          onChange={(e) => setProposalData(prev => ({ ...prev, terms: e.target.value }))}
                          placeholder="Payment terms, deliverable schedule, and any other conditions..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleDeclineRequest}
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Decline
                        </Button>
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {submitting ? 'Submitting...' : 'Submit Proposal'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Proposal Submitted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Your proposal has been submitted and is awaiting review by the organizer.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You'll be notified when there's an update on your proposal.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/labr8/dashboard')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labr8RequestDetails;
