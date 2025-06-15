
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  ArrowLeft, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Building,
  Handshake,
  ExternalLink
} from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequests, deleteServiceRequest } from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

const RequestStatusPage = () => {
  const { providerId, requestId } = useParams<{ providerId: string; requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, [requestId]);

  const loadData = async () => {
    if (!requestId) return;
    
    try {
      setLoading(true);
      
      // Load service request
      const requests = await getServiceRequests();
      const request = requests.find(r => r.id === requestId);
      
      if (!request) {
        toast({
          title: "Error",
          description: "Service request not found",
          variant: "destructive"
        });
        navigate('/modul8');
        return;
      }
      
      setServiceRequest(request);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load request details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!serviceRequest || !session?.user?.id) return;
    
    try {
      setDeleting(true);
      
      await deleteServiceRequest(serviceRequest.id);
      
      toast({
        title: "Request Deleted",
        description: "The service request has been deleted successfully."
      });
      
      navigate('/modul8');
      
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

  const handleLockDeal = () => {
    if (!serviceRequest) return;
    
    const deelParams = new URLSearchParams({
      service_title: serviceRequest.title,
      client_name: serviceRequest.organizer?.organization_name || 'Client',
      description: serviceRequest.description || ''
    });

    const deelUrl = `https://app.deel.com/contracts/create?${deelParams.toString()}`;
    
    toast({
      title: "Redirecting to Deel",
      description: "Opening contract creation page..."
    });

    window.open(deelUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'negotiating':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'declined':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'agreed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Request is pending review';
      case 'negotiating':
        return 'Negotiation in progress';
      case 'declined':
        return 'Request has been declined';
      case 'agreed':
        return 'Ready to create contract and lock deal';
      case 'in_progress':
        return 'Project is in progress';
      case 'completed':
        return 'Project has been completed';
      default:
        return 'Status unknown';
    }
  };

  const isOrganizer = session?.user?.id && serviceRequest?.organizer?.user_id === session.user.id;
  const isServiceProvider = session?.user?.id && serviceRequest?.service_provider?.user_id === session.user.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Request Not Found</h1>
          <Button onClick={() => navigate('/modul8')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/modul8')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        {isOrganizer && serviceRequest.status !== 'agreed' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={deleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Request
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Service Request</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this service request? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteRequest} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete Request'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Request Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{serviceRequest.title}</CardTitle>
              <Badge className={`${getStatusColor(serviceRequest.status)} font-medium`} variant="outline">
                {serviceRequest.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                {getStatusMessage(serviceRequest.status)}
              </p>
            </div>
            
            {serviceRequest.service_provider && (
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={serviceRequest.service_provider.logo_url} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{serviceRequest.service_provider.business_name}</h3>
                  {serviceRequest.service_provider.tagline && (
                    <p className="text-sm text-muted-foreground">{serviceRequest.service_provider.tagline}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {serviceRequest.description && (
            <p className="text-muted-foreground mb-4">{serviceRequest.description}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{serviceRequest.organizer?.organization_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Created {new Date(serviceRequest.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Actions */}
      {serviceRequest.status === 'agreed' && isOrganizer && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Provider Agreed!</h3>
                  <p className="text-green-700">Ready to create contract and lock the deal</p>
                </div>
              </div>
              <Button onClick={handleLockDeal} className="bg-green-600 hover:bg-green-700">
                <Handshake className="h-4 w-4 mr-2" />
                Lock Deal
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {serviceRequest.status === 'declined' && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Request Declined</h3>
                <p className="text-red-700">This request has been declined by the service provider</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Negotiation Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Discussion & Negotiation
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Use the main service request page for detailed negotiations and proposals.
            </p>
            <Button 
              onClick={() => navigate(`/modul8/request/${serviceRequest.id}`)}
              className="mt-4"
            >
              Go to Full Request Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestStatusPage;
