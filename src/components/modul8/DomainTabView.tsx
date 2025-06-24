
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building, 
  Star, 
  DollarSign, 
  Users,
  Eye,
  MessageSquare
} from 'lucide-react';
import { ServiceProvider } from '@/types/modul8';
import { getServiceProvidersByDomain, getServiceProviders } from '@/services/modul8Service';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface DomainTabViewProps {
  domainId: number;
  organizerId?: string;
}

const DomainTabView: React.FC<DomainTabViewProps> = ({ domainId, organizerId }) => {
  const navigate = useNavigate();
  const [allProviders, setAllProviders] = useState<ServiceProvider[]>([]);
  const [activeProviders, setActiveProviders] = useState<ServiceProvider[]>([]);
  const [affiliatedProviders, setAffiliatedProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, [domainId]);

  const loadProviders = async () => {
    try {
      setLoading(true);
      
      // Load all providers for this domain
      const domainProviders = await getServiceProvidersByDomain(domainId);
      setAllProviders(domainProviders);
      
      // TODO: Implement logic to filter active and affiliated providers
      // For now, showing sample data
      setActiveProviders(domainProviders.slice(0, 2));
      setAffiliatedProviders(domainProviders.slice(2, 4));
      
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
    navigate(`/modul8/provider/${provider.id}/request`);
  };

  const handleViewProfile = (provider: ServiceProvider) => {
    // TODO: Implement provider profile view
    console.log('View provider profile:', provider.id);
  };

  const renderProviderCard = (provider: ServiceProvider, showEngageButton = true) => (
    <Card key={provider.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={provider.logo_url} />
            <AvatarFallback>
              <Building className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 truncate">
              {provider.business_name}
            </h3>
            
            {provider.tagline && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                {provider.tagline}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              {provider.pricing_range?.min && (
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    From ${provider.pricing_range.min.toLocaleString()}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>12 projects</span>
              </div>
            </div>
            
            {provider.services && provider.services.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
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
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewProfile(provider)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            
            {showEngageButton && (
              <Button
                onClick={() => handleEngageProvider(provider)}
                size="sm"
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Engage
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">
          All ({allProviders.length})
        </TabsTrigger>
        <TabsTrigger value="active">
          Active ({activeProviders.length})
        </TabsTrigger>
        <TabsTrigger value="affiliated">
          Affiliated ({affiliatedProviders.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">All Service Providers</h3>
          <p className="text-sm text-muted-foreground">
            Full list of potential collaborators in this domain
          </p>
        </div>
        
        {allProviders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Providers Found</h3>
              <p className="text-muted-foreground text-center">
                No service providers are currently available in this domain.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {allProviders.map(provider => renderProviderCard(provider))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="active" className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Providers</h3>
          <p className="text-sm text-muted-foreground">
            Currently engaged providers with active projects
          </p>
        </div>
        
        {activeProviders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Projects</h3>
              <p className="text-muted-foreground text-center">
                You don't have any active projects with providers in this domain.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeProviders.map(provider => renderProviderCard(provider, false))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="affiliated" className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Affiliated Providers</h3>
          <p className="text-sm text-muted-foreground">
            Previously engaged or saved providers
          </p>
        </div>
        
        {affiliatedProviders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Affiliated Providers</h3>
              <p className="text-muted-foreground text-center">
                You haven't worked with or saved any providers in this domain yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {affiliatedProviders.map(provider => renderProviderCard(provider))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DomainTabView;
