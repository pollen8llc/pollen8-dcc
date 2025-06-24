
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { 
  getServiceRequestById, 
  getUserOrganizer,
  updateServiceRequest
} from '@/services/modul8Service';
import { getProposalsByRequestId, updateProposalStatus } from '@/services/proposalService';
import { ServiceRequest, Proposal } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Building2, Clock, DollarSign, CheckCircle, XCircle, MessageSquare, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { createServiceRequestComment } from '@/services/commentService';

const Modul8RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizerData, setOrganizerData] = useState(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadData();
  }, [requestId, session?.user?.id]);

  const loadData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    try {
      const [request, organizer, requestProposals] = await Promise.all([
        getServiceRequestById(requestId),
        getUserOrganizer(session.user.id),
        getProposalsByRequestId(requestId)
      ]);
      
      if (!request) {
        toast({
          title: "Error",
          description: "Service request not found",
          variant: "destructive"
        });
        navigate('/modul8/dashboard');
        return;
      }

      if (!organizer || request.organizer_id !== organizer.id) {
        toast({
          title: "Error",
          description: "Unauthorized access",
          variant: "destructive"
        });
        navigate('/modul8/dashboard');
        return;
      }
      
      setServiceRequest(request);
      setOrganizerData(organizer);
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

  const handleAcceptProposal = async (proposal: Proposal) => {
    try {
      await updateProposalStatus(proposal.id, 'accepted');
      await updateServiceRequest(requestId!, { status: 'agreed' });
      
      // Add status comment
      await createServiceRequestComment({
        service_request_id: requestId!,
        user_id: session!.user!.id,
        comment_type: 'status_change',
        content: `Proposal accepted! Quote: $${proposal.quote_amount?.toLocaleString() || 'TBD'}`
      });
      
      toast({
        title: "Proposal Accepted",
        description: "The service provider has been notified"
      });
      
      loadData();
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to accept proposal",
        variant: "destructive"
      });
    }
  };

  const handleRejectProposal = async (proposal: Proposal) => {
    try {
      await updateProposalStatus(proposal.id, 'rejected');
      
      // Add status comment
      await createServiceRequestComment({
        service_request_id: requestId!,
        user_id: session!.user!.id,
        comment_type: 'status_change',
        content: `Proposal rejected`
      });
      
      toast({
        title: "Proposal Rejected",
        description: "The service provider has been notified"
      });
      
      loadData();
    } catch (error) {
      console.error('Error rejecting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to reject proposal",
        variant: "destructive"
      });
    }
  };

  const handleCounterProposal = async (proposal: Proposal) => {
    // For now, just add a comment indicating counter-proposal intent
    try {
      await createServiceRequestComment({
        service_request_id: requestId!,
        user_id: session!.user!.id,
        comment_type: 'general',
        content: `Counter-proposal requested for original quote of $${proposal.quote_amount?.toLocaleString() || 'TBD'}`
      });
      
      toast({
        title: "Counter-proposal Requested",
        description: "Please discuss details in comments below"
      });
      
      loadData();
    } catch (error) {
      console.error('Error creating counter-proposal:', error);
      toast({
        title: "Error",
        description: "Failed to create counter-proposal",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRequest = async () => {
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      return;
    }
    
    try {
      await updateServiceRequest(requestId!, { status: 'cancelled' });
      
      toast({
        title: "Request Cancelled",
        description: "The service request has been cancelled"
      });
      
      navigate('/modul8/dashboard');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive"
      });
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setSubmittingComment(true);
    try {
      await createServiceRequestComment({
        service_request_id: requestId!,
        user_id: session!.user!.id,
        comment_type: 'general',
        content: comment
      });
      
      setComment('');
      toast({
        title: "Comment Added",
        description: "Your comment has been posted"
      });
      
      loadData();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'negotiating': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'agreed': return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
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
            <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
            <Button onClick={() => navigate('/modul8/dashboard')}>
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
              onClick={() => navigate('/modul8/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Request Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{serviceRequest.title}</CardTitle>
                  <Badge className={`${getStatusColor(serviceRequest.status)} font-medium`} variant="outline">
                    {serviceRequest.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteRequest}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {serviceRequest.description && (
                <p className="text-muted-foreground mb-4">{serviceRequest.description}</p>
              )}
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Budget: {
                    serviceRequest.budget_range?.min && serviceRequest.budget_range?.max
                      ? `$${serviceRequest.budget_range.min.toLocaleString()} - $${serviceRequest.budget_range.max.toLocaleString()}`
                      : serviceRequest.budget_range?.min
                      ? `From $${serviceRequest.budget_range.min.toLocaleString()}`
                      : 'Contact for pricing'
                  }</span>
                </div>
                {serviceRequest.timeline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{serviceRequest.timeline}</span>
                  </div>
                )}
              </div>
              
              {serviceRequest.service_provider && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={serviceRequest.service_provider.logo_url} />
                      <AvatarFallback>
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{serviceRequest.service_provider.business_name}</h4>
                      <p className="text-sm text-muted-foreground">Service Provider</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proposals Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              {proposals.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No proposals yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
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
                          
                          {proposal.terms && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Terms: </span>
                              <p className="text-sm text-muted-foreground mt-1">{proposal.terms}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {proposal.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAcceptProposal(proposal)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCounterProposal(proposal)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Counter
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectProposal(proposal)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Comments & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4">
                <Textarea
                  placeholder="Add a comment or update..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={submittingComment || !comment.trim()}
                  className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                >
                  {submittingComment ? 'Adding...' : 'Add Comment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Modul8RequestDetails;
