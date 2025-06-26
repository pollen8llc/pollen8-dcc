import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, getServiceProviders } from '@/services/modul8Service';
import { ServiceProvider } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, Star, Building2, Users, Heart, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Modul8Partners = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  
  const [organizerData, setOrganizerData] = useState(null);
  const [allProviders, setAllProviders] = useState<ServiceProvider[]>([]);
  const [savedProviders, setSavedProviders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [session?.user?.id]);

  const loadData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const organizer = await getUserOrganizer(session.user.id);
      if (!organizer) {
        navigate('/modul8/setup/organizer');
        return;
      }
      
      const providers = await getServiceProviders();
      setOrganizerData(organizer);
      setAllProviders(providers);
      
      // Load saved providers from localStorage for now
      const saved = localStorage.getItem(`saved_providers_${organizer.id}`);
      if (saved) {
        setSavedProviders(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load partners data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveProvider = (providerId: string) => {
    const newSaved = savedProviders.includes(providerId)
      ? savedProviders.filter(id => id !== providerId)
      : [...savedProviders, providerId];
    
    setSavedProviders(newSaved);
    localStorage.setItem(`saved_providers_${organizerData?.id}`, JSON.stringify(newSaved));
    
    toast({
      title: savedProviders.includes(providerId) ? "Removed from saved" : "Saved partner",
      description: savedProviders.includes(providerId) 
        ? "Provider removed from your saved list" 
        : "Provider added to your saved list"
    });
  };

  const handleContactProvider = (providerId: string) => {
    navigate(`/modul8/dashboard/request/new?provider=${providerId}`);
  };

  const getServiceDisplayName = (service: any): string => {
    if (typeof service === 'string') {
      return service;
    }
    if (service && typeof service === 'object') {
      return service.name || service.title || 'Service';
    }
    return 'Service';
  };

  const filteredProviders = allProviders.filter(provider =>
    provider.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.services.some(service => 
      getServiceDisplayName(service).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const savedProvidersData = allProviders.filter(provider => 
    savedProviders.includes(provider.id)
  );

  const formatPricing = (pricing: any) => {
    if (!pricing || typeof pricing !== 'object') return 'Contact for pricing';
    const { min, max, currency = 'USD' } = pricing;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    }
    return 'Contact for pricing';
  };

  const ProviderCard = ({ provider }: { provider: ServiceProvider }) => {
    const isSaved = savedProviders.includes(provider.id);
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{provider.business_name}</CardTitle>
              {provider.tagline && (
                <p className="text-sm text-muted-foreground mb-2">{provider.tagline}</p>
              )}
              {provider.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{provider.description}</p>
              )}
            </div>
            <Button
              onClick={() => toggleSaveProvider(provider.id)}
              variant="ghost"
              size="sm"
              className={`ml-2 ${isSaved ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Services */}
          {provider.services && provider.services.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Services</h4>
              <div className="flex flex-wrap gap-1">
                {provider.services.slice(0, 3).map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {getServiceDisplayName(service)}
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
          
          {/* Pricing */}
          <div className="text-sm">
            <span className="font-medium">Pricing: </span>
            <span className="text-muted-foreground">{formatPricing(provider.pricing_range)}</span>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleContactProvider(provider.id)}
              size="sm"
              className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {/* View profile logic */}}
            >
              <Users className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/modul8/dashboard')}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold mb-2">Partner Management</h1>
                <p className="text-muted-foreground">
                  Discover, save, and manage your service provider partners
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Providers ({filteredProviders.length})</TabsTrigger>
              <TabsTrigger value="saved">Saved Partners ({savedProvidersData.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {filteredProviders.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No providers found
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Try adjusting your search terms
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProviders.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="saved">
              {savedProvidersData.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No saved partners yet
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Save providers you want to work with for easy access
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedProvidersData.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Modul8Partners;
