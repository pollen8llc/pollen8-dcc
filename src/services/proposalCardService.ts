
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
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map((card, index) => ({
    id: card.id,
    request_id: card.request_id,
    submitted_by: card.provider_id,
    card_number: index + 1,
    status: card.status as any,
    asset_links: [],
    negotiated_title: card.title,
    negotiated_description: card.description,
    negotiated_budget_range: card.proposed_budget ? { min: card.proposed_budget, max: card.proposed_budget, currency: 'USD' } : undefined,
    negotiated_timeline: card.proposed_timeline,
    is_locked: false,
    created_at: card.created_at,
    updated_at: card.updated_at,
    deel_contract_url: card.deel_contract_url
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

  // Count existing cards for this request
  const { data: existingCards } = await supabase
    .from('modul8_proposal_cards')
    .select('id')
    .eq('request_id', data.request_id);

  const nextCardNumber = (existingCards?.length || 0) + 1;

  const { data: card, error } = await supabase
    .from('modul8_proposal_cards')
    .insert({
      request_id: data.request_id,
      provider_id: (await supabase.auth.getUser()).data.user?.id || '',
      title: data.negotiated_title || 'Proposal',
      description: data.negotiated_description || '',
      proposed_budget: data.negotiated_budget_range?.min || 0,
      proposed_timeline: data.negotiated_timeline || ''
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: card.id,
    request_id: card.request_id,
    submitted_by: card.provider_id,
    card_number: nextCardNumber,
    status: card.status as any,
    asset_links: [],
    negotiated_title: card.title,
    negotiated_description: card.description,
    negotiated_budget_range: card.proposed_budget ? { min: card.proposed_budget, max: card.proposed_budget, currency: 'USD' } : undefined,
    negotiated_timeline: card.proposed_timeline,
    is_locked: false,
    created_at: card.created_at,
    updated_at: card.updated_at,
    deel_contract_url: card.deel_contract_url
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
      .from('modul8_service_request_comments')
      .select('*')
      .eq('service_request_id', data.card_id)
      .eq('user_id', userData.user.id)
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
      service_request_id: data.card_id,
      content: data.response_notes || `${data.response_type} proposal`,
      user_id: userData.user.id,
      comment_type: data.response_type
    };
    
    console.log('📝 Inserting response payload:', responsePayload);
    
    const { data: response, error } = await supabase
      .from('modul8_service_request_comments')
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
    
    // Check for mutual acceptance and create finalization card if needed
    if (data.response_type === 'accept') {
      const mutualAcceptance = await checkMutualAcceptance(data.card_id);
      if (mutualAcceptance) {
        await createFinalizationCard(data.card_id);
      }
    }
    
    return {
      id: response.id,
      card_id: data.card_id,
      response_type: data.response_type,
      responded_by: userData.user.id,
      response_notes: response.content,
      created_at: response.created_at
    } as ProposalCardResponse;
  } catch (error) {
    console.error('❌ Comprehensive error in respondToProposalCard:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
};

const createFinalizationCard = async (originalCardId: string): Promise<void> => {
  try {
    // Get the original card and request details
    const { data: originalCard, error: fetchError } = await supabase
      .from('modul8_proposal_cards')
      .select('*')
      .eq('id', originalCardId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch original proposal: ${fetchError.message}`);
    }

    // Get the service request to find the correct service provider
    const { data: serviceRequest, error: requestError } = await supabase
      .from('modul8_service_requests')
      .select('service_provider_id, organizer_id')
      .eq('id', originalCard.request_id)
      .single();

    if (requestError) {
      throw new Error(`Failed to fetch service request: ${requestError.message}`);
    }

    // Determine the service provider ID - either from the request or find it based on context
    let serviceProviderId = serviceRequest.service_provider_id;
    
    if (!serviceProviderId) {
    // Try to find service provider based on the proposal submitter
    const { data: serviceProvider, error: providerError } = await supabase
      .from('modul8_service_providers')
      .select('id')
      .eq('user_id', originalCard.provider_id)
      .single();

    if (providerError || !serviceProvider) {
      console.warn('Service provider not found for user:', originalCard.provider_id);
      serviceProviderId = null;
    } else {
      serviceProviderId = serviceProvider.id;
    }
    }

    // Create finalization card with enhanced messaging
    await supabase
      .from('modul8_proposal_cards')
      .insert({
        request_id: originalCard.request_id,
        provider_id: originalCard.provider_id,
        title: 'AGREEMENT FINALIZATION',
        description: 'Both parties have accepted the proposal. Please proceed with contract execution via DEEL platform.',
        proposed_budget: originalCard.proposed_budget,
        proposed_timeline: originalCard.proposed_timeline,
        status: 'agreement'
      });

    // Lock the original card and request
    await supabase
      .from('modul8_proposal_cards')
      .update({ 
        status: 'accepted'
      })
      .eq('id', originalCardId);

    // Update the service request status and optionally assign service provider
    const updateData: any = {
      status: 'agreed',
      is_agreement_locked: true
    };

    // Only update service provider if we found one
    if (serviceProviderId) {
      updateData.service_provider_id = serviceProviderId;
      console.log('✅ Service provider assigned:', serviceProviderId);
    } else {
      console.log('⚠️ No service provider assigned - agreement created without provider assignment');
    }

    await supabase
      .from('modul8_service_requests')
      .update(updateData)
      .eq('id', originalCard.request_id);

    console.log('✅ Finalization card created successfully');
  } catch (error) {
    console.error('❌ Error creating finalization card:', error);
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

    // Create counter proposal with data from original card as fallback
    const counterProposal = await createProposalCard({
      request_id: originalCard.request_id,
      response_to_card_id: originalCardId,
      negotiated_title: counterData.negotiated_title || originalCard.title,
      negotiated_description: counterData.negotiated_description || originalCard.description,
      negotiated_budget_range: counterData.negotiated_budget_range || (originalCard.proposed_budget ? { min: originalCard.proposed_budget, max: originalCard.proposed_budget, currency: 'USD' } : undefined),
      negotiated_timeline: counterData.negotiated_timeline || originalCard.proposed_timeline
    });

    // Mark the original card as countered
    await supabase
      .from('modul8_proposal_cards')
      .update({ 
        status: 'countered'
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
    .from('modul8_service_request_comments')
    .select('user_id')
    .eq('service_request_id', cardId)
    .eq('comment_type', 'accept');

  if (error) throw error;
  
  // Check if we have responses from two different users
  const uniqueResponders = new Set(data?.map(r => r.user_id) || []);
  return uniqueResponders.size >= 2;
};

export const cancelProposalCard = async (cardId: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_proposal_cards')
    .update({ 
      status: 'cancelled'
    })
    .eq('id', cardId);

  if (error) throw error;
};

export const getRequestComments = async (requestId: string): Promise<RequestComment[]> => {
  const { data, error } = await supabase
    .from('modul8_service_request_comments')
    .select('*')
    .eq('service_request_id', requestId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(comment => ({
    id: comment.id,
    request_id: requestId,
    user_id: comment.user_id,
    content: comment.content,
    attachment_links: [],
    created_at: comment.created_at,
    updated_at: comment.updated_at
  })) as RequestComment[];
};

export const createRequestComment = async (data: CreateCommentData): Promise<RequestComment> => {
  const { data: comment, error } = await supabase
    .from('modul8_service_request_comments')
    .insert({
      service_request_id: data.request_id,
      content: data.content,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) throw error;
  return {
    id: comment.id,
    request_id: data.request_id,
    user_id: comment.user_id,
    content: comment.content,
    attachment_links: [],
    created_at: comment.created_at,
    updated_at: comment.updated_at
  } as RequestComment;
};

export const getProposalCardResponses = async (cardId: string): Promise<ProposalCardResponse[]> => {
  console.log('🔍 Fetching responses for card:', cardId);
  
  const { data, error } = await supabase
    .from('modul8_service_request_comments')
    .select('*')
    .eq('service_request_id', cardId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching responses:', error);
    throw error;
  }
  
  console.log('📊 Found responses:', data?.length || 0, data);
  return (data || []).map(comment => ({
    id: comment.id,
    card_id: cardId,
    response_type: 'accept' as const,
    responded_by: comment.user_id,
    response_notes: comment.content,
    created_at: comment.created_at
  })) as ProposalCardResponse[];
};
