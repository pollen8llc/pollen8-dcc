
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ServiceRequest, Proposal } from '@/types/modul8';
import { getServiceRequestById, getProposalsByRequestId } from '@/services/modul8Service';
import { acceptProposal, declineProposal } from '@/services/negotiationService';
import { toast } from '@/hooks/use-toast';
import ProjectCard from './ProjectCard';
import ProposalCommunicationCard from './ProposalCommunicationCard';
import ContractCreationModal from './ContractCreationModal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface CardBasedProjectViewProps {
  isServiceProvider?: boolean;
  userId?: string;
}

const CardBasedProjectView = ({ isServiceProvider = false, userId }: CardBasedProjectViewProps) => {
  const { requestId } = useParams<{ requestId: string }>();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContractModal, setShowContractModal] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [requestId]);

  const loadProjectData = async () => {
    if (!requestId) return;
    
    try {
      setLoading(true);
      const requestData = await getServiceRequestById(requestId);
      const proposalData = await getProposalsByRequestId(requestId);
      
      setServiceRequest(requestData);
      setProposals(proposalData || []);
    } catch (error) {
      console.error('Error loading project data:', error);
      toast({
        title: "Error",
        description: "Failed to load project information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    if (!serviceRequest || !userId) return;
    
    try {
      await acceptProposal(serviceRequest.id, proposalId, userId);
      toast({
        title: "Proposal Accepted",
        description: "The proposal has been accepted successfully",
      });
      loadProjectData();
    } catch (error) {
      console.error('Error accepting proposal:', error);
      toast({
        title: "Error",
        description: "Failed to accept proposal",
        variant: "destructive"
      });
    }
  };

  const handleDeclineProposal = async (proposalId: string) => {
    if (!serviceRequest || !userId) return;
    
    try {
      await declineProposal(serviceRequest.id, proposalId, userId);
      toast({
        title: "Proposal Declined",
        description: "The proposal has been declined",
      });
      loadProjectData();
    } catch (error) {
      console.error('Error declining proposal:', error);
      toast({
        title: "Error",
        description: "Failed to decline proposal",
        variant: "destructive"
      });
    }
  };

  const handleReplyToProposal = async (proposalId: string, message: string) => {
    // TODO: Implement reply functionality
    console.log('Reply to proposal:', proposalId, message);
    toast({
      title: "Reply Sent",
      description: "Your reply has been sent to the other party",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Project not found or you don't have permission to view it.
        </AlertDescription>
      </Alert>
    );
  }

  const acceptedProposal = proposals.find(p => p.status === 'accepted');

  return (
    <div className="space-y-6">
      {/* Card 1: Project Details */}
      <ProjectCard request={serviceRequest} type="details" />

      {/* Card 2: Request Status */}
      <ProjectCard request={serviceRequest} type="status">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Current Status: <span className="font-medium">{serviceRequest.status}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Engagement: <span className="font-medium">{serviceRequest.engagement_status}</span>
          </p>
          {serviceRequest.status === 'pending' && (
            <p className="text-sm text-blue-600">
              Waiting for service provider to submit proposal
            </p>
          )}
          {serviceRequest.status === 'negotiating' && (
            <p className="text-sm text-orange-600">
              Proposal submitted - review below
            </p>
          )}
        </div>
      </ProjectCard>

      {/* Card 3+: Proposal Communications */}
      {proposals.map((proposal) => (
        <ProposalCommunicationCard
          key={proposal.id}
          proposal={proposal}
          isOrganizer={!isServiceProvider}
          onAccept={() => handleAcceptProposal(proposal.id)}
          onDecline={() => handleDeclineProposal(proposal.id)}
          onReply={(message) => handleReplyToProposal(proposal.id, message)}
          onUpdate={loadProjectData}
        />
      ))}

      {/* Contract Creation */}
      {acceptedProposal && serviceRequest.status === 'agreed' && (
        <ProjectCard request={serviceRequest} type="proposal">
          <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
              🎉 Ready for Contract
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300 mb-4">
              Both parties have agreed to the terms. You can now create the contract.
            </p>
            <button 
              onClick={() => setShowContractModal(true)}
              className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black py-2 px-4 rounded font-medium"
            >
              Create Contract with Deel
            </button>
          </div>
        </ProjectCard>
      )}

      {/* Contract Creation Modal */}
      {showContractModal && acceptedProposal && (
        <ContractCreationModal
          isOpen={showContractModal}
          serviceRequest={serviceRequest}
          proposal={acceptedProposal}
          onClose={() => setShowContractModal(false)}
          onCreateContract={loadProjectData}
        />
      )}
    </div>
  );
};

export default CardBasedProjectView;
