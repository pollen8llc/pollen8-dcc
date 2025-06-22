
import { useState, useCallback } from 'react';
import { createProposal, getProposalsByRequestId } from '@/services/proposalService';
import { toast } from '@/hooks/use-toast';

export interface ProposalData {
  service_request_id: string;
  from_user_id: string;
  proposal_type: 'initial' | 'counter' | 'revision';
  quote_amount?: number;
  timeline?: string;
  scope_details?: string;
  terms?: string;
}

export const useProposalFlow = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitProposal = useCallback(async (proposalData: ProposalData) => {
    setLoading(true);
    setError(null);
    
    try {
      const proposal = await createProposal(proposalData);
      
      toast({
        title: "Proposal Submitted",
        description: "Your proposal has been sent successfully.",
      });
      
      return proposal;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit proposal';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProposals = useCallback(async (serviceRequestId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const proposals = await getProposalsByRequestId(serviceRequestId);
      return proposals;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch proposals';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    submitProposal,
    getProposals,
  };
};
