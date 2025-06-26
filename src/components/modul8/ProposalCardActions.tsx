
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
  const { responses } = useProposalCardResponses(cardId);

  const handleResponse = async (responseType: 'accept' | 'reject' | 'cancel') => {
    console.log(`🔥 STARTING RESPONSE: ${responseType} for card ${cardId}`);
    console.log('Current user ID:', session?.user?.id);
    
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

      console.log('🔄 Calling onActionComplete to refresh data...');
      onActionComplete();
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
    currentUserId: session?.user?.id
  });

  // SIMPLIFIED LOGIC: If there are any responses at all, hide the buttons
  if (responses.length > 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        This proposal has been responded to
      </div>
    );
  }

  // If card is locked (final status reached), hide buttons
  if (isLocked) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4" />
        This proposal has been finalized
      </div>
    );
  }

  // Show action buttons for fresh proposals that need responses
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
