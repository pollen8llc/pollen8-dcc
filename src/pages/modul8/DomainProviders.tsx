
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/contexts/UserContext';
import { 
  getServiceProvidersByDomain, 
  createServiceRequest,
  getOrganizerServiceRequests
} from '@/services/modul8Service';
import { ServiceProvider } from '@/types/modul8';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';
import { DOMAIN_PAGES_MAP } from '@/types/modul8';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import EnhancedProviderCard from '@/components/modul8/EnhancedProviderCard';
import Navbar from '@/components/Navbar';

const DomainProviders = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { session } = useSession();
  const [providers, setProviders] = useState<ServiceProvider[] | null>(null);
  const [loading, setLoading] = useState(true);

  const domainName = domainId ? DOMAIN_PAGES_MAP[parseInt(domainId)] : 'Unknown Domain';

  const { data: initialProviders, isLoading, refetch } = useQuery(
    ['domainProviders', domainId],
    () => getServiceProvidersByDomain(parseInt(domainId!)),
    {
      enabled: !!domainId,
      retry: false
    }
  );

  useEffect(() => {
    if (initialProviders) {
      setProviders(initialProviders);
      setLoading(false);
    }
  }, [initialProviders]);

  const userOrganizer = currentUser && currentUser.role === 'ORGANIZER' ? currentUser : null;

  const handleEngageProvider = async (providerId: string) => {
    if (!currentUser || !userOrganizer) {
      toast({
        title: "Error",
        description: "You must be logged in as an organizer to engage providers",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if already engaged
      const existingRequests = await getOrganizerServiceRequests(userOrganizer.id);
      const hasExistingRequest = existingRequests.some(req => 
        req.service_provider_id === providerId && req.status !== 'completed' && req.status !== 'cancelled'
      );

      if (hasExistingRequest) {
        toast({
          title: "Already Engaged",
          description: "You already have an active request with this provider",
          variant: "destructive"
        });
        return;
      }

      // Create new service request
      const requestData = {
        title: `Service Request for ${providers.find(p => p.id === providerId)?.business_name}`,
        description: "Initial engagement request",
        organizer_id: userOrganizer.id,
        service_provider_id: providerId,
        status: 'pending' as const,
        domain_page: parseInt(domainId)
      };

      await createServiceRequest(requestData);
      
      toast({
        title: "Success!",
        description: "Your engagement request has been sent"
      });

      // Refresh providers list
      refetch();
    } catch (error) {
      console.error('Error engaging provider:', error);
      toast({
        title: "Error",
        description: "Failed to engage provider",
        variant: "destructive"
      });
    }
  };

  const handleViewProfile = (providerId: string) => {
    navigate(`/modul8/provider/${providerId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/modul8')} className="pl-0">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Domains
          </Button>
          <h1 className="text-3xl font-bold mt-2">
            {domainName} Providers
          </h1>
          <p className="text-muted-foreground">
            Browse service providers specializing in {domainName}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-md"></div>
                <div className="h-6 bg-muted mt-2 rounded-md"></div>
                <div className="h-4 bg-muted mt-1 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers?.map((provider) => (
              <EnhancedProviderCard
                key={provider.id}
                provider={provider}
                onEngage={handleEngageProvider}
                onViewProfile={handleViewProfile}
                hasExistingRequest={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainProviders;
