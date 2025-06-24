
import React, { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Building,
  User,
  Send,
  Paperclip
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getProposalCards, 
  createProposalCard, 
  respondToProposalCard,
  createCounterProposal,
  getRequestComments,
  createRequestComment
} from '@/services/proposalCardService';
import { ProposalCard, RequestComment } from '@/types/proposalCards';

interface ProposalCardThreadProps {
  requestId: string;
  isServiceProvider?: boolean;
}

const ProposalCardThread: React.FC<ProposalCardThreadProps> = ({ 
  requestId, 
  isServiceProvider = false 
}) => {
  const { session } = useSession();
  const [proposalCards, setProposalCards] = useState<ProposalCard[]>([]);
  const [comments, setComments] = useState<RequestComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalNotes, setProposalNotes] = useState('');
  const [proposalScope, setProposalScope] = useState('');
  const [proposalTerms, setProposalTerms] = useState('');
  const [newComment, setNewComment] = useState('');
  
  useEffect(() => {
    loadThreadData();
  }, [requestId]);

  const loadThreadData = async () => {
    if (!requestId) return;
    
    try {
      setLoading(true);
      const [cardsData, commentsData] = await Promise.all([
        getProposalCards(requestId),
        getRequestComments(requestId)
      ]);
      
      setProposalCards(cardsData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading thread data:', error);
      toast({
        title: "Error",
        description: "Failed to load proposal thread",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProposal = async () => {
    if (!proposalNotes.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide proposal notes",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      await createProposalCard({
        request_id: requestId,
        notes: proposalNotes,
        scope_link: proposalScope || undefined,
        terms_link: proposalTerms || undefined,
        asset_links: []
      });

      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been submitted successfully"
      });

      // Reset form and reload data
      setProposalNotes('');
      setProposalScope('');
      setProposalTerms('');
      setShowProposalForm(false);
      await loadThreadData();
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

  const handleRespondToCard = async (cardId: string, responseType: 'accept' | 'reject' | 'counter') => {
    try {
      setSubmitting(true);
      
      if (responseType === 'counter') {
        // For counter proposals, we'll create a new card
        setShowProposalForm(true);
        return;
      }

      await respondToProposalCard({
        card_id: cardId,
        response_type: responseType,
        response_notes: `${responseType === 'accept' ? 'Accepted' : 'Rejected'} proposal`
      });

      toast({
        title: responseType === 'accept' ? "Proposal Accepted" : "Proposal Rejected",
        description: `The proposal has been ${responseType}ed successfully`
      });

      await loadThreadData();
    } catch (error) {
      console.error('Error responding to proposal:', error);
      toast({
        title: "Error",
        description: "Failed to respond to proposal",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await createRequestComment({
        request_id: requestId,
        content: newComment,
        attachment_links: []
      });

      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully"
      });

      setNewComment('');
      await loadThreadData();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCardStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'accepted': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'countered': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCardStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'countered': return <ArrowRight className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Proposal Cards Timeline */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#00eada]" />
            Proposal Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {proposalCards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No proposals yet</p>
              <p className="text-sm">The proposal timeline will appear here as cards are created.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposalCards.map((card, index) => (
                <Card key={card.id} className="border-l-4 border-l-[#00eada] bg-gradient-to-r from-white to-gray-50/30">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className="bg-[#00eada]/10 text-[#00eada] font-bold px-3 py-1">
                            Card #{card.card_number}
                          </Badge>
                          <Badge className={`${getCardStatusColor(card.status)} font-semibold border px-3 py-1 flex items-center gap-1`}>
                            {getCardStatusIcon(card.status)}
                            {card.status.toUpperCase()}
                          </Badge>
                          {card.response_to_card_id && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              Counter Proposal
                            </Badge>
                          )}
                        </div>
                        
                        {card.notes && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-700 leading-relaxed">{card.notes}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {card.submitted_by === session?.user?.id ? 'You' : 'Other Party'}
                          </span>
                          <span>{new Date(card.created_at).toLocaleDateString()}</span>
                          {card.scope_link && (
                            <a href={card.scope_link} target="_blank" rel="noopener noreferrer" 
                               className="text-[#00eada] hover:underline flex items-center gap-1">
                              <Paperclip className="h-4 w-4" />
                              Scope
                            </a>
                          )}
                          {card.terms_link && (
                            <a href={card.terms_link} target="_blank" rel="noopener noreferrer" 
                               className="text-[#00eada] hover:underline flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              Terms
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Response Actions */}
                    {card.status === 'pending' && card.submitted_by !== session?.user?.id && !card.is_locked && (
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Button
                          onClick={() => handleRespondToCard(card.id, 'accept')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={submitting}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleRespondToCard(card.id, 'reject')}
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          disabled={submitting}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleRespondToCard(card.id, 'counter')}
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                          disabled={submitting}
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Counter
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Proposal Form */}
      {(showProposalForm || (isServiceProvider && proposalCards.length === 1)) && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Send className="h-5 w-5 text-[#00eada]" />
              {proposalCards.length === 1 ? 'Submit Your Proposal' : 'Submit Counter Proposal'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="proposal-notes" className="text-sm font-semibold text-gray-700">
                Proposal Details *
              </Label>
              <Textarea
                id="proposal-notes"
                placeholder="Describe your proposal, approach, and key details..."
                value={proposalNotes}
                onChange={(e) => setProposalNotes(e.target.value)}
                className="mt-2 min-h-[120px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scope-link" className="text-sm font-semibold text-gray-700">
                  Scope Document (Optional)
                </Label>
                <Input
                  id="scope-link"
                  type="url"
                  placeholder="https://docs.google.com/document/..."
                  value={proposalScope}
                  onChange={(e) => setProposalScope(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="terms-link" className="text-sm font-semibold text-gray-700">
                  Terms Document (Optional)
                </Label>
                <Input
                  id="terms-link"
                  type="url"
                  placeholder="https://docs.google.com/document/..."
                  value={proposalTerms}
                  onChange={(e) => setProposalTerms(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmitProposal}
                disabled={submitting || !proposalNotes.trim()}
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-semibold"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Proposal
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowProposalForm(false)}
                variant="outline"
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show Proposal Button for Service Providers */}
      {isServiceProvider && !showProposalForm && proposalCards.length > 1 && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowProposalForm(true)}
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-semibold"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit New Proposal
          </Button>
        </div>
      )}

      {/* Comments Section */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#00eada]" />
            Project Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comments List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No comments yet. Start the discussion!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#00eada]/20 text-[#00eada]">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.user_id === session?.user?.id ? 'You' : 'Other Party'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* New Comment Form */}
          <Separator />
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment to the discussion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddComment}
                disabled={submitting || !newComment.trim()}
                size="sm"
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-semibold"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-black" />
                    Adding...
                  </div>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Add Comment
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalCardThread;
