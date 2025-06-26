
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { respondToProposalCard } from '@/services/proposalCardService';
import { CreateProposalResponseData } from '@/types/proposalCards';
import { CheckCircle, XCircle, MessageSquare, Loader2, Clock } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useProposalCardResponses } from '@/hooks/useProposalCardResponses';

interface ProposalCardActionsProps {
  cardId: string;
  isLocked: boolean;
  onActionComplete: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
  hasCounterResponse?: boolean;
}

export const ProposalCardActions: React.FC<ProposalCardActionsProps> = ({
  cardId,
  isLocked,
  onActionComplete,
  showCounterOption = true,
  onCounterClick,
  hasCounterResponse = false
}) => {
  const { session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const { responses, loading: responsesLoading, refresh } = useProposalCardResponses(cardId);

  const handleResponse = async (responseType: 'accept' | 'reject' | 'cancel') => {
    console.log(`🔥 STARTING RESPONSE: ${responseType} for card ${cardId}`);
    console.log('Current user ID:', session?.user?.id);
    console.log('Current responses before action:', responses);
    
    setLoading(responseType);
    
    try {
      const responseData: CreateProposalResponseData = {
        card_id: cardId,
        response_type: responseType
      };

      console.log('🚀 Calling respondToProposalCard with:', responseData);
      const result = await respondToProposalCard(responseData);
      console.log('✅ Response created successfully:', result);

      const actionMessages = {
        accept: "Proposal accepted successfully!",
        reject: "Proposal rejected. The other party has been notified.",
        cancel: "Proposal cancelled successfully."
      };

      toast({
        title: "Success",
        description: actionMessages[responseType],
        variant: "default"
      });

      console.log('🔄 Manually refreshing responses data...');
      await refresh(); // Manually refresh the responses
      
      console.log('🔄 Calling onActionComplete to refresh parent data...');
      onActionComplete();
      
      // Force a small delay to ensure real-time updates have processed
      setTimeout(() => {
        console.log('🔄 Final refresh after delay...');
        refresh();
      }, 1000);
      
    } catch (error) {
      console.error(`❌ Error ${responseType}ing proposal:`, error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        cardId,
        responseType,
        userId: session?.user?.id
      });
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to ${responseType} proposal. Please try again.`;
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCounterProposal = () => {
    if (onCounterClick) {
      onCounterClick();
    }
  };

  // Debug logging for current state
  console.log(`🔍 ProposalCardActions for card ${cardId}:`, {
    isLocked,
    responsesCount: responses.length,
    hasCounterResponse,
    currentUserId: session?.user?.id,
    responsesLoading,
    responses: responses.map(r => ({
      id: r.id,
      response_type: r.response_type,
      responded_by: r.responded_by,
      created_at: r.created_at
    }))
  });

  // If still loading responses, show loading state
  if (responsesLoading) {
    console.log(`⏳ Still loading responses for card ${cardId}`);
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  // CORE LOGIC: If there are ANY responses at all, hide the buttons
  if (responses.length > 0) {
    console.log(`🚫 HIDING BUTTONS - found ${responses.length} responses for card ${cardId}:`, 
      responses.map(r => `${r.response_type} by ${r.responded_by}`));
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        This proposal has been responded to ({responses.length} response{responses.length > 1 ? 's' : ''})
      </div>
    );
  }

  // If card is locked (final status reached), hide buttons
  if (isLocked) {
    console.log(`🔒 Card ${cardId} is locked`);
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4" />
        This proposal has been finalized
      </div>
    );
  }

  // Show action buttons for fresh proposals that need responses
  console.log(`✅ SHOWING BUTTONS for card ${cardId} - no responses found, not locked`);
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        onClick={() => handleResponse('reject')}
        disabled={loading !== null}
        variant="destructive"
        size="sm"
      >
        {loading === 'reject' ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <XCircle className="h-4 w-4 mr-2" />
        )}
        {loading === 'reject' ? 'Rejecting...' : 'Reject'}
      </Button>

      {showCounterOption && (
        <Button
          onClick={handleCounterProposal}
          disabled={loading !== null}
          variant="outline"
          size="sm"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Counter Proposal
        </Button>
      )}

      <Button
        onClick={() => handleResponse('accept')}
        disabled={loading !== null}
        className="bg-green-600 hover:bg-green-700 text-white"
        size="sm"
      >
        {loading === 'accept' ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-2" />
        )}
        {loading === 'accept' ? 'Accepting...' : 'Accept'}
      </Button>
    </div>
  );
};
