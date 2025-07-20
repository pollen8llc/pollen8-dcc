
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProposalCardThread from '@/components/modul8/ProposalCardThread';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequestById, deleteServiceRequest, getUserOrganizer } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';
import { MobileRequestLayout } from '@/components/shared/MobileRequestLayout';

const Modul8RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [organizerData, setOrganizerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, [requestId, session?.user?.id]);

  const loadData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    setLoading(true);
    try {
      const [requestData, organizer] = await Promise.all([
        getServiceRequestById(requestId),
        getUserOrganizer(session.user.id)
      ]);

      if (!requestData) {
        toast({
          title: "Request Not Found",
          description: "The service request could not be found",
          variant: "destructive"
        });
        navigate('/modul8/dashboard');
        return;
      }

      if (!organizer) {
        navigate('/modul8/setup/organizer');
        return;
      }

      setServiceRequest(requestData);
      setOrganizerData(organizer);
    } catch (error) {
      console.error('Error loading request:', error);
      toast({
        title: "Error",
        description: "Failed to load request details",
        variant: "destructive"
      });
      navigate('/modul8/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!requestId) return;
    
    setDeleting(true);
    try {
      await deleteServiceRequest(requestId);
      toast({
        title: "Request Deleted",
        description: "The service request has been deleted successfully"
      });
      navigate('/modul8/dashboard');
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Request Not Found</h2>
            <Button onClick={() => navigate('/modul8/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const deleteButton = (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full lg:w-auto text-red-600 border-red-200 hover:bg-red-50 min-h-[44px]"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Request
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Delete Service Request?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the service request and all associated proposal cards and comments.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteRequest}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Delete Request"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <MobileRequestLayout
        serviceRequest={serviceRequest}
        serviceProvider={serviceRequest.service_provider}
        currentUserRole="organizer"
        platformLabel="MODUL-8"
        onBack={() => navigate('/modul8/dashboard')}
        deleteButton={deleteButton}
      >
        <ProposalCardThread 
          requestId={serviceRequest.id}
          isServiceProvider={false}
          serviceRequest={serviceRequest}
        />
      </MobileRequestLayout>
    </div>
  );
};

export default Modul8RequestDetails;
