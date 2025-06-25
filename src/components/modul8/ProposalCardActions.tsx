
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { respondToProposalCard } from '@/services/proposalCardService';
import { CreateProposalResponseData } from '@/types/proposalCards';
import { CheckCircle, XCircle, MessageSquare, Loader2, Clock, Users } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useProposalCardResponses } from '@/hooks/useProposalCardResponses';

interface ProposalCardActionsProps {
  cardId: string;
  isLocked: boolean;
  onActionComplete: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
}

export const ProposalCardActions: React.FC<ProposalCardActionsProps> = ({
  cardId,
  isLocked,
  onActionComplete,
  showCounterOption = true,
  onCounterClick
}) => {
  const { session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [hasUserResponded, setHasUserResponded] = useState(false);
  const { acceptResponses, hasMutualAcceptance, hasAnyAcceptance } = useProposalCardResponses(cardId);

  const handleResponse = async (responseType: 'accept' | 'reject' | 'cancel') => {
    if (isLocked || hasUserResponded) {
      toast({
        title: "Action Not Available",
        description: "This proposal card has already been responded to.",
        variant: "destructive"
      });
      return;
    }

    // Check if current user already responded with this type
    const currentUserResponse = acceptResponses.find(r => r.responded_by === session?.user?.id);
    if (currentUserResponse && responseType === 'accept') {
      toast({
        title: "Already Responded",
        description: "You have already accepted this proposal.",
        variant: "default"
      });
      return;
    }

    setLoading(responseType);
    setHasUserResponded(true);
    
    try {
      const responseData: CreateProposalResponseData = {
        card_id: cardId,
        response_type: responseType
      };

      await respondToProposalCard(responseData);

      const actionMessages = {
        accept: hasAnyAcceptance 
          ? "Proposal accepted! Both parties have now accepted - deal confirmation is being processed."
          : "Proposal accepted successfully! Waiting for the other party's response.",
        reject: "Proposal rejected. The other party has been notified.",
        cancel: "Proposal cancelled successfully."
      };

      toast({
        title: "Success",
        description: actionMessages[responseType],
        variant: "default"
      });

      onActionComplete();
    } catch (error) {
      console.error(`Error ${responseType}ing proposal:`, error);
      setHasUserResponded(false); // Reset on error
      
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
    if (onCounterClick && !hasUserResponded) {
      setHasUserResponded(true);
      onCounterClick();
    }
  };

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4" />
        This proposal has been responded to
      </div>
    );
  }

  // Show acceptance status if there are any acceptances
  if (hasAnyAcceptance) {
    const currentUserAccepted = acceptResponses.some(r => r.responded_by === session?.user?.id);
    
    if (hasMutualAcceptance) {
      return (
        <div className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
          <Users className="h-4 w-4" />
          Both parties have accepted - Creating final confirmation...
        </div>
      );
    } else if (currentUserAccepted) {
      return (
        <div className="flex items-center gap-2 text-sm text-orange-400 font-semibold animate-pulse">
          <Clock className="h-4 w-4" />
          Awaiting other party's response...
        </div>
      );
    } else {
      // Show buttons when they accepted but current user hasn't responded
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-orange-400 font-semibold animate-pulse">
            <Clock className="h-4 w-4" />
            They accepted - Your response needed
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => handleResponse('reject')}
              disabled={loading !== null || hasUserResponded}
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
                disabled={loading !== null || hasUserResponded}
                variant="outline"
                size="sm"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Counter Proposal
              </Button>
            )}

            <Button
              onClick={() => handleResponse('accept')}
              disabled={loading !== null || hasUserResponded}
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
        </div>
      );
    }
  }

  // Default buttons for pending cards - Fixed order: Reject, Counter, Accept
  if (!hasUserResponded) {
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
  }

  return null;
};
