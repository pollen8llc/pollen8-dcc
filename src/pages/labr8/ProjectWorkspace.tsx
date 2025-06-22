
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft,
  Building2, 
  DollarSign, 
  Calendar,
  MessageSquare,
  Send,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';
import { 
  updateServiceRequest,
  createProposal
} from '@/services/modul8Service';
import { 
  getServiceRequestComments,
  createServiceRequestComment
} from '@/services/commentService';

const ProjectWorkspace = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  
  const [proposalData, setProposalData] = useState({
    quoteAmount: '',
    timeline: '',
    scopeDetails: '',
    terms: ''
  });

  useEffect(() => {
    // Retrieve selected request from sessionStorage
    const storedRequest = sessionStorage.getItem('selectedRequest');
    if (storedRequest) {
      const request = JSON.parse(storedRequest);
      setSelectedRequest(request);
      loadComments(request.id);
    }
  }, []);

  const loadComments = async (requestId) => {
    try {
      const requestComments = await getServiceRequestComments(requestId);
      setComments(requestComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleBack = () => {
    navigate('/labr8/inbox');
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedRequest || !session?.user?.id) return;

    setIsSubmittingComment(true);
    try {
      await createServiceRequestComment({
        service_request_id: selectedRequest.id,
        user_id: session.user.id,
        comment_type: 'general',
        content: newComment.trim()
      });
      
      setNewComment('');
      await loadComments(selectedRequest.id);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been posted",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    
    if (!selectedRequest || !session?.user?.id) return;

    try {
      // Create proposal
      await createProposal({
        service_request_id: selectedRequest.id,
        from_user_id: session.user.id,
        proposal_type: 'initial',
        quote_amount: proposalData.quoteAmount ? parseFloat(proposalData.quoteAmount) : undefined,
        timeline: proposalData.timeline,
        scope_details: proposalData.scopeDetails,
        terms: proposalData.terms
      });

      // Update request status
      await updateServiceRequest(selectedRequest.id, { status: 'negotiating' });

      // Add comment about proposal
      await createServiceRequestComment({
        service_request_id: selectedRequest.id,
        user_id: session.user.id,
        comment_type: 'general',
        content: `Proposal submitted: $${proposalData.quoteAmount} • ${proposalData.timeline}`
      });

      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been sent to the organizer",
      });

      setShowProposalForm(false);
      await loadComments(selectedRequest.id);
      
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to submit proposal",
        variant: "destructive"
      });
    }
  };

  const handleDeclineRequest = async () => {
    if (!selectedRequest) return;

    try {
      await updateServiceRequest(selectedRequest.id, { status: 'declined' });
      
      toast({
        title: "Request Declined",
        description: "The request has been declined",
      });
      
      navigate('/labr8/inbox');
    } catch (error) {
      console.error('Error declining request:', error);
      toast({
        title: "Error",
        description: "Failed to decline request",
        variant: "destructive"
      });
    }
  };

  const formatBudget = (budget) => {
    if (!budget || typeof budget !== 'object') return 'Budget TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    }
    return 'Budget TBD';
  };

  if (!selectedRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Request Selected
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Please select a request from your inbox first
              </p>
              <Button onClick={() => navigate('/labr8/inbox')}>
                Back to Inbox
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inbox
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">Project Workspace</h1>
            <p className="text-muted-foreground mt-2">
              Review and respond to service request
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Request Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedRequest.title}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedRequest.organizer?.logo_url} />
                        <AvatarFallback>
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {selectedRequest.organizer?.organization_name || 'Organization'}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {selectedRequest.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {selectedRequest.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Budget</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatBudget(selectedRequest.budget_range)}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Timeline</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.timeline || 'Not specified'}
                    </p>
                  </div>
                </div>

                {selectedRequest.milestones && selectedRequest.milestones.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Milestones</span>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedRequest.milestones.map((milestone, index) => (
                        <li key={index}>• {milestone}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Proposal Form */}
            {showProposalForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Proposal</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitProposal} className="space-y-4">
                    <div>
                      <Label htmlFor="quoteAmount">Quote Amount ($)</Label>
                      <Input
                        id="quoteAmount"
                        type="number"
                        value={proposalData.quoteAmount}
                        onChange={(e) => setProposalData(prev => ({ ...prev, quoteAmount: e.target.value }))}
                        placeholder="10000"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        value={proposalData.timeline}
                        onChange={(e) => setProposalData(prev => ({ ...prev, timeline: e.target.value }))}
                        placeholder="e.g., 4-6 weeks"
                      />
                    </div>

                    <div>
                      <Label htmlFor="scopeDetails">Scope Details</Label>
                      <Textarea
                        id="scopeDetails"
                        value={proposalData.scopeDetails}
                        onChange={(e) => setProposalData(prev => ({ ...prev, scopeDetails: e.target.value }))}
                        placeholder="Detailed description of what you'll deliver..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="terms">Terms & Conditions</Label>
                      <Textarea
                        id="terms"
                        value={proposalData.terms}
                        onChange={(e) => setProposalData(prev => ({ ...prev, terms: e.target.value }))}
                        placeholder="Payment terms, revision policy, etc..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowProposalForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Submit Proposal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Comments Thread */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Communication Thread
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="border-l-2 border-muted pl-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.user_id === session?.user?.id ? 'You' : 'Organizer'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No comments yet. Start the conversation!
                    </p>
                  )}
                </div>

                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment or question..."
                    rows={3}
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => setShowProposalForm(true)}
                      className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Submit Proposal
                    </Button>
                    <Button 
                      onClick={handleDeclineRequest}
                      variant="outline"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline Request
                    </Button>
                  </>
                )}
                
                {selectedRequest.status === 'negotiating' && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Proposal submitted. Waiting for organizer response.
                    </p>
                    <Badge variant="secondary" className="w-full justify-center">
                      Under Review
                    </Badge>
                  </div>
                )}
                
                {selectedRequest.status === 'agreed' && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Proposal accepted! Ready to start work.
                    </p>
                    <Badge variant="default" className="w-full justify-center bg-green-100 text-green-800">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approved
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
