
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
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
import { ServiceRequest, ServiceProvider } from '@/types/modul8';
import { getServiceRequestById, getUserServiceProvider } from '@/services/modul8Service';
import { getProposalsByRequestId } from '@/services/proposalService';
import { useCrossPlatformNegotiation } from '@/hooks/useCrossPlatformNegotiation';
import NegotiationFlow from './NegotiationFlow';
import NegotiationTimeline from './NegotiationTimeline';
import { toast } from '@/hooks/use-toast';

const FixedRequestStatusPage = () => {
  const { providerId, requestId } = useParams<{ providerId: string; requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);  
  const [loading, setLoading] = useState(true);
  const [isServiceProvider, setIsServiceProvider] = useState(false);

  // Use cross-platform negotiation hook
  const {
    negotiationStatus,
    activityLog,
    notifications,
    refreshData,
    handleProposal,
    sendNotification
  } = useCrossPlatformNegotiation(requestId || '');

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

      // Try to load proposals (without breaking if function doesn't exist)
      try {
        const proposals = await getProposalsByRequestId(requestId);
        console.log('Proposals loaded:', proposals);
      } catch (error) {
        console.log('Proposals not available yet:', error);
      }

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
    refreshData();
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Request Not Found</h2>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{serviceRequest.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${getStatusColor(serviceRequest.status)} border`}>
                {getStatusIcon(serviceRequest.status)}
                <span className="ml-1 font-medium">
                  {serviceRequest.status.charAt(0).toUpperCase() + serviceRequest.status.slice(1)}
                </span>
              </Badge>
              {isServiceProvider && (
                <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                  <Building className="h-4 w-4 mr-1" />
                  Service Provider View
                </Badge>
              )}
              <span className="text-muted-foreground text-sm">
                Created {new Date(serviceRequest.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cross-platform Status */}
            {negotiationStatus && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Negotiation Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Current:</span> {negotiationStatus.current_status}
                    </div>
                    {negotiationStatus.previous_status && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Previous:</span> {negotiationStatus.previous_status}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(negotiationStatus.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <NegotiationTimeline 
              serviceRequest={serviceRequest}
              className="sticky top-8"
            />

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Participants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Organizer */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <Avatar userId={serviceRequest.organizer?.user_id} size={40} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {serviceRequest.organizer?.organization_name || 'Organizer'}
                    </div>
                    <div className="text-xs text-muted-foreground">Client</div>
                  </div>
                </div>

                {/* Service Provider */}
                {serviceRequest.service_provider && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <Avatar userId={serviceRequest.service_provider.user_id} size={40} />
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

            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {serviceRequest.budget_range?.min && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      ${serviceRequest.budget_range.min.toLocaleString()}
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
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Activity Log */}
            {activityLog.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activityLog.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium">{activity.activity_type}</span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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

export default FixedRequestStatusPage;
