
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequests } from '@/services/modul8Service';
import NegotiationFlow from '@/components/modul8/NegotiationFlow';
import { toast } from '@/hooks/use-toast';

const ServiceRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceRequest();
  }, [id]);

  const loadServiceRequest = async () => {
    if (!id) return;
    
    try {
      // For now, we'll get all requests and find the one we need
      // In a real app, you'd have a getServiceRequestById function
      const requests = await getServiceRequests();
      const request = requests.find(r => r.id === id);
      
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
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
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/modul8')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <NegotiationFlow 
                serviceRequest={serviceRequest} 
                onUpdate={loadServiceRequest}
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

              {/* Request Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Request Status:</span>
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
