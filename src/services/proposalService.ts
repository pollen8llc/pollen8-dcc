import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "@/types/modul8";

export type { Proposal } from "@/types/modul8";

export const getProposalsByRequestId = async (serviceRequestId: string): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('modul8_proposal_cards')
    .select('*')
    .eq('request_id', serviceRequestId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(proposal => ({
    id: proposal.id,
    service_request_id: proposal.request_id,
    from_user_id: proposal.provider_id,
    status: proposal.status as any,
    proposal_type: 'initial' as const,
    quote_amount: proposal.proposed_budget,
    timeline: proposal.proposed_timeline,
    scope_details: proposal.description,
    terms: proposal.description,
    created_at: proposal.created_at,
    updated_at: proposal.updated_at
  })) as Proposal[];
};

export const createProposal = async (proposalData: {
  service_request_id: string;
  from_user_id: string;
  proposal_type: 'initial' | 'counter' | 'revision';
  quote_amount?: number;
  timeline?: string;
  scope_details?: string;
  terms?: string;
}): Promise<Proposal> => {
  const { data, error } = await supabase
    .from('modul8_proposal_cards')
    .insert({
      request_id: proposalData.service_request_id,
      provider_id: proposalData.from_user_id,
      title: 'Proposal',
      description: proposalData.scope_details || '',
      proposed_budget: proposalData.quote_amount || 0,
      proposed_timeline: proposalData.timeline || '',
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    service_request_id: data.request_id,
    from_user_id: data.provider_id,
    status: data.status as any,
    proposal_type: proposalData.proposal_type,
    quote_amount: data.proposed_budget,
    timeline: data.proposed_timeline,
    scope_details: data.description,
    terms: data.description,
    created_at: data.created_at,
    updated_at: data.updated_at
  } as Proposal;
};

export const updateProposalStatus = async (
  proposalId: string, 
  status: 'pending' | 'accepted' | 'rejected' | 'submitted' | 'countered'
): Promise<void> => {
  const { error } = await supabase
    .from('modul8_proposal_cards')
    .update({ status })
    .eq('id', proposalId);

  if (error) throw error;
};

export const getProposalById = async (proposalId: string): Promise<Proposal | null> => {
  const { data, error } = await supabase
    .from('modul8_proposal_cards')
    .select('*')
    .eq('id', proposalId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  
  return {
    id: data.id,
    service_request_id: data.request_id,
    from_user_id: data.provider_id,
    status: data.status as any,
    proposal_type: 'initial' as const,
    quote_amount: data.proposed_budget,
    timeline: data.proposed_timeline,
    scope_details: data.description,
    terms: data.description,
    created_at: data.created_at,
    updated_at: data.updated_at
  } as Proposal;
};
