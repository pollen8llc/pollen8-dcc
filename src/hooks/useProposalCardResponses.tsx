
import { useState, useEffect } from 'react';
import { getProposalCardResponses } from '@/services/proposalCardService';
import { ProposalCardResponse } from '@/types/proposalCards';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/hooks/useSession';

export const useProposalCardResponses = (cardId: string) => {
  const { session } = useSession();
  const [responses, setResponses] = useState<ProposalCardResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResponses = async () => {
    try {
      const data = await getProposalCardResponses(cardId);
      setResponses(data);
    } catch (error) {
      console.error('Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResponses();

    // Set up real-time subscription
    const channel = supabase
      .channel('proposal-card-responses')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'modul8_proposal_card_responses',
          filter: `card_id=eq.${cardId}`
        },
        () => {
          loadResponses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cardId]);

  const acceptResponses = responses.filter(r => r.response_type === 'accept');
  const hasMutualAcceptance = acceptResponses.length >= 2;
  const hasAnyAcceptance = acceptResponses.length > 0;
  
  // Check if current user has already responded
  const hasCurrentUserResponded = responses.some(r => r.responded_by === session?.user?.id);

  return {
    responses,
    loading,
    acceptResponses,
    hasMutualAcceptance,
    hasAnyAcceptance,
    hasCurrentUserResponded,
    refresh: loadResponses
  };
};
