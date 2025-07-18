
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Building, 
  User, 
  MessageSquare,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { ServiceRequest, ServiceProvider, Organizer } from '@/types/modul8';
import { getServiceRequestById, getUserServiceProvider } from '@/services/modul8Service';
import { checkExistingRequest } from '@/services/negotiationService';
import NegotiationFlow from './NegotiationFlow';
import NegotiationTimeline from './NegotiationTimeline';
import { toast } from '@/hooks/use-toast';

const RequestStatusPage = () => {
  const { providerId, requestId } = useParams<{ providerId: string; requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);  
  const [loading, setLoading] = useState(true);
  const [isServiceProvider, setIsServiceProvider] = useState(false);

  useEffect(() => {
    loadRequestData();
  }, [requestId, session?.user?.id]);

  const loadRequestData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    setLoading(true);
    try {
      // Check if current user is a service provider
      const provider = await getUserServiceProvider(session.user.id);
      if (provider) {
        setServiceProvider(provider);
        setIsServiceProvider(true);
      }

      const requestData = await getServiceRequestById(requestId);
      
      if (!requestData) {
        toast({
          title: "Request Not Found",
          description: "The service request could not be found",
          variant: "destructive"
        });
        navigate(isServiceProvider ? '/labr8/dashboard' : '/modul8');
        return;
      }

      setServiceRequest(requestData);
    } catch (error) {
      console.error('Error loading request:', error);
      toast({
        title: "Error",
        description: "Failed to load request information",
        variant: "destructive"
      });
      navigate(isServiceProvider ? '/labr8/dashboard' : '/modul8');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    loadRequestData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiating':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agreed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'negotiating':
        return <MessageSquare className="h-4 w-4" />;
      case 'agreed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Building className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Request Not Found</h2>
            <Button onClick={() => navigate(isServiceProvider ? '/labr8/dashboard' : '/modul8')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 self-start text-xs sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{serviceRequest.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={`${getStatusColor(serviceRequest.status)} border text-xs`}>
                {getStatusIcon(serviceRequest.status)}
                <span className="ml-1 font-medium">
                  {serviceRequest.status.charAt(0).toUpperCase() + serviceRequest.status.slice(1)}
                </span>
              </Badge>
              {isServiceProvider && (
                <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">
                  <Building className="h-3 w-3 mr-1" />
                  Service Provider View
                </Badge>
              )}
              <span className="text-muted-foreground text-xs">
                Created {new Date(serviceRequest.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Timeline */}
            <NegotiationTimeline 
              serviceRequest={serviceRequest}
              className="sticky top-8"
            />

            {/* Participants */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base">Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Organizer */}
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarFallback>
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm font-medium">
                      {serviceRequest.organizer?.organization_name || 'Organizer'}
                    </div>
                    <div className="text-xs text-muted-foreground">Client</div>
                  </div>
                </div>

                {/* Service Provider */}
                {serviceRequest.service_provider && (
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={serviceRequest.service_provider.logo_url} />
                      <AvatarFallback>
                        <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-xs sm:text-sm font-medium">
                        {serviceRequest.service_provider.business_name}
                      </div>
                      <div className="text-xs text-muted-foreground">Service Provider</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Project Details */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {serviceRequest.budget_range?.min && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    <span className="text-xs sm:text-sm">
                      ${serviceRequest.budget_range.min.toLocaleString()}
                      {serviceRequest.budget_range.max && 
                        ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                      }
                    </span>
                  </div>
                )}
                
                {serviceRequest.timeline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                    <span className="text-xs sm:text-sm">{serviceRequest.timeline}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <NegotiationFlow 
              serviceRequest={serviceRequest}
              onUpdate={handleUpdate}
              isServiceProvider={isServiceProvider}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestStatusPage;
