
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getServiceProvidersByDomain } from '@/services/modul8Service';
import { ServiceProvider } from '@/types/modul8';
import { DOMAIN_PAGES } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Building2, ExternalLink, DollarSign } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const DomainDirectory = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  const domain = DOMAIN_PAGES.find(d => d.id === parseInt(domainId || '0'));

  useEffect(() => {
    if (domainId) {
      loadProviders();
    }
  }, [domainId]);

  const loadProviders = async () => {
    if (!domainId) return;
    
    try {
      setLoading(true);
      const domainProviders = await getServiceProvidersByDomain(parseInt(domainId));
      setProviders(domainProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast({
        title: "Error",
        description: "Failed to load service providers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEngageProvider = (provider: ServiceProvider) => {
    // Store selected provider in session storage for the request form
    sessionStorage.setItem('selectedProvider', JSON.stringify(provider));
    setSelectedProvider(provider);
    
    toast({
      title: "Provider Selected",
      description: `You're now engaging with ${provider.business_name}`,
    });
    
    // Navigate to request form
    navigate('/modul8/dashboard/request/new');
  };

  if (!domain) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Domain Not Found</h1>
            <Button onClick={() => navigate('/modul8/dashboard')}>
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
          <div>
            <h1 className="text-3xl font-bold">{domain.title}</h1>
            <p className="text-muted-foreground mt-1">{domain.description}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00eada]"></div>
          </div>
        ) : providers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Service Providers Found
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                There are currently no service providers specializing in this domain.
              </p>
              <Button onClick={() => navigate('/modul8/dashboard')}>
                Browse Other Domains
              </Button>
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
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{provider.business_name}</CardTitle>
                      {provider.tagline && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
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
                            {service}
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
                  
                  {provider.tags && provider.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {provider.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {provider.pricing_range && provider.pricing_range.min && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>
                        From ${provider.pricing_range.min.toLocaleString()}
                        {provider.pricing_range.max && 
                          ` - $${provider.pricing_range.max.toLocaleString()}`
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
  );
};

export default DomainDirectory;
