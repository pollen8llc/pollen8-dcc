
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, User } from 'lucide-react';
import { PlatformNavigation } from '@/components/shared/PlatformNavigation';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequestById } from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import RequestThread from '@/components/shared/RequestThread';
import ServiceRequestActions from '@/components/modul8/ServiceRequestActions';
import { toast } from '@/hooks/use-toast';

const ServiceRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceRequest();
  }, [id]);

  const loadServiceRequest = async () => {
    if (!id) return;
    
    try {
      const request = await getServiceRequestById(id);
      
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
      console.error('Error loading service request:', error);
      toast({
        title: "Error",
        description: "Failed to load service request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is the organizer who created this request
  const isOwner = session?.user?.id && serviceRequest?.organizer?.user_id === session.user.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PlatformNavigation platform="modul8" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <PlatformNavigation platform="modul8" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Request Not Found</h1>
            <Button onClick={() => navigate('/modul8')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PlatformNavigation platform="modul8" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
            
            {isOwner && (
              <ServiceRequestActions 
                request={serviceRequest} 
                onUpdate={() => {
                  loadServiceRequest();
                  // If request was deleted, go back to dashboard
                  if (serviceRequest.status === 'cancelled') {
                    setTimeout(() => navigate('/modul8'), 1000);
                  }
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <RequestThread 
                serviceRequest={serviceRequest} 
                onUpdate={loadServiceRequest}
                isServiceProvider={false}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Organizer Info */}
              {serviceRequest.organizer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Organization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="font-medium">{serviceRequest.organizer.organization_name}</h3>
                      {serviceRequest.organizer.description && (
                        <p className="text-sm text-muted-foreground">
                          {serviceRequest.organizer.description}
                        </p>
                      )}
                      {serviceRequest.organizer.focus_areas && serviceRequest.organizer.focus_areas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {serviceRequest.organizer.focus_areas.map((area, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-muted px-2 py-1 rounded"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Service Provider Info */}
              {serviceRequest.service_provider && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Service Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h3 className="font-medium">{serviceRequest.service_provider.business_name}</h3>
                      {serviceRequest.service_provider.tagline && (
                        <p className="text-sm text-muted-foreground">
                          {serviceRequest.service_provider.tagline}
                        </p>
                      )}
                      {serviceRequest.service_provider.tags && serviceRequest.service_provider.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {serviceRequest.service_provider.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-[#00eada]/10 text-[#00eada] px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Request Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <span className="text-sm font-medium capitalize">{serviceRequest.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Engagement:</span>
                      <span className="text-sm font-medium capitalize">{serviceRequest.engagement_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Created:</span>
                      <span className="text-sm">
                        {new Date(serviceRequest.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestDetails;
