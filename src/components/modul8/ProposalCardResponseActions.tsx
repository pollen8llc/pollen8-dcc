
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { respondToProposalCard } from '@/services/proposalCardService';
import { CreateProposalResponseData, ProposalCardResponse } from '@/types/proposalCards';
import { CheckCircle, XCircle, MessageSquare, Loader2, Clock, Users, Sparkles } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface ProposalCardResponseActionsProps {
  cardId: string;
  isLocked: boolean;
  submittedBy: string;
  responses: ProposalCardResponse[];
  acceptResponses: ProposalCardResponse[];
  hasMutualAcceptance: boolean;
  hasAnyAcceptance: boolean;
  hasCurrentUserResponded: boolean;
  onActionComplete: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
}

export const ProposalCardResponseActions: React.FC<ProposalCardResponseActionsProps> = ({
  cardId,
  isLocked,
  submittedBy,
  responses,
  acceptResponses,
  hasMutualAcceptance,
  hasAnyAcceptance,
  hasCurrentUserResponded,
  onActionComplete,
  showCounterOption = true,
  onCounterClick
}) => {
  const { session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleResponse = async (responseType: 'accept' | 'reject' | 'cancel') => {
    setLoading(responseType);
    
    try {
      const responseData: CreateProposalResponseData = {
        card_id: cardId,
        response_type: responseType
      };

      await respondToProposalCard(responseData);

      const actionMessages = {
        accept: hasAnyAcceptance 
          ? "🎉 Proposal accepted! Both parties have now accepted - deal confirmation is being processed."
          : "✅ Proposal accepted successfully! Waiting for the other party's response.",
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

  // Don't show actions for cards submitted by current user
  if (submittedBy === session?.user?.id) {
    return null;
  }

  // Show mutual acceptance status with celebration and DEEL button
  if (hasMutualAcceptance) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold animate-pulse">
          <Sparkles className="h-4 w-4" />
          Both parties have accepted - seal the deal
        </div>
        <Button
          onClick={() => window.open('https://app.deel.com/login', '_blank')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          size="sm"
        >
          DEEL
        </Button>
      </div>
    );
  }

  // PRIORITY: "THEY ACCEPTED" scenario - show buttons when someone else accepted but current user hasn't responded
  if (hasAnyAcceptance && !hasCurrentUserResponded && !hasMutualAcceptance) {
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
            {loading === 'accept' ? 'Accepting...' : 'Accept & Close Deal!'}
          </Button>
        </div>
      </div>
    );
  }

  // Show "awaiting response" when current user has responded but no mutual acceptance yet
  if (hasCurrentUserResponded && !hasMutualAcceptance) {
    return (
      <div className="flex items-center gap-2 text-sm text-orange-400 font-semibold animate-pulse">
        <Clock className="h-4 w-4" />
        Awaiting other party's response...
      </div>
    );
  }

  // Check if card is truly locked
  const isTrulyLocked = isLocked && (hasMutualAcceptance || (!hasAnyAcceptance && hasCurrentUserResponded));

  if (isTrulyLocked) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4" />
        This proposal has been responded to
      </div>
    );
  }

  // Default: Show action buttons for new proposals
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
