
import { supabase } from "@/integrations/supabase/client";

// Define the Proposal type to match the database structure
export interface Proposal {
  id: string;
  service_request_id: string;
  from_user_id: string;
  proposal_type: 'initial' | 'counter' | 'revision';
  quote_amount?: number;
  scope_details?: string;
  timeline?: string;
  terms?: string;
  status: string;
  created_at: string;
}

export const getProposalsByRequestId = async (serviceRequestId: string): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('modul8_proposals')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching proposals:', error);
    throw error;
  }

  // Transform the data to match our Proposal type
  const proposals: Proposal[] = (data || []).map(item => ({
    id: item.id,
    service_request_id: item.service_request_id,
    from_user_id: item.from_user_id,
    proposal_type: item.proposal_type as 'initial' | 'counter' | 'revision',
    quote_amount: item.quote_amount,
    scope_details: item.scope_details,
    timeline: item.timeline,
    terms: item.terms,
    status: item.status,
    created_at: item.created_at
  }));

  return proposals;
};

export const updateProposalStatus = async (proposalId: string, status: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_proposals')
    .update({ status })
    .eq('id', proposalId);

  if (error) {
    console.error('Error updating proposal status:', error);
    throw error;
  }
};
