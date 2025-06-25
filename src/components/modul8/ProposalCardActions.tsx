
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { respondToProposalCard, createCounterProposalFromCard } from '@/services/proposalCardService';
import { CreateProposalResponseData, CreateProposalCardData } from '@/types/proposalCards';
import { CheckCircle, XCircle, MessageSquare, Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState<string | null>(null);

  const handleResponse = async (responseType: 'accept' | 'reject' | 'cancel') => {
    if (isLocked) {
      toast({
        title: "Action Not Available",
        description: "This proposal card has already been responded to.",
        variant: "destructive"
      });
      return;
    }

    setLoading(responseType);
    
    try {
      const responseData: CreateProposalResponseData = {
        card_id: cardId,
        response_type: responseType
      };

      await respondToProposalCard(responseData);

      const actionMessages = {
        accept: "Proposal accepted successfully! Waiting for the other party's response.",
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

  if (isLocked) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4" />
        This proposal has been responded to
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
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
    </div>
  );
};
