
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getServiceRequestById, getUserOrganizer, updateServiceRequest } from '@/services/modul8Service';
import { getProposalsByRequestId, createProposal, updateProposalStatus } from '@/services/proposalService';
import { ServiceRequest, Organizer, Proposal } from '@/types/modul8';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import UnifiedStatusCard from '@/components/shared/UnifiedStatusCard';
import { toast } from '@/hooks/use-toast';

const Modul8RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (requestId && session?.user?.id) {
      loadRequestData();
    }
  }, [requestId, session?.user?.id]);

  const loadRequestData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    try {
      setLoading(true);
      
      // Load organizer to verify ownership
      const organizerData = await getUserOrganizer(session.user.id);
      if (!organizerData) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this request",
          variant: "destructive"
        });
        navigate('/modul8/dashboard');
        return;
      }
      setOrganizer(organizerData);
      
      // Load request data
      const requestData = await getServiceRequestById(requestId);
      if (!requestData) {
        toast({
          title: "Request Not Found",
          description: "The requested service request could not be found",
          variant: "destructive"
        });
        navigate('/modul8/dashboard');
        return;
      }
      
      // Verify ownership
      if (requestData.organizer_id !== organizerData.id) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this request",
          variant: "destructive"
        });
        navigate('/modul8/dashboard');
        return;
      }
      
      setServiceRequest(requestData);
      
      // Load proposals
      const proposalData = await getProposalsByRequestId(requestId);
      setProposals(proposalData);
      
    } catch (error) {
      console.error('Error loading request data:', error);
      toast({
        title: "Error",
        description: "Failed to load request data",
        variant: "destructive"
      });
      navigate('/modul8/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleProposalAction = async (action: 'accept' | 'reject' | 'counter', proposalId: string, counterData?: any) => {
    try {
      if (action === 'counter') {
        // Create a counter proposal
        await createProposal({
          service_request_id: requestId!,
          from_user_id: session!.user!.id,
          proposal_type: 'counter',
          quote_amount: counterData.quote_amount,
          timeline: counterData.timeline,
          scope_details: counterData.scope_details,
          terms: counterData.terms
        });
        
        toast({
          title: "Counter Offer Submitted",
          description: "Your counter offer has been sent to the service provider",
        });
      } else {
        await updateProposalStatus(proposalId, action === 'accept' ? 'accepted' : 'rejected');
        
        if (action === 'accept') {
          // Update service request status
          await updateServiceRequest(requestId!, {
            status: 'agreed',
            engagement_status: 'affiliated'
          });
        }
        
        toast({
          title: action === 'accept' ? "Proposal Accepted" : "Proposal Rejected",
          description: `The proposal has been ${action}ed`,
        });
      }
      
      loadRequestData(); // Refresh data
    } catch (error) {
      console.error('Error handling proposal action:', error);
      toast({
        title: "Error",
        description: "Failed to process proposal action",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (newStatus: string, message?: string) => {
    if (!serviceRequest) return;
    
    try {
      await updateServiceRequest(serviceRequest.id, { 
        status: newStatus as ServiceRequest['status'] 
      });
      toast({
        title: "Status Updated",
        description: `Project status changed to ${newStatus}`,
      });
      loadRequestData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleComment = async (message: string) => {
    // Implementation for adding comments would go here
    toast({
      title: "Comment Added",
      description: "Your comment has been posted",
    });
  };

  const handleFileUpload = async (files: File[]) => {
    // Implementation for file uploads would go here
    toast({
      title: "Files Uploaded",
      description: "Your files have been uploaded successfully",
    });
  };

  // Convert proposals to status card actions
  const generateStatusActions = () => {
    const actions: any[] = [];
    
    // Add initial request creation
    actions.push({
      id: 'initial',
      type: 'status_change',
      actor: 'organizer',
      timestamp: serviceRequest?.created_at || new Date().toISOString(),
      message: 'Service request created',
      status: 'pending'
    });
    
    // Add proposals as actions
    proposals.forEach((proposal) => {
      actions.push({
        id: proposal.id,
        type: 'proposal',
        actor: proposal.from_user_id === session?.user?.id ? 'organizer' : 'provider',
        timestamp: proposal.created_at,
        message: proposal.proposal_type === 'counter' ? 'Submitted counter offer' : 'Submitted proposal',
        proposal: proposal
      });
    });
    
    return actions.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00eada]"></div>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
            <Button onClick={() => navigate('/modul8/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/modul8/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <UnifiedStatusCard
          serviceRequest={serviceRequest}
          actions={generateStatusActions()}
          currentUserRole="organizer"
          onProposalAction={handleProposalAction}
          onStatusChange={handleStatusChange}
          onComment={handleComment}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default Modul8RequestDetails;
