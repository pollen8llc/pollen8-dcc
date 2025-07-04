import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, createServiceRequest, getServiceProviderById } from '@/services/modul8Service';
import { ServiceProvider } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import CompactHeader from '@/components/modul8/CompactHeader';
import SimplifiedRequestForm from '@/components/modul8/SimplifiedRequestForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

// Helper function to parse budget range
const parseBudgetRange = (budgetRange: string) => {
  switch (budgetRange) {
    case '500-1000':
      return { min: 500, max: 1000, currency: 'USD' };
    case '1000-5000':
      return { min: 1000, max: 5000, currency: 'USD' };
    case '5000-10000':
      return { min: 5000, max: 10000, currency: 'USD' };
    case '10000-25000':
      return { min: 10000, max: 25000, currency: 'USD' };
    case '25000+':
      return { min: 25000, currency: 'USD' };
    case 'custom':
    default:
      return { currency: 'USD' };
  }
};

const ProviderRequestPortal = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const { session } = useSession();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [organizerData, setOrganizerData] = useState(null);
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);

  useEffect(() => {
    loadData();
  }, [session?.user?.id, providerId]);

  const loadData = async () => {
    if (!session?.user?.id || !providerId) return;
    
    try {
      setLoadingProvider(true);
      
      // Load organizer data
      const organizer = await getUserOrganizer(session.user.id);
      if (!organizer) {
        navigate('/modul8/setup/organizer');
        return;
      }
      setOrganizerData(organizer);

      // Load service provider data
      const provider = await getServiceProviderById(providerId);
      if (!provider) {
        toast({
          title: "Provider Not Found",
          description: "The service provider could not be found",
          variant: "destructive"
        });
        navigate('/modul8');
        return;
      }
      setServiceProvider(provider);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load provider information",
        variant: "destructive"
      });
      navigate('/modul8');
    } finally {
      setLoadingProvider(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!organizerData || !serviceProvider) return;
    
    setLoading(true);
    try {
      const budgetRange = parseBudgetRange(formData.budgetRange);
      
      const serviceRequest = await createServiceRequest({
        organizer_id: organizerData.id,
        service_provider_id: serviceProvider.id,
        domain_page: 1, // Default domain
        title: formData.title,
        description: formData.description,
        budget_range: budgetRange,
        timeline: formData.expectedCompletion,
        milestones: [] // Start with empty milestones - will be discussed in status page
      });
      
      toast({
        title: "Request Sent!",
        description: "Your service request has been sent. You can now discuss details with the provider."
      });
      
      // Navigate directly to the project status page
      navigate(`/modul8/provider/${serviceProvider.id}/${serviceRequest.id}/status`);
    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: "Error",
        description: "Failed to send service request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProvider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <CompactHeader
            title="Send Service Request"
            showBackButton={true}
            onBack={() => navigate('/modul8')}
            backLabel="Back to Dashboard"
          />

          {/* Service Provider Info Card */}
          {serviceProvider && (
            <Card className="mb-3 sm:mb-4 border-l-2 border-l-[#00eada]/30 hover:border-l-[#00eada] transition-all duration-200">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-1 rounded-lg bg-[#00eada]/10">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src={serviceProvider.logo_url} />
                      <AvatarFallback>
                        <Building className="h-4 w-4 sm:h-5 sm:w-5 text-[#00eada]" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold">{serviceProvider.business_name}</h2>
                    {serviceProvider.tagline && (
                      <p className="text-xs sm:text-sm text-muted-foreground">{serviceProvider.tagline}</p>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              {serviceProvider.description && (
                <CardContent className="pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">{serviceProvider.description}</p>
                </CardContent>
              )}
            </Card>
          )}

          {/* Request Form */}
          <SimplifiedRequestForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/modul8')}
            isSubmitting={loading}
            providerName={serviceProvider?.business_name}
          />
        </div>
      </div>
    </div>
  );
};

export default ProviderRequestPortal;
