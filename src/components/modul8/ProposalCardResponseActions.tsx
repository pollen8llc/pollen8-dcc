
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
  const currentUserId = session?.user?.id;

  // Debug logging
  console.log('ProposalCardResponseActions Debug:', {
    cardId,
    submittedBy,
    currentUserId,
    isCurrentUserSubmitter: submittedBy === currentUserId,
    hasMutualAcceptance,
    hasAnyAcceptance,
    hasCurrentUserResponded,
    responses: responses.length,
    acceptResponses: acceptResponses.length,
    // Add more detailed info about who accepted
    acceptedBy: acceptResponses.map(r => r.responded_by),
    currentUserInAcceptList: acceptResponses.some(r => r.responded_by === currentUserId)
  });

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
  if (submittedBy === currentUserId) {
    console.log('Hiding buttons: Current user is the submitter');
    return null;
  }

  // Show mutual acceptance status with celebration and DEEL button
  if (hasMutualAcceptance) {
    console.log('Showing DEEL button: Mutual acceptance achieved');
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold animate-pulse">
          <Sparkles className="h-4 w-4" />
          Both parties have accepted - seal the deal
        </div>
        <div className="deel-integration-container w-full relative">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 p-[2px] animate-spin">
            <div className="w-full h-full bg-white rounded-lg"></div>
          </div>
          <Button
            onClick={() => window.open('https://app.deel.com/login', '_blank')}
            className="relative w-full bg-white hover:bg-gray-50 text-black font-bold text-lg py-6 border-0 rounded-lg z-10"
            size="lg"
          >
            DEEL
          </Button>
        </div>
      </div>
    );
  }

  // CRITICAL FIX: "THEY ACCEPTED" scenario - show buttons when someone else accepted but current user hasn't responded
  // Check if there's any acceptance AND the current user is NOT in the accept list AND hasn't responded at all
  const currentUserAccepted = acceptResponses.some(r => r.responded_by === currentUserId);
  const shouldShowTheyAcceptedButtons = hasAnyAcceptance && !currentUserAccepted && !hasCurrentUserResponded;
  
  if (shouldShowTheyAcceptedButtons) {
    console.log('Showing "they accepted" buttons: Other party accepted, current user hasn\'t responded');
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
    console.log('Showing awaiting response: Current user responded, waiting for other party');
    return (
      <div className="flex items-center gap-2 text-sm text-orange-400 font-semibold animate-pulse">
        <Clock className="h-4 w-4" />
        Awaiting other party's response...
      </div>
    );
  }

  // Check if card is truly locked (both parties responded or cancelled/rejected)
  if (isLocked && (hasMutualAcceptance || hasCurrentUserResponded)) {
    console.log('Showing locked status: Card is locked and user has responded');
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4" />
        This proposal has been responded to
      </div>
    );
  }

  // Default: Show action buttons for new proposals where current user hasn't responded
  console.log('Showing default action buttons: Fresh proposal, no responses from current user');
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
