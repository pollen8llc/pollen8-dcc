
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { respondToProposalCard } from '@/services/proposalCardService';
import { CreateProposalResponseData } from '@/types/proposalCards';
import { CheckCircle, XCircle, MessageSquare, Loader2, Clock } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { useProposalCardResponses } from '@/hooks/useProposalCardResponses';
import { assignServiceProvider, getServiceProviderByUserId } from '@/services/serviceRequestService';

interface ProposalCardActionsProps {
  cardId: string;
  isLocked: boolean;
  onActionComplete: () => void;
  showCounterOption?: boolean;
  onCounterClick?: () => void;
  hasCounterResponse?: boolean;
  submittedBy?: string;
  requestId?: string;
  providerId?: string;
  responseData?: {
    responses: any[];
    hasCurrentUserResponded: boolean;
    acceptResponses: any[];
    hasMutualAcceptance: boolean;
    hasAnyAcceptance: boolean;
  };
}

export const ProposalCardActions: React.FC<ProposalCardActionsProps> = ({
  cardId,
  isLocked,
  onActionComplete,
  showCounterOption = true,
  onCounterClick,
  hasCounterResponse = false,
  submittedBy,
  requestId,
  providerId,
  responseData
}) => {
  const { session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  
  // Use passed response data if available, otherwise fall back to hook
  const hookData = useProposalCardResponses(responseData ? '' : cardId);
  const responses = responseData?.responses || hookData.responses;
  const responsesLoading = responseData ? false : hookData.loading;
  const acceptResponses = responseData?.acceptResponses || hookData.acceptResponses;
  const hasCurrentUserResponded = responseData?.hasCurrentUserResponded ?? hookData.hasCurrentUserResponded;
  
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
        accept: "Response sent successfully! The other party will be notified.",
        reject: "Response sent successfully! The other party has been notified.",
        cancel: "Proposal cancelled successfully."
      };

      toast({
        title: "Success",
        description: actionMessages[responseType],
        variant: "default"
      });

      console.log('🔄 Calling onActionComplete to refresh data...');
      onActionComplete();

      // Handle service provider assignment when accepting
      if (responseType === 'accept' && requestId && currentUserId) {
        try {
          // Get the service provider ID for the current user
          const serviceProvider = await getServiceProviderByUserId(currentUserId);
          if (serviceProvider) {
            await assignServiceProvider(requestId, serviceProvider.id);
            console.log('✅ Service provider assigned successfully');
          }
        } catch (error) {
          console.error('❌ Error assigning service provider:', error);
          // Don't fail the whole operation if assignment fails
        }
      }
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

  // If card is locked (final status reached), hide buttons
  if (isLocked) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4" />
        This proposal has been finalized
      </div>
    );
  }

  // If the current user has already responded, hide action buttons
  if (hasCurrentUserResponded) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <CheckCircle className="h-4 w-4 text-green-500" />
        Response sent - awaiting other party's response
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
