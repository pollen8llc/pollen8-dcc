
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UnifiedHeader } from "@/components/shared/UnifiedHeader";
import { 
  getServiceRequestById, 
  getUserServiceProvider,
  updateServiceRequest 
} from "@/services/modul8Service";
import { 
  getServiceRequestComments, 
  createServiceRequestComment 
} from "@/services/commentService";
import { submitProviderProposal } from "@/services/negotiationService";
import { ServiceRequest, ServiceProvider } from "@/types/modul8";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Building,
  DollarSign,
  Clock,
  FileText,
  Send,
  MessageSquare,
  CheckCircle,
  XCircle,
  User,
  Calendar
} from "lucide-react";

const Labr8RequestDetails: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { session, logout } = useSession();
  const navigate = useNavigate();
  
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [newComment, setNewComment] = useState('');
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    quoteAmount: '',
    timeline: '',
    scopeDetails: '',
    terms: '',
    clarifications: ''
  });

  useEffect(() => {
    loadData();
  }, [requestId, session?.user?.id]);

  const loadData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    setLoading(true);
    try {
      console.log('Loading request details for:', requestId);
      
      const [requestData, providerData] = await Promise.all([
        getServiceRequestById(requestId),
        getUserServiceProvider(session.user.id)
      ]);
      
      console.log('Request data:', requestData);
      console.log('Provider data:', providerData);
      
      setServiceRequest(requestData);
      setServiceProvider(providerData);
      
      if (requestData) {
        const commentsData = await getServiceRequestComments(requestData.id);
        setComments(commentsData);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      toast({
        title: "Error",
        description: err?.message || "Failed to load request details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceRequest || !serviceProvider || !session?.user?.id) return;
    
    if (!proposalData.quoteAmount || !proposalData.timeline) {
      toast({
        title: "Validation Error",
        description: "Please provide at least quote amount and timeline",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await submitProviderProposal({
        serviceRequestId: serviceRequest.id,
        fromUserId: session.user.id,
        quoteAmount: parseFloat(proposalData.quoteAmount),
        timeline: proposalData.timeline,
        scopeDetails: proposalData.scopeDetails,
        terms: proposalData.terms,
        clarifications: proposalData.clarifications
      });

      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been sent to the organizer",
      });

      setShowProposalForm(false);
      setProposalData({
        quoteAmount: '',
        timeline: '',
        scopeDetails: '',
        terms: '',
        clarifications: ''
      });

      // Reload data to show updated status
      await loadData();
    } catch (err: any) {
      console.error('Error submitting proposal:', err);
      toast({
        title: "Error",
        description: err?.message || "Failed to submit proposal",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!serviceRequest || !session?.user?.id || !newComment.trim()) return;
    
    setSubmitting(true);
    try {
      await createServiceRequestComment({
        service_request_id: serviceRequest.id,
        user_id: session.user.id,
        comment_type: 'general',
        content: newComment.trim()
      });

      toast({
        title: "Comment Added",
        description: "Your comment has been posted",
      });

      setNewComment('');
      await loadData();
    } catch (err: any) {
      console.error('Error adding comment:', err);
      toast({
        title: "Error",
        description: err?.message || "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!serviceRequest || !session?.user?.id) return;
    
    setSubmitting(true);
    try {
      await updateServiceRequest(serviceRequest.id, { status: 'agreed' });
      
      await createServiceRequestComment({
        service_request_id: serviceRequest.id,
        user_id: session.user.id,
        comment_type: 'status_change',
        content: 'Provider accepted the request'
      });

      toast({
        title: "Request Accepted",
        description: "You have accepted this request",
      });

      await loadData();
    } catch (err: any) {
      console.error('Error accepting request:', err);
      toast({
        title: "Error",
        description: err?.message || "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeclineRequest = async () => {
    if (!serviceRequest || !session?.user?.id) return;
    
    setSubmitting(true);
    try {
      await updateServiceRequest(serviceRequest.id, { status: 'declined' });
      
      await createServiceRequestComment({
        service_request_id: serviceRequest.id,
        user_id: session.user.id,
        comment_type: 'status_change',
        content: 'Provider declined the request'
      });

      toast({
        title: "Request Declined",
        description: "You have declined this request",
      });

      navigate('/labr8/dashboard');
    } catch (err: any) {
      console.error('Error declining request:', err);
      toast({
        title: "Error",
        description: err?.message || "Failed to decline request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'negotiating': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'agreed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in_progress': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'declined': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return 'Budget TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    }
    return 'Budget TBD';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Request Details...</p>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Request Not Found</h2>
          <p className="text-gray-300 mb-4">The requested service request could not be found.</p>
          <Button 
            onClick={() => navigate('/labr8/dashboard')}
            className="bg-[#00eada] hover:bg-[#00c4b8] text-black"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <UnifiedHeader 
        platform="labr8" 
        user={session?.user}
        notificationCount={0}
        unreadMessages={0}
        onLogout={logout}
      />
      
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/labr8/dashboard')}
            className="border-gray-600 text-gray-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-white mb-2">{serviceRequest.title}</CardTitle>
                    <Badge className={`${getStatusColor(serviceRequest.status)} font-medium border`}>
                      {serviceRequest.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <p>Created {new Date(serviceRequest.created_at).toLocaleDateString()}</p>
                    {serviceRequest.organizer && (
                      <div className="flex items-center gap-2 mt-2">
                        <Building className="h-4 w-4" />
                        <span>{serviceRequest.organizer.organization_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">Description</h4>
                  <p className="text-gray-300">{serviceRequest.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Budget
                    </h4>
                    <p className="text-[#00eada]">{formatBudget(serviceRequest.budget_range)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Timeline
                    </h4>
                    <p className="text-gray-300">{serviceRequest.timeline || 'To be discussed'}</p>
                  </div>
                </div>

                {serviceRequest.milestones && Array.isArray(serviceRequest.milestones) && serviceRequest.milestones.length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Milestones</h4>
                    <ul className="space-y-1">
                      {serviceRequest.milestones.map((milestone, index) => (
                        <li key={index} className="text-gray-300 flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#00eada] rounded-full"></div>
                          {milestone}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {serviceRequest.status === 'pending' && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Your Response</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => setShowProposalForm(!showProposalForm)}
                      className="bg-[#00eada] hover:bg-[#00c4b8] text-black font-medium"
                    >
                      Submit Proposal
                    </Button>
                    <Button
                      onClick={handleAcceptRequest}
                      disabled={submitting}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Request
                    </Button>
                    <Button
                      onClick={handleDeclineRequest}
                      disabled={submitting}
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline Request
                    </Button>
                  </div>

                  {/* Proposal Form */}
                  {showProposalForm && (
                    <form onSubmit={handleSubmitProposal} className="space-y-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                      <h4 className="font-medium text-white">Submit Your Proposal</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="quoteAmount" className="text-white">Quote Amount (USD) *</Label>
                          <Input
                            id="quoteAmount"
                            type="number"
                            placeholder="5000"
                            value={proposalData.quoteAmount}
                            onChange={(e) => setProposalData(prev => ({ ...prev, quoteAmount: e.target.value }))}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeline" className="text-white">Timeline *</Label>
                          <Input
                            id="timeline"
                            placeholder="4-6 weeks"
                            value={proposalData.timeline}
                            onChange={(e) => setProposalData(prev => ({ ...prev, timeline: e.target.value }))}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada]"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scopeDetails" className="text-white">Scope Details</Label>
                        <Textarea
                          id="scopeDetails"
                          placeholder="Describe what you'll deliver..."
                          value={proposalData.scopeDetails}
                          onChange={(e) => setProposalData(prev => ({ ...prev, scopeDetails: e.target.value }))}
                          rows={3}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada] resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="terms" className="text-white">Terms & Conditions</Label>
                        <Textarea
                          id="terms"
                          placeholder="Payment terms, revisions, etc..."
                          value={proposalData.terms}
                          onChange={(e) => setProposalData(prev => ({ ...prev, terms: e.target.value }))}
                          rows={2}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada] resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clarifications" className="text-white">Questions/Clarifications</Label>
                        <Textarea
                          id="clarifications"
                          placeholder="Any questions about the project?"
                          value={proposalData.clarifications}
                          onChange={(e) => setProposalData(prev => ({ ...prev, clarifications: e.target.value }))}
                          rows={2}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada] resize-none"
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowProposalForm(false)}
                          className="border-gray-600 text-gray-300 hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="bg-[#00eada] hover:bg-[#00c4b8] text-black font-medium"
                        >
                          {submitting ? 'Submitting...' : 'Submit Proposal'}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5" />
                  Communication Thread
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No comments yet</p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-600 text-white text-sm">
                              U
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">User</span>
                              <span className="text-xs text-gray-400">
                                {new Date(comment.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="space-y-3">
                  <Separator className="bg-gray-700" />
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add a comment or update..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleAddComment}
                        disabled={submitting || !newComment.trim()}
                        className="bg-[#00eada] hover:bg-[#00c4b8] text-black"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    Created {new Date(serviceRequest.created_at).toLocaleDateString()}
                  </span>
                </div>
                {serviceRequest.organizer && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{serviceRequest.organizer.organization_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">Service Request #{serviceRequest.id.slice(-8)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labr8RequestDetails;
