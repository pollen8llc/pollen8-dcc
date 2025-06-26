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
  Paperclip,
  Calendar,
  PlayCircle,
  ExternalLink,
  Star,
  Sparkles
} from 'lucide-react';
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
import { ProposalCardStatus } from './ProposalCardStatus';
import { DeelIntegrationButton } from './DeelIntegrationButton';
import { ProposalCardResponseActions } from './ProposalCardResponseActions';
import { supabase } from '@/integrations/supabase/client';
import { useProposalCardResponsesData } from '@/hooks/useProposalCardResponsesData';

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Initial Request Card */}
      <Card className="border-l-4 border-l-emerald-500 bg-gray-900/80 backdrop-blur-sm border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold px-3 py-1 flex items-center gap-1">
              <PlayCircle className="h-4 w-4" />
              Card #1
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-bold px-3 py-1 flex items-center gap-1">
              <Clock className="h-4 w-4" />
              INITIAL REQUEST
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Avatar className="h-6 w-6">
                <AvatarImage src={serviceRequest.organizer?.logo_url} />
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                  <Building className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-300">
                {serviceRequest.organizer?.organization_name || 'Client'}
              </span>
              <span className="text-gray-500">
                {new Date(serviceRequest.created_at).toLocaleDateString()} at {new Date(serviceRequest.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{serviceRequest.title}</h3>
              {serviceRequest.description && (
                <p className="text-gray-300 leading-relaxed">{serviceRequest.description}</p>
              )}
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-sm font-semibold text-white mb-3">Proposed Project Details:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">
                    Budget: {serviceRequest.budget_range && (serviceRequest.budget_range.min || serviceRequest.budget_range.max) 
                      ? (serviceRequest.budget_range.min && serviceRequest.budget_range.max 
                        ? `$${serviceRequest.budget_range.min.toLocaleString()} - $${serviceRequest.budget_range.max.toLocaleString()}`
                        : serviceRequest.budget_range.min 
                        ? `From $${serviceRequest.budget_range.min.toLocaleString()}`
                        : serviceRequest.budget_range.max 
                        ? `Up to $${serviceRequest.budget_range.max.toLocaleString()}`
                        : 'Budget TBD')
                      : 'Budget TBD'
                    }
                  </span>
                </div>
                
                {serviceRequest.timeline && (
                  <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">{serviceRequest.timeline}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {!initialRequestResponded && isServiceProvider && (
            <div className="flex gap-2 pt-4 border-t border-gray-700 mt-4">
              <Button
                onClick={() => handleInitialRequestResponse('accept')}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={submitting}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Accept
              </Button>
              <Button
                onClick={() => handleInitialRequestResponse('reject')}
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                disabled={submitting}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                onClick={() => handleInitialRequestResponse('counter')}
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

      {/* Proposal Cards Timeline */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Proposal Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {proposalCards.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p className="text-lg font-medium">No proposals yet</p>
              <p className="text-sm">The proposal timeline will appear here as cards are created.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposalCards.map((card, index) => {
                const responseData = getCardResponseData(card.id);
                const {
                  responses,
                  acceptResponses,
                  hasMutualAcceptance,
                  hasAnyAcceptance,
                  hasCurrentUserResponded
                } = responseData;
                
                return (
                  <Card key={card.id} className={`border-l-4 ${card.status === 'final_confirmation' ? 'border-l-yellow-500 bg-gradient-to-r from-yellow-900/20 to-gray-900/80' : 'border-l-primary bg-gray-900/80'} backdrop-blur-sm border-gray-800`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge className={`${card.status === 'final_confirmation' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-primary/10 text-primary'} font-bold px-3 py-1 flex items-center gap-1`}>
                              {card.status === 'final_confirmation' && <Sparkles className="h-4 w-4" />}
                              Card #{index + 2}
                            </Badge>
                            <ProposalCardStatus
                              cardId={card.id}
                              cardStatus={card.status}
                              submittedBy={card.submitted_by}
                              isLocked={card.is_locked}
                            />
                            {card.response_to_card_id && (
                              <Badge variant="outline" className="text-orange-400 border-orange-500/30">
                                Counter Proposal
                              </Badge>
                            )}
                            {card.status === 'final_confirmation' && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse">
                                🎉 DEAL CONFIRMED
                              </Badge>
                            )}
                          </div>
                          
                          {/* Show negotiated request details if they exist */}
                          {(card.negotiated_title || card.negotiated_description || card.negotiated_budget_range || card.negotiated_timeline) && (
                            <div className="bg-gray-800/50 rounded-lg p-4 mb-4 border border-gray-700">
                              <h4 className="text-sm font-semibold text-white mb-3">Proposed Project Details:</h4>
                              {card.negotiated_title && (
                                <div className="mb-2">
                                  <span className="text-xs font-medium text-gray-400">Title: </span>
                                  <span className="text-sm text-gray-300">{card.negotiated_title}</span>
                                </div>
                              )}
                              {card.negotiated_description && (
                                <div className="mb-2">
                                  <span className="text-xs font-medium text-gray-400">Description: </span>
                                  <span className="text-sm text-gray-300">{card.negotiated_description}</span>
                                </div>
                              )}
                              {card.negotiated_budget_range && (
                                <div className="mb-2">
                                  <span className="text-xs font-medium text-gray-400">Budget: </span>
                                  <span className="text-sm text-gray-300">
                                    {card.negotiated_budget_range.min && card.negotiated_budget_range.max 
                                      ? `$${card.negotiated_budget_range.min.toLocaleString()} - $${card.negotiated_budget_range.max.toLocaleString()}`
                                      : card.negotiated_budget_range.min 
                                      ? `From $${card.negotiated_budget_range.min.toLocaleString()}`
                                      : card.negotiated_budget_range.max 
                                      ? `Up to $${card.negotiated_budget_range.max.toLocaleString()}`
                                      : 'Budget TBD'
                                    }
                                  </span>
                                </div>
                              )}
                              {card.negotiated_timeline && (
                                <div>
                                  <span className="text-xs font-medium text-gray-400">Timeline: </span>
                                  <span className="text-sm text-gray-300">{card.negotiated_timeline}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {card.notes && (
                            <div className="bg-gray-800/30 rounded-lg p-4 mb-4 border border-gray-700">
                              <p className="text-sm text-gray-300 leading-relaxed">{card.notes}</p>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {card.submitted_by === session?.user?.id ? 'You' : 'Other Party'}
                            </span>
                            <span>{new Date(card.created_at).toLocaleDateString()}</span>
                            {card.scope_link && (
                              <a href={card.scope_link} target="_blank" rel="noopener noreferrer" 
                                 className="text-primary hover:underline flex items-center gap-1">
                                <Paperclip className="h-4 w-4" />
                                Scope
                              </a>
                            )}
                            {card.terms_link && (
                              <a href={card.terms_link} target="_blank" rel="noopener noreferrer" 
                                 className="text-primary hover:underline flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                Terms
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Final Confirmation DEEL Integration */}
                      {card.status === 'final_confirmation' && (
                        <div className="mb-4">
                          <DeelIntegrationButton
                            projectTitle={card.negotiated_title}
                            projectDescription={card.negotiated_description}
                            budgetRange={card.negotiated_budget_range}
                            timeline={card.negotiated_timeline}
                            organizerName={serviceRequest.organizer?.organization_name}
                            serviceProviderName="Service Provider" // TODO: Get actual service provider name
                          />
                        </div>
                      )}
                      
                      {/* Response Actions */}
                      <div className="pt-4 border-t border-gray-700">
                        <ProposalCardResponseActions
                          cardId={card.id}
                          cardStatus={card.status}
                          isLocked={card.is_locked}
                          submittedBy={card.submitted_by}
                          responses={responses}
                          acceptResponses={acceptResponses}
                          hasCurrentUserResponded={hasCurrentUserResponded}
                          onActionComplete={handleActionComplete}
                          onCounterClick={() => handleRespondToCard(card.id, 'counter')}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Proposal Form - Only shown when explicitly triggered */}
      {showProposalForm && (
        <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-black text-white flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
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
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
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
                className="border-gray-700 hover:bg-gray-800 text-white"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-black text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Project Discussion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Comments List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-sm">No comments yet. Start the discussion!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">
                        {comment.user_id === session?.user?.id ? 'You' : 'Other Party'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* New Comment Form */}
          <Separator className="bg-gray-700" />
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment to the discussion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] bg-gray-800 border-gray-700 text-white"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleAddComment}
                disabled={submitting || !newComment.trim()}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground" />
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
