
import { supabase } from "@/integrations/supabase/client";
import { 
  ProposalCard, 
  ProposalCardResponse, 
  RequestComment,
  CreateProposalCardData,
  CreateProposalResponseData,
  CreateCommentData
} from "@/types/proposalCards";

export const getProposalCards = async (requestId: string): Promise<ProposalCard[]> => {
  const { data, error } = await supabase
    .from('modul8_proposal_cards')
    .select('*')
    .eq('request_id', requestId)
    .order('card_number', { ascending: true });

  if (error) throw error;
  return (data || []).map(card => ({
    ...card,
    asset_links: Array.isArray(card.asset_links) ? card.asset_links : []
  })) as ProposalCard[];
};

export const createProposalCard = async (data: CreateProposalCardData): Promise<ProposalCard> => {
  // Get the next card number for this request
  const { data: existingCards } = await supabase
    .from('modul8_proposal_cards')
    .select('card_number')
    .eq('request_id', data.request_id)
    .order('card_number', { ascending: false })
    .limit(1);

  const nextCardNumber = existingCards && existingCards.length > 0 
    ? existingCards[0].card_number + 1 
    : 1;

  const { data: card, error } = await supabase
    .from('modul8_proposal_cards')
    .insert({
      ...data,
      card_number: nextCardNumber,
      submitted_by: (await supabase.auth.getUser()).data.user?.id,
      asset_links: data.asset_links || []
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...card,
    asset_links: Array.isArray(card.asset_links) ? card.asset_links : []
  } as ProposalCard;
};

export const respondToProposalCard = async (data: CreateProposalResponseData): Promise<ProposalCardResponse> => {
  const { data: response, error } = await supabase
    .from('modul8_proposal_card_responses')
    .insert({
      ...data,
      responded_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) throw error;
  return response as ProposalCardResponse;
};

export const createCounterProposal = async (
  originalCardId: string, 
  counterData: Omit<CreateProposalCardData, 'response_to_card_id'>
): Promise<ProposalCard> => {
  // First get the original card to extract data
  const { data: originalCard, error: fetchError } = await supabase
    .from('modul8_proposal_cards')
    .select('*')
    .eq('id', originalCardId)
    .single();

  if (fetchError) throw fetchError;

  // Create counter proposal
  const counterProposal = await createProposalCard({
    ...counterData,
    request_id: originalCard.request_id,
    response_to_card_id: originalCardId
  });

  return counterProposal;
};

export const cancelProposalCard = async (cardId: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_proposal_cards')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', cardId)
    .eq('is_locked', false); // Only allow cancellation of unlocked cards

  if (error) throw error;
};

export const getRequestComments = async (requestId: string): Promise<RequestComment[]> => {
  const { data, error } = await supabase
    .from('modul8_request_comments')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(comment => ({
    ...comment,
    attachment_links: Array.isArray(comment.attachment_links) ? comment.attachment_links : []
  })) as RequestComment[];
};

export const createRequestComment = async (data: CreateCommentData): Promise<RequestComment> => {
  const { data: comment, error } = await supabase
    .from('modul8_request_comments')
    .insert({
      ...data,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      attachment_links: data.attachment_links || []
    })
    .select()
    .single();

  if (error) throw error;
  return {
    ...comment,
    attachment_links: Array.isArray(comment.attachment_links) ? comment.attachment_links : []
  } as RequestComment;
};

export const getProposalCardResponses = async (cardId: string): Promise<ProposalCardResponse[]> => {
  const { data, error } = await supabase
    .from('modul8_proposal_card_responses')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as ProposalCardResponse[];
};
