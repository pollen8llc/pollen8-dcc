
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Building2, User, Clock, DollarSign } from 'lucide-react';
import { PlatformNavigation } from '@/components/shared/PlatformNavigation';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequestById } from '@/services/modul8Service';
import { useLabr8Dashboard } from '@/hooks/useLabr8Dashboard';
import { useUser } from '@/contexts/UserContext';
import RequestThread from '@/components/shared/RequestThread';
import { toast } from '@/hooks/use-toast';

const Labr8RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { serviceProvider } = useLabr8Dashboard(currentUser?.id);
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequestData();
  }, [requestId]);

  const loadRequestData = async () => {
    if (!requestId) return;
    
    setLoading(true);
    try {
      const requestData = await getServiceRequestById(requestId);
      
      if (!requestData) {
        toast({
          title: "Request Not Found",
          description: "The service request could not be found",
          variant: "destructive"
        });
        navigate('/labr8/inbox');
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
      navigate('/labr8/inbox');
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PlatformNavigation platform="labr8" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
        </div>
      </div>
    );
  }

  if (!serviceRequest) {
    return (
      <div className="min-h-screen bg-background">
        <PlatformNavigation platform="labr8" />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Request Not Found</h2>
            <Button onClick={() => navigate('/labr8/inbox')}>
              Back to Inbox
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PlatformNavigation platform="labr8" />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/labr8/inbox')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inbox
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{serviceRequest.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${getStatusColor(serviceRequest.status)} border`}>
                <span className="font-medium">
                  {serviceRequest.status.charAt(0).toUpperCase() + serviceRequest.status.slice(1)}
                </span>
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                <Building2 className="h-4 w-4 mr-1" />
                Service Provider View
              </Badge>
              <span className="text-muted-foreground text-sm">
                Created {new Date(serviceRequest.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Client Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {serviceRequest.organizer?.organization_name || 'Client'}
                    </div>
                    <div className="text-xs text-muted-foreground">Organizer</div>
                  </div>
                </div>
                
                {serviceRequest.organizer?.description && (
                  <p className="text-sm text-muted-foreground">
                    {serviceRequest.organizer.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Project Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {serviceRequest.budget_range?.min && (
                  <div className="flex items-center gap-2 text-foreground">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <span className="text-sm">
                      ${serviceRequest.budget_range.min.toLocaleString()}
                      {serviceRequest.budget_range.max && 
                        ` - $${serviceRequest.budget_range.max.toLocaleString()}`
                      }
                    </span>
                  </div>
                )}
                
                {serviceRequest.timeline && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{serviceRequest.timeline}</span>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <div className="text-sm font-medium capitalize">{serviceRequest.engagement_status}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <RequestThread 
                  serviceRequest={serviceRequest}
                  onUpdate={handleUpdate}
                  isServiceProvider={true}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labr8RequestDetails;
