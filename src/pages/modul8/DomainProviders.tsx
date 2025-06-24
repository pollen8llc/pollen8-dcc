
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import EnhancedProviderCard from '@/components/modul8/EnhancedProviderCard';
import { getServiceProvidersByDomain, getUserOrganizer } from '@/services/modul8Service';
import { checkExistingRequest } from '@/services/negotiationService';
import { ServiceProvider, Organizer } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';

const DOMAIN_PAGES = {
  1: 'Fundraising & Sponsorship',
  2: 'Event Production & Logistics', 
  3: 'Legal & Compliance',
  4: 'Marketing & Communications',
  5: 'Technology & Digital Infrastructure',
  6: 'Vendor & Marketplace Management',
  7: 'Partnership Development & Collaboration',
  8: 'Community Engagement & Relationship Management'
};

const DomainProviders = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [existingRequests, setExistingRequests] = useState<Record<string, boolean>>({});

  const domainNumber = parseInt(domainId || '1');
  const domainTitle = DOMAIN_PAGES[domainNumber as keyof typeof DOMAIN_PAGES] || 'Domain';

  useEffect(() => {
    loadData();
  }, [domainId, session?.user?.id]);

  const loadData = async () => {
    if (!session?.user?.id || !domainId) return;
    
    setLoading(true);
    try {
      const [providersData, organizerData] = await Promise.all([
        getServiceProvidersByDomain(domainNumber),
        getUserOrganizer(session.user.id)
      ]);
      
      setProviders(providersData);
      setOrganizer(organizerData);

      // Check for existing requests with each provider
      if (organizerData) {
        const requestChecks = await Promise.all(
          providersData.map(async (provider) => {
            const existingRequest = await checkExistingRequest(organizerData.id, provider.id);
            return { providerId: provider.id, hasRequest: !!existingRequest };
          })
        );
        
        const requestMap = requestChecks.reduce((acc, { providerId, hasRequest }) => {
          acc[providerId] = hasRequest;
          return acc;
        }, {} as Record<string, boolean>);
        
        setExistingRequests(requestMap);
      }
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

  const handleEngage = async (providerId: string) => {
    if (!organizer) {
      toast({
        title: "Setup Required",
        description: "Please complete your organizer profile first",
        variant: "destructive"
      });
      navigate('/modul8/setup/organizer');
      return;
    }

    // Check for existing request
    const existingRequest = await checkExistingRequest(organizer.id, providerId);
    
    if (existingRequest) {
      // Navigate to existing request status
      navigate(`/modul8/provider/${providerId}/${existingRequest.id}/status`);
    } else {
      // Navigate to create new request
      navigate(`/modul8/provider/${providerId}/request`);
    }
  };

  const handleViewProfile = (providerId: string) => {
    // For now, just show a toast - we can implement detailed profile modal later
    toast({
      title: "Profile View",
      description: "Provider profile view coming soon!"
    });
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = searchTerm === '' || 
      provider.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(provider.services) && provider.services.some((service: any) => 
        (typeof service === 'string' ? service : service.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      ));

    switch (activeTab) {
      case 'active':
        return matchesSearch && existingRequests[provider.id];
      case 'affiliated':
        return matchesSearch && false; // TODO: Implement affiliated logic
      default:
        return matchesSearch;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
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
          <div>
            <h1 className="text-3xl font-bold">{domainTitle}</h1>
            <p className="text-muted-foreground">
              Connect with specialized service providers in this domain
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers by name, services, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All ({providers.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({Object.values(existingRequests).filter(Boolean).length})
            </TabsTrigger>
            <TabsTrigger value="affiliated">
              Affiliated (0)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <EnhancedProviderCard
                  key={provider.id}
                  provider={provider}
                  onEngage={handleEngage}
                  onViewProfile={handleViewProfile}
                  hasExistingRequest={existingRequests[provider.id]}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <EnhancedProviderCard
                  key={provider.id}
                  provider={provider}
                  onEngage={handleEngage}
                  onViewProfile={handleViewProfile}
                  hasExistingRequest={true}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="affiliated" className="mt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No affiliated providers yet. Complete projects to build your network!
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm 
                ? `No providers found matching "${searchTerm}"`
                : "No providers available in this domain yet."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainProviders;
