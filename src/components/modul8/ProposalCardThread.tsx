import React, { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  getProposalCards, 
  createProposalCard, 
  createCounterProposalFromCard,
  getRequestComments,
  createRequestComment
} from '@/services/proposalCardService';
import { ProposalCard, RequestComment } from '@/types/proposalCards';
import { ServiceRequest } from '@/types/modul8';
import { supabase } from '@/integrations/supabase/client';
import { useProposalCardResponsesData } from '@/hooks/useProposalCardResponsesData';
import { InitialRequestCard } from './InitialRequestCard';
import { ProposalTimeline } from './ProposalTimeline';
import { CommentsSection } from './CommentsSection';

interface ProposalCardThreadProps {
  requestId: string;
  isServiceProvider?: boolean;
  serviceRequest: ServiceRequest;
}

const ProposalCardThread: React.FC<ProposalCardThreadProps> = ({ 
  requestId, 
  isServiceProvider = false,
  serviceRequest
}) => {
  const { session } = useSession();
  const [proposalCards, setProposalCards] = useState<ProposalCard[]>([]);
  const [comments, setComments] = useState<RequestComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Get all card IDs for bulk response loading
  const cardIds = proposalCards.map(card => card.id);
  const { responsesData, getCardResponseData, refresh: refreshResponses } = useProposalCardResponsesData(cardIds);
  
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [counteringCardId, setCounteringCardId] = useState<string | null>(null);
  const [proposalNotes, setProposalNotes] = useState('');
  const [proposalScope, setProposalScope] = useState('');
  const [proposalTerms, setProposalTerms] = useState('');
  const [newComment, setNewComment] = useState('');
  const [initialRequestResponded, setInitialRequestResponded] = useState(false);
  const [negotiatedTitle, setNegotiatedTitle] = useState('');
  const [negotiatedDescription, setNegotiatedDescription] = useState('');
  const [negotiatedBudgetMin, setNegotiatedBudgetMin] = useState<number | ''>('');
  const [negotiatedBudgetMax, setNegotiatedBudgetMax] = useState<number | ''>('');
  const [negotiatedTimeline, setNegotiatedTimeline] = useState('');

  useEffect(() => {
    loadThreadData();

    // Set up real-time subscription for proposal cards
    const channel = supabase
      .channel('proposal-cards-thread')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'modul8_proposal_cards',
          filter: `request_id=eq.${requestId}`
        },
        () => {
          loadThreadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'modul8_proposal_card_responses'
        },
        () => {
          loadThreadData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'modul8_request_comments',
          filter: `request_id=eq.${requestId}`
        },
        () => {
          loadThreadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  const loadThreadData = async () => {
    if (!requestId) return;
    
    try {
      setLoading(true);
      const [cardsData, commentsData] = await Promise.all([
        getProposalCards(requestId),
        getRequestComments(requestId)
      ]);
      
      console.log('Loaded proposal cards:', cardsData);
      console.log('Service request status:', serviceRequest.status);
      console.log('Is service provider:', isServiceProvider);
      
      setProposalCards(cardsData);
      setComments(commentsData);
      
      const hasProposalCards = cardsData.length > 0;
      setInitialRequestResponded(hasProposalCards);
      
      console.log('Initial request responded:', hasProposalCards);
      
      // Initialize negotiated fields with current request data
      if (serviceRequest) {
        setNegotiatedTitle(serviceRequest.title || '');
        setNegotiatedDescription(serviceRequest.description || '');
        setNegotiatedBudgetMin(serviceRequest.budget_range?.min || '');
        setNegotiatedBudgetMax(serviceRequest.budget_range?.max || '');
        setNegotiatedTimeline(serviceRequest.timeline || '');
      }
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

  const handleActionComplete = async () => {
    await Promise.all([
      loadThreadData(),
      refreshResponses()
    ]);
  };

  const handleInitialRequestResponse = async (responseType: 'accept' | 'reject' | 'counter') => {
    try {
      setSubmitting(true);
      
      if (responseType === 'counter') {
        setNegotiatedTitle(serviceRequest.title || '');
        setNegotiatedDescription(serviceRequest.description || '');
        setNegotiatedBudgetMin(serviceRequest.budget_range?.min || '');
        setNegotiatedBudgetMax(serviceRequest.budget_range?.max || '');
        setNegotiatedTimeline(serviceRequest.timeline || '');
        setCounteringCardId(null);
        setShowProposalForm(true);
        setInitialRequestResponded(true);
        return;
      }

      const content = responseType === 'accept' 
        ? 'Initial request accepted as proposed.' 
        : 'Initial request declined.';
      
      await createRequestComment({
        request_id: requestId,
        content,
        attachment_links: []
      });

      toast({
        title: responseType === 'accept' ? "Request Accepted" : "Request Declined",
        description: `The initial request has been ${responseType}ed successfully`
      });

      setInitialRequestResponded(true);
      await loadThreadData();
    } catch (error) {
      console.error('Error responding to initial request:', error);
      toast({
        title: "Error",
        description: "Failed to respond to initial request",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitProposal = async () => {
    if (!proposalNotes.trim() || !negotiatedTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide proposal notes and project title",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      if (counteringCardId) {
        await createCounterProposalFromCard(counteringCardId, {
          request_id: requestId,
          notes: proposalNotes,
          scope_link: proposalScope || undefined,
          terms_link: proposalTerms || undefined,
          asset_links: [],
          negotiated_title: negotiatedTitle,
          negotiated_description: negotiatedDescription,
          negotiated_budget_range: {
            min: negotiatedBudgetMin ? Number(negotiatedBudgetMin) : undefined,
            max: negotiatedBudgetMax ? Number(negotiatedBudgetMax) : undefined,
            currency: 'USD'
          },
          negotiated_timeline: negotiatedTimeline
        });
        
        toast({
          title: "Counter Proposal Submitted",
          description: "Your counter proposal has been submitted successfully"
        });
      } else {
        await createProposalCard({
          request_id: requestId,
          notes: proposalNotes,
          scope_link: proposalScope || undefined,
          terms_link: proposalTerms || undefined,
          asset_links: [],
          negotiated_title: negotiatedTitle,
          negotiated_description: negotiatedDescription,
          negotiated_budget_range: {
            min: negotiatedBudgetMin ? Number(negotiatedBudgetMin) : undefined,
            max: negotiatedBudgetMax ? Number(negotiatedBudgetMax) : undefined,
            currency: 'USD'
          },
          negotiated_timeline: negotiatedTimeline
        });

        toast({
          title: "Proposal Submitted",
          description: "Your proposal has been submitted successfully"
        });
      }

      setProposalNotes('');
      setProposalScope('');
      setProposalTerms('');
      setShowProposalForm(false);
      setCounteringCardId(null);
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
        const card = proposalCards.find(c => c.id === cardId);
        if (card) {
          setNegotiatedTitle(card.negotiated_title || '');
          setNegotiatedDescription(card.negotiated_description || '');
          setNegotiatedBudgetMin(card.negotiated_budget_range?.min || '');
          setNegotiatedBudgetMax(card.negotiated_budget_range?.max || '');
          setNegotiatedTimeline(card.negotiated_timeline || '');
          setProposalNotes(card.notes || '');
          setProposalScope(card.scope_link || '');
          setProposalTerms(card.terms_link || '');
        }
        setCounteringCardId(cardId);
        setShowProposalForm(true);
        return;
      }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Initial Request Card */}
      <InitialRequestCard
        serviceRequest={serviceRequest}
        initialRequestResponded={initialRequestResponded}
        isServiceProvider={isServiceProvider}
        submitting={submitting}
        onResponse={handleInitialRequestResponse}
      />

      {/* Proposal Cards Timeline */}
      <ProposalTimeline
        proposalCards={proposalCards}
        onActionComplete={handleActionComplete}
        onCounterClick={(cardId) => handleRespondToCard(cardId, 'counter')}
      />

      {/* New Proposal Form - Only shown when explicitly triggered */}
      {showProposalForm && (
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
              <Send className="h-5 w-5 text-[#00eada]" />
              {counteringCardId ? 'Submit Counter Proposal' : (proposalCards.length === 0 ? 'Submit Your Counter Proposal' : 'Submit Counter Proposal')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Project Details
              </h3>
              
              <div>
                <Label htmlFor="negotiated-title" className="text-sm font-semibold text-white">
                  Project Title *
                </Label>
                <Input
                  id="negotiated-title"
                  value={negotiatedTitle}
                  onChange={(e) => setNegotiatedTitle(e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="negotiated-description" className="text-sm font-semibold text-white">
                  Project Description
                </Label>
                <Textarea
                  id="negotiated-description"
                  placeholder="Describe the project requirements and scope..."
                  value={negotiatedDescription}
                  onChange={(e) => setNegotiatedDescription(e.target.value)}
                  className="mt-2 min-h-[100px] bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget-min" className="text-sm font-semibold text-white">
                    Budget Min ($)
                  </Label>
                  <Input
                    id="budget-min"
                    type="number"
                    placeholder="5000"
                    value={negotiatedBudgetMin}
                    onChange={(e) => setNegotiatedBudgetMin(e.target.value ? Number(e.target.value) : '')}
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="budget-max" className="text-sm font-semibold text-white">
                    Budget Max ($)
                  </Label>
                  <Input
                    id="budget-max"
                    type="number"
                    placeholder="10000"
                    value={negotiatedBudgetMax}
                    onChange={(e) => setNegotiatedBudgetMax(e.target.value ? Number(e.target.value) : '')}
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="negotiated-timeline" className="text-sm font-semibold text-white">
                  Timeline
                </Label>
                <Input
                  id="negotiated-timeline"
                  placeholder="e.g., 2-3 weeks, 1 month"
                  value={negotiatedTimeline}
                  onChange={(e) => setNegotiatedTimeline(e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Proposal Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                Proposal Details
              </h3>
              
              <div>
                <Label htmlFor="proposal-notes" className="text-sm font-semibold text-white">
                  Proposal Notes *
                </Label>
                <Textarea
                  id="proposal-notes"
                  placeholder="Describe your approach, methodology, and key points..."
                  value={proposalNotes}
                  onChange={(e) => setProposalNotes(e.target.value)}
                  className="mt-2 min-h-[120px] bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scope-link" className="text-sm font-semibold text-white">
                    Scope Document (Optional)
                  </Label>
                  <Input
                    id="scope-link"
                    type="url"
                    placeholder="https://docs.google.com/document/..."
                    value={proposalScope}
                    onChange={(e) => setProposalScope(e.target.value)}
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="terms-link" className="text-sm font-semibold text-white">
                    Terms Document (Optional)
                  </Label>
                  <Input
                    id="terms-link"
                    type="url"
                    placeholder="https://docs.google.com/document/..."
                    value={proposalTerms}
                    onChange={(e) => setProposalTerms(e.target.value)}
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmitProposal}
                disabled={submitting || !proposalNotes.trim() || !negotiatedTitle.trim()}
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-semibold border-0"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit {counteringCardId ? 'Counter ' : ''}Proposal
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowProposalForm(false);
                  setCounteringCardId(null);
                }}
                variant="outline"
                disabled={submitting}
                className="border-gray-700 bg-gray-800 hover:bg-gray-700 text-white"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <CommentsSection
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        submitting={submitting}
        onAddComment={handleAddComment}
        currentUserId={session?.user?.id}
      />
    </div>
  );
};

export default ProposalCardThread;
