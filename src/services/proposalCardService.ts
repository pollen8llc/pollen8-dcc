
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
    status: card.status as ProposalCard['status'], // Explicit type assertion
    asset_links: Array.isArray(card.asset_links) ? card.asset_links : [],
    negotiated_budget_range: (card as any).negotiated_budget_range as { min?: number; max?: number; currency: string; } | undefined,
    negotiated_title: (card as any).negotiated_title as string | undefined,
    negotiated_description: (card as any).negotiated_description as string | undefined,
    negotiated_timeline: (card as any).negotiated_timeline as string | undefined
  })) as ProposalCard[];
};

export const createProposalCard = async (data: CreateProposalCardData): Promise<ProposalCard> => {
  // First check if the request is locked due to an agreement
  const { data: serviceRequest, error: requestError } = await supabase
    .from('modul8_service_requests')
    .select('is_agreement_locked')
    .eq('id', data.request_id)
    .single();

  if (requestError) throw requestError;
  
  if (serviceRequest?.is_agreement_locked) {
    throw new Error('Cannot create new proposals - an agreement has already been reached for this request.');
  }

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
  try {
    console.log('🔥 respondToProposalCard called with:', data);
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error('❌ Auth error:', userError);
      throw new Error('User not authenticated');
    }
    
    console.log('👤 Current user:', userData.user.id);
    
    // Check if user has already responded to this card
    const { data: existingResponse, error: checkError } = await supabase
      .from('modul8_proposal_card_responses')
      .select('*')
      .eq('card_id', data.card_id)
      .eq('responded_by', userData.user.id)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found (expected)
      console.error('❌ Error checking existing responses:', checkError);
      throw new Error(`Error checking existing responses: ${checkError.message}`);
    }
    
    if (existingResponse) {
      console.log('⚠️ User has already responded to this card:', existingResponse);
      throw new Error('You have already responded to this proposal');
    }
    
    // Insert the response
    const responsePayload = {
      ...data,
      responded_by: userData.user.id
    };
    
    console.log('📝 Inserting response payload:', responsePayload);
    
    const { data: response, error } = await supabase
      .from('modul8_proposal_card_responses')
      .insert(responsePayload)
      .select()
      .single();

    if (error) {
      console.error('❌ Error inserting response:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw new Error(`Failed to ${data.response_type} proposal: ${error.message}`);
    }

    console.log('✅ Response created successfully:', response);
    
    // Verify the response was actually created by fetching it back
    const { data: verifyResponse, error: verifyError } = await supabase
      .from('modul8_proposal_card_responses')
      .select('*')
      .eq('id', response.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Error verifying response creation:', verifyError);
    } else {
      console.log('✅ Response verified in database:', verifyResponse);
    }
    
    return response as ProposalCardResponse;
  } catch (error) {
    console.error('❌ Comprehensive error in respondToProposalCard:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
};

export const createCounterProposalFromCard = async (
  originalCardId: string, 
  counterData: Omit<CreateProposalCardData, 'response_to_card_id'>
): Promise<ProposalCard> => {
  try {
    console.log('Creating counter proposal from card:', originalCardId);
    
    // Get the original card details
    const { data: originalCard, error: fetchError } = await supabase
      .from('modul8_proposal_cards')
      .select('*')
      .eq('id', originalCardId)
      .single();

    if (fetchError) {
      console.error('Error fetching original card:', fetchError);
      throw new Error(`Failed to fetch original proposal: ${fetchError.message}`);
    }

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

    console.log('Counter proposal created successfully:', counterProposal.id);
    return counterProposal;
  } catch (error) {
    console.error('Error in createCounterProposalFromCard:', error);
    throw error;
  }
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
  console.log('🔍 Fetching responses for card:', cardId);
  
  const { data, error } = await supabase
    .from('modul8_proposal_card_responses')
    .select('*')
    .eq('card_id', cardId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching responses:', error);
    throw error;
  }
  
  console.log('📊 Found responses:', data?.length || 0, data);
  return data as ProposalCardResponse[];
};
