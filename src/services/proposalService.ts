import { supabase } from "@/integrations/supabase/client";
import { Proposal, CreateProposalData } from "@/types/modul8";

// Export the Proposal type for use in other files
export type { Proposal };

export const createProposal = async (data: CreateProposalData): Promise<Proposal> => {
  const { data: proposal, error } = await supabase
    .from('modul8_proposals')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...proposal,
    proposal_type: proposal.proposal_type as 'initial' | 'counter' | 'revision'
  } as Proposal;
};

export const updateProposalStatus = async (
  proposalId: string,
  status: 'pending' | 'accepted' | 'rejected' | 'submitted' | 'countered'
): Promise<void> => {
  const { error } = await supabase
    .from('modul8_proposals')
    .update({ status })
    .eq('id', proposalId);
  
  if (error) throw error;
};

export const getProposalsByRequestId = async (serviceRequestId: string): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('modul8_proposals')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(proposal => ({
    ...proposal,
    proposal_type: proposal.proposal_type as 'initial' | 'counter' | 'revision'
  })) as Proposal[];
};

export const getProposalById = async (proposalId: string): Promise<Proposal | null> => {
  const { data, error } = await supabase
    .from('modul8_proposals')
    .select('*')
    .eq('id', proposalId)
    .maybeSingle();
  
  if (error) throw error;
  
  if (!data) return null;
  
  return {
    ...data,
    proposal_type: data.proposal_type as 'initial' | 'counter' | 'revision'
  } as Proposal;
};
