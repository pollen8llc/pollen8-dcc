import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, User, Clock, DollarSign } from 'lucide-react';
import { MinimalNavigation } from '@/components/shared/MinimalNavigation';
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

  const isOwner = session?.user?.id && serviceRequest?.organizer?.user_id === session.user.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MinimalNavigation platform="modul8" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <MinimalNavigation platform="modul8" />
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
      <MinimalNavigation platform="modul8" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
                  if (serviceRequest.status === 'cancelled') {
                    setTimeout(() => navigate('/modul8'), 1000);
                  }
                }}
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - User Profile Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Organizer Profile Card */}
              {serviceRequest.organizer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Organizer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{serviceRequest.organizer.organization_name}</h3>
                          <p className="text-sm text-muted-foreground">Client</p>
                        </div>
                      </div>
                      {serviceRequest.organizer.description && (
                        <p className="text-sm text-muted-foreground">
                          {serviceRequest.organizer.description}
                        </p>
                      )}
                      {serviceRequest.organizer.focus_areas && serviceRequest.organizer.focus_areas.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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

              {/* Service Provider Profile Card */}
              {serviceRequest.service_provider && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Service Provider
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{serviceRequest.service_provider.business_name}</h3>
                          <p className="text-sm text-muted-foreground">Provider</p>
                        </div>
                      </div>
                      {serviceRequest.service_provider.tagline && (
                        <p className="text-sm text-muted-foreground">
                          {serviceRequest.service_provider.tagline}
                        </p>
                      )}
                      {serviceRequest.service_provider.tags && serviceRequest.service_provider.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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

              {/* Project Details Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                    
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1">Status</div>
                      <div className="text-sm font-medium capitalize">{serviceRequest.status.replace('_', ' ')}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Engagement</div>
                      <div className="text-sm font-medium capitalize">{serviceRequest.engagement_status}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Created</div>
                      <div className="text-sm">
                        {new Date(serviceRequest.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Request Thread */}
            <div className="lg:col-span-3">
              <RequestThread 
                serviceRequest={serviceRequest} 
                onUpdate={loadServiceRequest}
                isServiceProvider={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestDetails;
