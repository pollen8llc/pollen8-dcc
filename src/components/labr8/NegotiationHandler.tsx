
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
  AlertTriangle,
  FileText
} from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequestById, getUserServiceProvider } from '@/services/modul8Service';
import { checkExistingRequest } from '@/services/negotiationService';
import ProviderResponseForm from '@/components/modul8/ProviderResponseForm';
import NegotiationFlow from '@/components/modul8/NegotiationFlow';
import NegotiationTimeline from '@/components/modul8/NegotiationTimeline';
import { toast } from '@/hooks/use-toast';

const NegotiationHandler = () => {
  const { providerId, requestId } = useParams<{ providerId: string; requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canRespond, setCanRespond] = useState(false);

  useEffect(() => {
    loadRequestData();
  }, [requestId, session?.user?.id]);

  const loadRequestData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    setLoading(true);
    try {
      // Get service provider profile
      const provider = await getUserServiceProvider(session.user.id);
      if (!provider) {
        navigate('/labr8/setup');
        return;
      }
      setServiceProvider(provider);

      // Get the service request
      const requestData = await getServiceRequestById(requestId);
      
      if (!requestData) {
        toast({
          title: "Request Not Found",
          description: "The service request could not be found",
          variant: "destructive"
        });
        navigate('/labr8/dashboard');
        return;
      }

      setServiceRequest(requestData);

      // Check if this provider can respond (is assigned or it's an open request)
      const canProviderRespond = !requestData.service_provider_id || 
                                requestData.service_provider_id === provider.id ||
                                requestData.status === 'pending';
      
      setCanRespond(canProviderRespond);

    } catch (error) {
      console.error('Error loading request:', error);
      toast({
        title: "Error",
        description: "Failed to load request information",
        variant: "destructive"
      });
      navigate('/labr8/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    loadRequestData();
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Request Not Found</h2>
            <Button onClick={() => navigate('/labr8/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/labr8/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{serviceRequest.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                <Building className="h-4 w-4 mr-1" />
                Service Provider View
              </Badge>
              <span className="text-muted-foreground text-sm">
                LAB-R8 Negotiation Flow
              </span>
            </div>
          </div>
        </div>

        {!canRespond && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This request has been assigned to another service provider. You can view the details but cannot respond.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Timeline */}
            <NegotiationTimeline 
              serviceRequest={serviceRequest}
              className="sticky top-8"
            />

            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceRequest.organizer && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {serviceRequest.organizer.organization_name}
                      </div>
                      <div className="text-xs text-muted-foreground">Client</div>
                    </div>
                  </div>
                )}

                {/* Project Details */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Project Details</h4>
                  <div className="space-y-3">
                    {serviceRequest.budget_range && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm">
                          Budget: ${serviceRequest.budget_range.min?.toLocaleString() || 'TBD'}
                          {serviceRequest.budget_range.max && 
                            ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                          }
                        </span>
                      </div>
                    )}
                    
                    {serviceRequest.timeline && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{serviceRequest.timeline}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {canRespond ? (
              <NegotiationFlow 
                serviceRequest={serviceRequest}
                onUpdate={handleUpdate}
                isServiceProvider={true}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Request Assigned</h3>
                  <p className="text-muted-foreground mb-4">
                    This request has been assigned to another service provider.
                  </p>
                  <Button 
                    onClick={() => navigate('/labr8/dashboard')}
                    className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationHandler;
