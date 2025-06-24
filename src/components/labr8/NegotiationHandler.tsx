
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequestById, getUserServiceProvider } from '@/services/modul8Service';
import NegotiationFlow from '@/components/modul8/NegotiationFlow';
import RequestHeader from './RequestHeader';
import RequestSidebar from './RequestSidebar';
import RequestNotFound from './RequestNotFound';
import LoadingSpinner from './LoadingSpinner';
import RequestAccessAlert from './RequestAccessAlert';
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

  const handleBackToDashboard = () => {
    navigate('/labr8/dashboard');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!serviceRequest) {
    return <RequestNotFound onBackToDashboard={handleBackToDashboard} />;
  }

  const renderMainContent = () => {
    if (canRespond) {
      return (
        <NegotiationFlow 
          serviceRequest={serviceRequest}
          onUpdate={handleUpdate}
          isServiceProvider={true}
        />
      );
    }

    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Request Assigned</h3>
          <p className="text-muted-foreground mb-4">
            This request has been assigned to another service provider.
          </p>
          <Button 
            onClick={handleBackToDashboard}
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <RequestHeader 
          serviceRequest={serviceRequest} 
          onBack={handleBackToDashboard}
        />

        {!canRespond && <RequestAccessAlert />}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <RequestSidebar serviceRequest={serviceRequest} />
          
          <div className="lg:col-span-3">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationHandler;
