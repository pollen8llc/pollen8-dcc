import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, createServiceRequest } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import CompactHeader from '@/components/modul8/CompactHeader';
import SimplifiedRequestForm from '@/components/modul8/SimplifiedRequestForm';
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

const ServiceRequestForm = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const domainId = parseInt(searchParams.get('domain') || '1');
  const providerId = searchParams.get('providerId');
  
  const [loading, setLoading] = useState(false);
  const [organizerData, setOrganizerData] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    loadOrganizerData();
    loadSelectedProvider();
  }, [session?.user?.id]);

  const loadOrganizerData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const organizer = await getUserOrganizer(session.user.id);
      if (!organizer) {
        navigate('/modul8/setup/organizer');
        return;
      }
      setOrganizerData(organizer);
    } catch (error) {
      console.error('Error loading organizer data:', error);
      toast({
        title: "Error",
        description: "Failed to load organizer data",
        variant: "destructive"
      });
    }
  };

  const loadSelectedProvider = () => {
    try {
      const providerData = sessionStorage.getItem('selectedProvider');
      if (providerData) {
        setSelectedProvider(JSON.parse(providerData));
      }
    } catch (error) {
      console.error('Error loading selected provider:', error);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!organizerData) return;
    
    setLoading(true);
    try {
      const budgetRange = parseBudgetRange(formData.budgetRange);

      const serviceRequest = await createServiceRequest({
        organizer_id: organizerData.id,
        domain_page: domainId,
        title: formData.title,
        description: formData.description,
        budget_range: budgetRange,
        timeline: formData.expectedCompletion,
        milestones: [], // Start with empty milestones
        service_provider_id: providerId || undefined,
        status: providerId ? 'assigned' : 'pending',
        engagement_status: providerId ? 'affiliated' : 'none'
      });
      
      // Clear selected provider from session
      sessionStorage.removeItem('selectedProvider');
      
      toast({
        title: "Request Created!",
        description: "Your service request has been created and sent to the provider."
      });
      
      // Navigate to the request details page
      navigate(`/modul8/dashboard/request/${serviceRequest.id}`);
    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: "Error",
        description: "Failed to create service request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const currentDomain = DOMAIN_PAGES.find(p => p.id === domainId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <CompactHeader
            title="Create Service Request"
            subtitle={`${currentDomain?.title} • ${currentDomain?.description}`}
            showBackButton={true}
            onBack={() => navigate('/modul8/dashboard')}
            backLabel="Back to Dashboard"
          />

          {selectedProvider && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-[#00eada]/5 border border-[#00eada]/20 rounded-lg">
              <p className="text-xs sm:text-sm">
                <span className="font-medium text-[#00eada]">Selected Provider:</span> {selectedProvider.business_name}
              </p>
            </div>
          )}

          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00eada]/30"></div>
              <p className="text-xs sm:text-sm text-muted-foreground px-3">
                Post your request and connect with qualified service providers
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00eada]/30"></div>
            </div>
          </div>

          <SimplifiedRequestForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/modul8/dashboard')}
            isSubmitting={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
