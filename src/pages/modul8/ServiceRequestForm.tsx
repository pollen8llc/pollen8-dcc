
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, createServiceRequest } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
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
  
  const [loading, setLoading] = useState(false);
  const [organizerData, setOrganizerData] = useState(null);

  useEffect(() => {
    loadOrganizerData();
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
        milestones: [] // Start with empty milestones
      });
      
      toast({
        title: "Request Created!",
        description: "Your service request has been created and is now available to service providers."
      });
      
      // Navigate to the request status page
      navigate(`/modul8/request/${serviceRequest.id}/status`);
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

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Create Service Request
            </h1>
            <p className="text-muted-foreground">
              {currentDomain?.title} • {currentDomain?.description}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Post your request and connect with qualified service providers
            </p>
          </div>

          <SimplifiedRequestForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/modul8')}
            isSubmitting={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
