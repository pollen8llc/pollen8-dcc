
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { respondToProposalCard } from '@/services/proposalCardService';
import { CreateProposalResponseData, ProposalCardResponse } from '@/types/proposalCards';
import { CheckCircle, XCircle, MessageSquare, Loader2, Clock } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface ProposalCardResponseActionsProps {
  cardId: string;
  cardStatus: 'pending' | 'accepted' | 'rejected' | 'countered' | 'cancelled' | 'final_confirmation' | 'agreement';
  isLocked: boolean;
  submittedBy: string;
  responses: ProposalCardResponse[];
  acceptResponses: ProposalCardResponse[];
  hasCurrentUserResponded: boolean;
  onActionComplete: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
}

export const ProposalCardResponseActions: React.FC<ProposalCardResponseActionsProps> = ({
  cardId,
  cardStatus,
  isLocked,
  submittedBy,
  responses,
  acceptResponses,
  hasCurrentUserResponded,
  onActionComplete,
  showCounterOption = true,
  onCounterClick
}) => {
  const { session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const currentUserId = session?.user?.id;

  const handleResponse = async (responseType: 'accept' | 'reject' | 'cancel') => {
    setLoading(responseType);
    
    try {
      const responseData: CreateProposalResponseData = {
        card_id: cardId,
        response_type: responseType
      };

      await respondToProposalCard(responseData);

      const actionMessages = {
        accept: "✅ Proposal accepted! The other party will be notified.",
        reject: "❌ Proposal rejected. The other party has been notified.",
        cancel: "🚫 Proposal cancelled successfully."
      };

      toast({
        title: "Success",
        description: actionMessages[responseType],
        variant: "default"
      });

      onActionComplete();
    } catch (error) {
      console.error(`Error ${responseType}ing proposal:`, error);
      
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

  // Blanket check: Don't show actions if card has been responded to
  if (responses.length > 0 || cardStatus !== 'pending') {
    return null;
  }

  // Don't show actions for agreement cards - they handle their own UI
  if (cardStatus === 'agreement') {
    return null;
  }

  // Don't show actions for locked cards (rejected, cancelled, etc.)
  if (isLocked) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4" />
        This proposal has been responded to
      </div>
    );
  }

  // Show "they accepted, waiting for you" when other party accepted but current user hasn't responded
  const otherPartyAccepted = acceptResponses.some(r => r.responded_by !== currentUserId);
  const currentUserAccepted = acceptResponses.some(r => r.responded_by === currentUserId);
  
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

  // Show "awaiting response" when current user has responded
  if (hasCurrentUserResponded) {
    return (
      <div className="flex items-center gap-2 text-sm text-orange-400 font-semibold animate-pulse">
        <Clock className="h-4 w-4" />
        Awaiting other party's response...
      </div>
    );
  }

  // Default: Show action buttons for fresh proposals
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
