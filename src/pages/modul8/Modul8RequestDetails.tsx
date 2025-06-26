
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  ArrowLeft, 
  Building, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProposalCardThread from '@/components/modul8/ProposalCardThread';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequestById, deleteServiceRequest, getUserOrganizer } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'negotiating':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'agreed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
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
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{serviceRequest.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${getStatusColor(serviceRequest.status)} border font-medium`}>
                {serviceRequest.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                <Building className="h-4 w-4 mr-1" />
                Client View
              </Badge>
              <span className="text-muted-foreground text-sm">
                Created {new Date(serviceRequest.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Only Participants */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Organizer */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={serviceRequest.organizer?.logo_url} />
                    <AvatarFallback>
                      <Building className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {serviceRequest.organizer?.organization_name || 'Your Organization'}
                    </div>
                    <div className="text-xs text-muted-foreground">Client (You)</div>
                  </div>
                </div>

                {/* Service Provider */}
                {serviceRequest.service_provider && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={serviceRequest.service_provider.logo_url} />
                      <AvatarFallback>
                        <Building className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {serviceRequest.service_provider.business_name}
                      </div>
                      <div className="text-xs text-muted-foreground">Service Provider</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Proposal Thread */}
          <div className="lg:col-span-3">
            <ProposalCardThread 
              requestId={serviceRequest.id}
              isServiceProvider={false}
              serviceRequest={serviceRequest}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modul8RequestDetails;
