
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, getServiceProvidersByDomain } from '@/services/modul8Service';
import { DOMAIN_PAGES, ServiceProvider } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Building2, Star, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const DomainDirectory = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const domainId = parseInt(searchParams.get('domain') || '1');
  
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizerData, setOrganizerData] = useState(null);

  useEffect(() => {
    loadData();
  }, [session?.user?.id, domainId]);

  const loadData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const [organizer, domainProviders] = await Promise.all([
        getUserOrganizer(session.user.id),
        getServiceProvidersByDomain(domainId)
      ]);
      
      if (!organizer) {
        navigate('/modul8/setup/organizer');
        return;
      }
      
      setOrganizerData(organizer);
      setProviders(domainProviders);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEngageProvider = (provider: ServiceProvider) => {
    // Store selected provider in session storage
    sessionStorage.setItem('selectedProvider', JSON.stringify(provider));
    navigate(`/modul8/dashboard/request/new?providerId=${provider.id}`);
  };

  const currentDomain = DOMAIN_PAGES.find(p => p.id === domainId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/modul8/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{currentDomain?.title} Providers</h1>
            <p className="text-muted-foreground">
              {currentDomain?.description} • Select a provider to engage with
            </p>
          </div>

          {providers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No providers found in this domain
                </h3>
                <p className="text-muted-foreground text-center">
                  Check back later as more providers join this specialization.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={provider.logo_url} />
                        <AvatarFallback>
                          <Building2 className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{provider.business_name}</CardTitle>
                        {provider.tagline && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {provider.tagline}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {provider.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {provider.description}
                      </p>
                    )}
                    
                    {provider.services && provider.services.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Services</h4>
                        <div className="flex flex-wrap gap-1">
                          {provider.services.slice(0, 3).map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {typeof service === 'string' ? service : service.name}
                            </Badge>
                          ))}
                          {provider.services.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.services.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {provider.pricing_range && (
                      <div className="text-sm">
                        <span className="font-medium">Pricing: </span>
                        <span className="text-muted-foreground">
                          {provider.pricing_range.min && provider.pricing_range.max
                            ? `$${provider.pricing_range.min} - $${provider.pricing_range.max}`
                            : provider.pricing_range.min
                            ? `From $${provider.pricing_range.min}`
                            : 'Contact for pricing'
                          }
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleEngageProvider(provider)}
                        className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                      >
                        Engage
                      </Button>
                      {provider.portfolio_links && provider.portfolio_links.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(provider.portfolio_links[0], '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DomainDirectory;
