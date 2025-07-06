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
  submittedBy?: string;
}

export const ProposalCardActions: React.FC<ProposalCardActionsProps> = ({
  cardId,
  isLocked,
  onActionComplete,
  showCounterOption = true,
  onCounterClick,
  hasCounterResponse = false,
  submittedBy
}) => {
  const { session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const { responses, loading: responsesLoading, acceptResponses, hasCurrentUserResponded } = useProposalCardResponses(cardId);
  const currentUserId = session?.user?.id;

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
    currentUserId: session?.user?.id,
    responsesLoading,
    submittedBy
  });

  // If still loading responses, show loading state
  if (responsesLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  // If the current user has already responded, hide action buttons
  if (hasCurrentUserResponded) {
    return (
      <div className="flex items-center gap-2 text-sm text-orange-400 font-semibold animate-pulse">
        <Clock className="h-4 w-4" />
        Awaiting other party's response...
      </div>
    );
  }

  // Check if other party has accepted but current user hasn't responded
  const otherPartyAccepted = acceptResponses.some(r => r.responded_by !== currentUserId);
  
  // Show "they accepted, waiting for you" when other party accepted but current user hasn't responded
  if (otherPartyAccepted && !hasCurrentUserResponded) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-orange-400 font-medium animate-pulse">
          🔥 The other party has accepted this proposal!
        </div>
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
            className="bg-green-600 hover:bg-green-700 text-white animate-pulse"
            size="sm"
          >
            {loading === 'accept' ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {loading === 'accept' ? 'Accepting...' : 'Accept & Create Agreement!'}
          </Button>
        </div>
      </div>
    );
  }

  // Default: Show action buttons for fresh proposals that need responses
  console.log(`✅ Showing buttons for card ${cardId} - no responses found or ready for action`);
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
