
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
      console.log('🔄 Loading responses for card:', cardId);
      const data = await getProposalCardResponses(cardId);
      console.log('📥 Loaded responses:', data);
      setResponses(data);
    } catch (error) {
      console.error('❌ Error loading responses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cardId) {
      loadResponses();
    }
  }, [cardId]);

  useEffect(() => {
    if (!cardId) return;

    console.log('🔔 Setting up real-time subscription for card:', cardId);

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
        (payload) => {
          console.log('🔔 Real-time update received:', payload);
          loadResponses();
        }
      )
      .subscribe();

    return () => {
      console.log('🔇 Cleaning up subscription for card:', cardId);
      supabase.removeChannel(channel);
    };
  }, [cardId]);

  const acceptResponses = responses.filter(r => r.response_type === 'accept');
  const hasMutualAcceptance = acceptResponses.length >= 2;
  const hasAnyAcceptance = acceptResponses.length > 0;
  
  // Check if current user has already responded
  const hasCurrentUserResponded = responses.some(r => r.responded_by === session?.user?.id);

  // Debug logging
  console.log(`🔍 useProposalCardResponses for card ${cardId}:`, {
    totalResponses: responses.length,
    acceptResponses: acceptResponses.length,
    hasMutualAcceptance,
    hasAnyAcceptance,
    hasCurrentUserResponded,
    currentUserId: session?.user?.id,
    responses: responses.map(r => ({
      id: r.id,
      response_type: r.response_type,
      responded_by: r.responded_by,
      isCurrentUser: r.responded_by === session?.user?.id
    }))
  });

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
