
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  Users, 
  CheckCircle, 
  Star,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { ServiceProvider, DOMAIN_PAGES } from '@/types/modul8';
import { getServiceProvidersByDomain } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';

const DomainPage: React.FC = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const domain = DOMAIN_PAGES.find(d => d.id === parseInt(domainId || '0'));

  useEffect(() => {
    if (domainId) {
      loadProviders(parseInt(domainId));
    }
  }, [domainId]);

  const loadProviders = async (id: number) => {
    try {
      setLoading(true);
      const data = await getServiceProvidersByDomain(id);
      setProviders(data);
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

  const getFilteredProviders = () => {
    switch (activeTab) {
      case 'active':
        // Filter providers with active projects
        return providers.filter(provider => 
          // This would need additional data about active projects
          // For now, return all providers
          true
        );
      case 'affiliated':
        // Filter providers previously worked with
        return providers.filter(provider => 
          // This would need additional data about previous work
          // For now, return all providers
          true
        );
      default:
        return providers;
    }
  };

  const ServiceProviderCard: React.FC<{ provider: ServiceProvider }> = ({ provider }) => (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={provider.logo_url} />
            <AvatarFallback>
              <Building2 className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">{provider.business_name}</CardTitle>
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

        <div className="space-y-3">
          {provider.services && Array.isArray(provider.services) && provider.services.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Services</h4>
              <div className="flex flex-wrap gap-1">
                {provider.services.slice(0, 3).map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {typeof service === 'string' ? service : JSON.stringify(service)}
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

          {provider.pricing_range && (provider.pricing_range.min || provider.pricing_range.max) && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Pricing:</span>
              <span className="text-muted-foreground">
                {provider.pricing_range.min && provider.pricing_range.max
                  ? `$${provider.pricing_range.min.toLocaleString()} - $${provider.pricing_range.max.toLocaleString()}`
                  : provider.pricing_range.min
                  ? `From $${provider.pricing_range.min.toLocaleString()}`
                  : `Up to $${provider.pricing_range.max?.toLocaleString()}`}
              </span>
            </div>
          )}

          {provider.tags && provider.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {provider.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            Contact
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-1" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!domain) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Domain Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested domain page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{domain.title}</h1>
        <p className="text-muted-foreground">{domain.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Providers</TabsTrigger>
          <TabsTrigger value="active">Currently Active</TabsTrigger>
          <TabsTrigger value="affiliated">Previously Worked</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="h-64">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-3 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : getFilteredProviders().length > 0 ? (
              getFilteredProviders().map((provider) => (
                <ServiceProviderCard key={provider.id} provider={provider} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No providers found</h3>
                <p className="text-sm text-muted-foreground">
                  There are no service providers available in this domain yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredProviders().map((provider) => (
              <ServiceProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="affiliated" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredProviders().map((provider) => (
              <ServiceProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DomainPage;
