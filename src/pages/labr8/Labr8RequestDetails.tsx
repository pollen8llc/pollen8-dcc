
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import Navbar from '@/components/Navbar';
import ProposalCardThread from '@/components/modul8/ProposalCardThread';
import { ServiceRequest } from '@/types/modul8';
import { getServiceRequestById, getUserServiceProvider } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';
import { MobileRequestLayout } from '@/components/shared/MobileRequestLayout';

const Labr8RequestDetails = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [requestId, session?.user?.id]);

  const loadData = async () => {
    if (!requestId || !session?.user?.id) return;
    
    setLoading(true);
    try {
      const [requestData, provider] = await Promise.all([
        getServiceRequestById(requestId),
        getUserServiceProvider(session.user.id)
      ]);

      if (!requestData) {
        toast({
          title: "Request Not Found",
          description: "The service request could not be found",
          variant: "destructive"
        });
        navigate('/labr8/dashboard');
        return;
      }

      if (!provider) {
        navigate('/labr8/setup');
        return;
      }

      setServiceRequest(requestData);
      setServiceProvider(provider);
    } catch (error) {
      console.error('Error loading request:', error);
      toast({
        title: "Error",
        description: "Failed to load request details",
        variant: "destructive"
      });
      navigate('/labr8/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
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
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Request Not Found</h2>
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
      <Navbar />
      
      <MobileRequestLayout
        serviceRequest={serviceRequest}
        serviceProvider={serviceProvider}
        currentUserRole="service_provider"
        platformLabel="LAB-R8"
        showServiceProviderBadge={true}
        onBack={() => navigate('/labr8/dashboard')}
      >
        <ProposalCardThread 
          requestId={serviceRequest.id}
          isServiceProvider={true}
          serviceRequest={serviceRequest}
        />
      </MobileRequestLayout>
    </div>
  );
};

export default Labr8RequestDetails;
