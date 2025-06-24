
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getServiceRequests, getUserServiceProvider, createProposal } from '@/services/modul8Service';
import { ServiceRequest, ServiceProvider } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Building2, DollarSign, Clock, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Labr8RequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
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
  }, [id, session?.user?.id]);

  const loadData = async () => {
    if (!id || !session?.user?.id) return;
    
    try {
      const [requests, provider] = await Promise.all([
        getServiceRequests(),
        getUserServiceProvider(session.user.id)
      ]);
      
      const request = requests.find(r => r.id === id);
      
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
      
      setServiceRequest(request);
      setServiceProvider(provider);
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
      
      toast({
        title: "Success!",
        description: "Your proposal has been sent to the organizer."
      });
      
      navigate('/labr8/dashboard');
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
                  <CardTitle>{serviceRequest.title}</CardTitle>
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
                            <span 
                              key={index}
                              className="text-xs bg-muted px-2 py-1 rounded"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Proposal Form */}
            <div>
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

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/labr8/dashboard')}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                      >
                        {submitting ? 'Submitting...' : 'Submit Proposal'}
                      </Button>
                    </div>
                  </form>
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
