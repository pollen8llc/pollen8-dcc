
import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';
import { getProposalsByRequestId, updateProposalStatus } from '@/services/proposalService';
import { NegotiationProgressIndicator } from './NegotiationProgressIndicator';
import { NegotiationStageContent } from './NegotiationStageContent';
import ContractCreationModal from './ContractCreationModal';

interface NegotiationFlowProps {
  serviceRequest: ServiceRequest;
  onUpdate: () => void;
  isServiceProvider?: boolean;
}

const NegotiationFlow = ({ 
  serviceRequest, 
  onUpdate, 
  isServiceProvider = false 
}: NegotiationFlowProps) => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [counterProposal, setCounterProposal] = useState<any>(null);

  useEffect(() => {
    loadProposals();
  }, [serviceRequest.id]);

  const loadProposals = async () => {
    try {
      const proposalData = await getProposalsByRequestId(serviceRequest.id);
      setProposals(proposalData || []);
    } catch (error) {
      console.error('Error loading proposals:', error);
      toast({
        title: "Error",
        description: "Failed to load proposals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProposalUpdate = () => {
    setShowResponseForm(false);
    setShowCounterForm(false);
    setCounterProposal(null);
    loadProposals();
    onUpdate();
  };

  const handleResponseFormCancel = () => {
    setShowResponseForm(false);
  };

  const handleCounterFormCancel = () => {
    setShowCounterForm(false);
    setCounterProposal(null);
  };

  const handleResponseFormSubmit = (data: any) => {
    console.log('Proposal submitted:', data);
    handleProposalUpdate();
  };

  const handleAcceptProposal = async (proposal: any) => {
    try {
      await updateProposalStatus(proposal.id, 'accepted');
      toast({
        title: "Proposal Accepted",
        description: "The proposal has been accepted successfully",
      });
      handleProposalUpdate();
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to accept proposal",
        variant: "destructive"
      });
    }
  };

  const handleDeclineProposal = async (proposal: any) => {
    try {
      await updateProposalStatus(proposal.id, 'rejected');
      toast({
        title: "Proposal Declined",
        description: "The proposal has been declined",
      });
      handleProposalUpdate();
    } catch (error) {
      console.error('Error declining proposal:', error);
      toast({
        title: "Error",
        description: "Failed to decline proposal",
        variant: "destructive"
      });
    }
  };

  const handleCounterOffer = (proposal: any) => {
    setCounterProposal(proposal);
    setShowCounterForm(true);
  };

  const handleCreateContract = () => {
    setShowContractModal(true);
  };

  return (
    <div className="space-y-6">
      <NegotiationProgressIndicator currentStatus={serviceRequest.status} />
      
      <NegotiationStageContent
        serviceRequest={serviceRequest}
        isServiceProvider={isServiceProvider}
        proposals={proposals}
        loading={loading}
        showResponseForm={showResponseForm}
        showCounterForm={showCounterForm}
        counterProposal={counterProposal}
        onSetShowResponseForm={setShowResponseForm}
        onResponseFormSubmit={handleResponseFormSubmit}
        onResponseFormCancel={handleResponseFormCancel}
        onCounterFormCancel={handleCounterFormCancel}
        onAcceptProposal={handleAcceptProposal}
        onDeclineProposal={handleDeclineProposal}
        onCounterOffer={handleCounterOffer}
        onProposalUpdate={handleProposalUpdate}
        onCreateContract={handleCreateContract}
      />

      {showContractModal && (
        <ContractCreationModal
          isOpen={showContractModal}
          serviceRequest={serviceRequest}
          proposal={proposals.find(p => p.status === 'accepted')}
          onClose={() => setShowContractModal(false)}
          onCreateContract={handleProposalUpdate}
        />
      )}
    </div>
  );
};

export default NegotiationFlow;
