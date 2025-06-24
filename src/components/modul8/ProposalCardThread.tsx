
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, MessageSquare, Send } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';
import ProposalCardNew from './ProposalCardNew';
import { 
  getProposalCards, 
  createProposalCard, 
  respondToProposalCard, 
  createCounterProposal,
  cancelProposalCard,
  getRequestComments,
  createRequestComment
} from '@/services/proposalCardService';
import { ProposalCard, RequestComment } from '@/types/proposalCards';
import { format } from 'date-fns';

interface ProposalCardThreadProps {
  requestId: string;
  isServiceProvider?: boolean;
}

const ProposalCardThread: React.FC<ProposalCardThreadProps> = ({
  requestId,
  isServiceProvider = false
}) => {
  const { session } = useSession();
  const [cards, setCards] = useState<ProposalCard[]>([]);
  const [comments, setComments] = useState<RequestComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProposalForm, setShowNewProposalForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newProposal, setNewProposal] = useState({
    notes: '',
    scope_link: '',
    terms_link: '',
    asset_links: ''
  });

  useEffect(() => {
    loadData();
  }, [requestId]);

  const loadData = async () => {
    try {
      const [cardsData, commentsData] = await Promise.all([
        getProposalCards(requestId),
        getRequestComments(requestId)
      ]);
      setCards(cardsData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load proposal data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async () => {
    if (!session?.user?.id) return;

    try {
      const assetLinksArray = newProposal.asset_links
        .split('\n')
        .map(link => link.trim())
        .filter(link => link.length > 0);

      await createProposalCard({
        request_id: requestId,
        notes: newProposal.notes || undefined,
        scope_link: newProposal.scope_link || undefined,
        terms_link: newProposal.terms_link || undefined,
        asset_links: assetLinksArray
      });

      setNewProposal({ notes: '', scope_link: '', terms_link: '', asset_links: '' });
      setShowNewProposalForm(false);
      await loadData();
      
      toast({
        title: "Proposal Created",
        description: "Your proposal has been submitted successfully"
      });
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: "Error",
        description: "Failed to create proposal",
        variant: "destructive"
      });
    }
  };

  const handleCardResponse = async (cardId: string, responseType: 'accept' | 'reject') => {
    try {
      await respondToProposalCard({
        card_id: cardId,
        response_type: responseType
      });

      await loadData();
      
      toast({
        title: "Response Submitted",
        description: `Proposal ${responseType}ed successfully`
      });
    } catch (error) {
      console.error('Error responding to card:', error);
      toast({
        title: "Error",
        description: "Failed to respond to proposal",
        variant: "destructive"
      });
    }
  };

  const handleCounterProposal = async (cardId: string, counterData: any) => {
    try {
      await createCounterProposal(cardId, {
        request_id: requestId,
        ...counterData
      });

      await loadData();
      
      toast({
        title: "Counter Proposal Submitted",
        description: "Your counter proposal has been created"
      });
    } catch (error) {
      console.error('Error creating counter proposal:', error);
      toast({
        title: "Error",
        description: "Failed to create counter proposal",
        variant: "destructive"
      });
    }
  };

  const handleCancelCard = async (cardId: string) => {
    try {
      await cancelProposalCard(cardId);
      await loadData();
      
      toast({
        title: "Proposal Cancelled",
        description: "Your proposal has been cancelled"
      });
    } catch (error) {
      console.error('Error cancelling card:', error);
      toast({
        title: "Error",
        description: "Failed to cancel proposal",
        variant: "destructive"
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await createRequestComment({
        request_id: requestId,
        content: newComment.trim()
      });

      setNewComment('');
      await loadData();
      
      toast({
        title: "Comment Added",
        description: "Your comment has been posted"
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  const isCardOwner = (card: ProposalCard) => {
    return card.submitted_by === session?.user?.id;
  };

  const canRespondToCard = (card: ProposalCard) => {
    return !isCardOwner(card) && card.status === 'pending' && !card.is_locked;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00eada]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Proposal Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Proposal Thread</h3>
          {isServiceProvider && (
            <Button
              onClick={() => setShowNewProposalForm(true)}
              className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Proposal
            </Button>
          )}
        </div>

        {cards.map((card) => (
          <ProposalCardNew
            key={card.id}
            card={card}
            onAccept={() => handleCardResponse(card.id, 'accept')}
            onReject={() => handleCardResponse(card.id, 'reject')}
            onCounter={(data) => handleCounterProposal(card.id, data)}
            onCancel={() => handleCancelCard(card.id)}
            canRespond={canRespondToCard(card)}
            isOwner={isCardOwner(card)}
          />
        ))}

        {cards.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No proposals yet</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Proposal Form */}
      {showNewProposalForm && (
        <Card className="border-2 border-[#00eada]/20">
          <CardHeader>
            <CardTitle>Create New Proposal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proposal-notes">Notes</Label>
              <Textarea
                id="proposal-notes"
                value={newProposal.notes}
                onChange={(e) => setNewProposal({...newProposal, notes: e.target.value})}
                placeholder="Enter proposal details..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposal-scope">Scope of Work Link</Label>
                <Input
                  id="proposal-scope"
                  type="url"
                  value={newProposal.scope_link}
                  onChange={(e) => setNewProposal({...newProposal, scope_link: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposal-terms">Terms & Conditions Link</Label>
                <Input
                  id="proposal-terms"
                  type="url"
                  value={newProposal.terms_link}
                  onChange={(e) => setNewProposal({...newProposal, terms_link: e.target.value})}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proposal-assets">Asset Links (one per line)</Label>
              <Textarea
                id="proposal-assets"
                value={newProposal.asset_links}
                onChange={(e) => setNewProposal({...newProposal, asset_links: e.target.value})}
                placeholder="https://asset1.com&#10;https://asset2.com"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateProposal}
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                Submit Proposal
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewProposalForm(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comment List */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-l-[#00eada]/20 pl-4">
                <div className="text-sm text-muted-foreground mb-1">
                  {format(new Date(comment.created_at), 'MMM dd, yyyy • HH:mm')}
                </div>
                <div className="text-sm">{comment.content}</div>
                {comment.attachment_links.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {comment.attachment_links.map((link, index) => (
                      <a 
                        key={index}
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-[#00eada] hover:underline block"
                      >
                        Attachment {index + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-muted-foreground text-sm">No comments yet</p>
            )}
          </div>

          {/* Add Comment */}
          <div className="border-t pt-4 space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              size="sm"
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposalCardThread;
