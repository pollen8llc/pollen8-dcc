
import { supabase } from "@/integrations/supabase/client";
import { Proposal } from "@/types/modul8";

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

  return data || [];
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
