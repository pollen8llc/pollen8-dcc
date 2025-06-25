
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
    asset_links: Array.isArray(card.asset_links) ? card.asset_links : [],
    negotiated_budget_range: (card as any).negotiated_budget_range as { min?: number; max?: number; currency: string; } | undefined,
    negotiated_title: (card as any).negotiated_title as string | undefined,
    negotiated_description: (card as any).negotiated_description as string | undefined,
    negotiated_timeline: (card as any).negotiated_timeline as string | undefined
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
    asset_links: Array.isArray(card.asset_links) ? card.asset_links : [],
    negotiated_budget_range: (card as any).negotiated_budget_range as { min?: number; max?: number; currency: string; } | undefined,
    negotiated_title: (card as any).negotiated_title as string | undefined,
    negotiated_description: (card as any).negotiated_description as string | undefined,
    negotiated_timeline: (card as any).negotiated_timeline as string | undefined
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

export const createCounterProposalFromCard = async (
  originalCardId: string, 
  counterData: Omit<CreateProposalCardData, 'response_to_card_id'>
): Promise<ProposalCard> => {
  // Get the original card details
  const { data: originalCard, error: fetchError } = await supabase
    .from('modul8_proposal_cards')
    .select('*')
    .eq('id', originalCardId)
    .single();

  if (fetchError) throw fetchError;

  // Safely cast the asset_links and negotiated fields with proper type checking
  const safeAssetLinks = Array.isArray(originalCard.asset_links) 
    ? originalCard.asset_links as string[]
    : [];

  const safeBudgetRange = originalCard.negotiated_budget_range && 
    typeof originalCard.negotiated_budget_range === 'object' &&
    !Array.isArray(originalCard.negotiated_budget_range)
    ? originalCard.negotiated_budget_range as { min?: number; max?: number; currency: string; }
    : undefined;

  // Create counter proposal with data from original card as fallback
  const counterProposal = await createProposalCard({
    request_id: originalCard.request_id,
    response_to_card_id: originalCardId,
    notes: counterData.notes || originalCard.notes,
    scope_link: counterData.scope_link || originalCard.scope_link,
    terms_link: counterData.terms_link || originalCard.terms_link,
    asset_links: counterData.asset_links || safeAssetLinks,
    negotiated_title: counterData.negotiated_title || (originalCard.negotiated_title as string | undefined),
    negotiated_description: counterData.negotiated_description || (originalCard.negotiated_description as string | undefined),
    negotiated_budget_range: counterData.negotiated_budget_range || safeBudgetRange,
    negotiated_timeline: counterData.negotiated_timeline || (originalCard.negotiated_timeline as string | undefined)
  });

  // Mark the original card as countered
  await supabase
    .from('modul8_proposal_cards')
    .update({ 
      status: 'countered',
      is_locked: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', originalCardId);

  return counterProposal;
};

export const checkMutualAcceptance = async (cardId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('modul8_proposal_card_responses')
    .select('responded_by')
    .eq('card_id', cardId)
    .eq('response_type', 'accept');

  if (error) throw error;
  
  // Check if we have responses from two different users
  const uniqueResponders = new Set(data?.map(r => r.responded_by) || []);
  return uniqueResponders.size >= 2;
};

export const cancelProposalCard = async (cardId: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_proposal_cards')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('id', cardId)
    .eq('is_locked', false);

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
