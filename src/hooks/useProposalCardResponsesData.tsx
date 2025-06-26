
import { useState, useEffect } from 'react';
import { getProposalCardResponses } from '@/services/proposalCardService';
import { ProposalCardResponse } from '@/types/proposalCards';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';

export const useProposalCardResponsesData = (cardIds: string[]) => {
  const { session } = useSession();
  const [responsesData, setResponsesData] = useState<Record<string, ProposalCardResponse[]>>({});
  const [loading, setLoading] = useState(true);

  const loadAllResponses = async () => {
    try {
      const responsePromises = cardIds.map(async (cardId) => {
        const responses = await getProposalCardResponses(cardId);
        return { cardId, responses };
      });
      
      const results = await Promise.all(responsePromises);
      const dataMap: Record<string, ProposalCardResponse[]> = {};
      
      results.forEach(({ cardId, responses }) => {
        dataMap[cardId] = responses;
      });
      
      setResponsesData(dataMap);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cardIds.length > 0) {
      loadAllResponses();
    }
  }, [cardIds.join(',')]);

  useEffect(() => {
    if (cardIds.length === 0) return;

    // Set up real-time subscription for all cards
    const channel = supabase
      .channel('proposal-card-responses-bulk')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'modul8_proposal_card_responses'
        },
        (payload) => {
          // Type-safe access to payload properties
          let affectedCardId: string | null = null;
          
          if (payload.new && typeof payload.new === 'object' && 'card_id' in payload.new) {
            affectedCardId = payload.new.card_id as string;
          } else if (payload.old && typeof payload.old === 'object' && 'card_id' in payload.old) {
            affectedCardId = payload.old.card_id as string;
          }
          
          // Only reload if the change affects one of our cards
          if (affectedCardId && cardIds.includes(affectedCardId)) {
            loadAllResponses();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cardIds.join(',')]);

  const getCardResponseData = (cardId: string) => {
    const responses = responsesData[cardId] || [];
    const acceptResponses = responses.filter(r => r.response_type === 'accept');
    const hasMutualAcceptance = acceptResponses.length >= 2;
    const hasAnyAcceptance = acceptResponses.length > 0;
    const hasCurrentUserResponded = responses.some(r => r.responded_by === session?.user?.id);

    // Debug logging for each card
    console.log(`Card ${cardId} response data:`, {
      totalResponses: responses.length,
      acceptResponses: acceptResponses.length,
      hasMutualAcceptance,
      hasAnyAcceptance,
      hasCurrentUserResponded,
      currentUserId: session?.user?.id,
      responseDetails: responses.map(r => ({
        respondedBy: r.responded_by,
        responseType: r.response_type,
        isCurrentUser: r.responded_by === session?.user?.id
      }))
    });

    return {
      responses,
      acceptResponses,
      hasMutualAcceptance,
      hasAnyAcceptance,
      hasCurrentUserResponded
    };
  };

  return {
    responsesData,
    loading,
    getCardResponseData,
    refresh: loadAllResponses
  };
};
