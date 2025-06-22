
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnifiedHeader } from "@/components/shared/UnifiedHeader";
import { getServiceProvidersByDomain, getUserOrganizer } from "@/services/modul8Service";
import { ServiceProvider, Organizer } from "@/types/modul8";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Star,
  MapPin,
  Globe,
  ExternalLink,
  Users,
  Building,
  MessageSquare,
  Clock,
  DollarSign
} from "lucide-react";

const DOMAIN_NAMES: Record<number, string> = {
  1: "Fundraising & Sponsorship",
  2: "Event Production & Logistics", 
  3: "Legal & Compliance",
  4: "Marketing & Communications",
  5: "Technology & Digital Infrastructure",
  6: "Vendor & Marketplace Management",
  7: "Partnership Development",
  8: "Community Engagement & Relations"
};

const DomainProviders: React.FC = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadData();
  }, [domainId, session?.user?.id]);

  const loadData = async () => {
    if (!domainId || !session?.user?.id) return;
    
    setLoading(true);
    try {
      console.log('Loading providers for domain:', domainId);
      
      const [providersData, organizerData] = await Promise.all([
        getServiceProvidersByDomain(parseInt(domainId)),
        getUserOrganizer(session.user.id)
      ]);
      
      console.log('Providers loaded:', providersData);
      setProviders(providersData);
      setOrganizer(organizerData);
    } catch (err: any) {
      console.error('Error loading providers:', err);
      toast({
        title: "Error loading providers",
        description: err?.message || "Failed to load service providers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEngageProvider = (provider: ServiceProvider) => {
    console.log('Engaging provider:', provider.id);
    // Store provider info in session storage for the request form
    sessionStorage.setItem('selectedProvider', JSON.stringify({
      id: provider.id,
      business_name: provider.business_name,
      domain_id: domainId
    }));
    navigate('/modul8/request/create');
  };

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

  const renderServiceBadges = (services: string[]) => {
    if (!Array.isArray(services) || services.length === 0) {
      return null;
    }
    
    return services.slice(0, 3).map((service, index) => (
      <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
        {typeof service === 'string' ? service : 'Service'}
      </Badge>
    ));
  };

  const renderProviderCard = (provider: ServiceProvider) => (
    <Card key={provider.id} className="glass-card glass-morphism-hover">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-gray-600">
            <AvatarImage src={provider.logo_url} />
            <AvatarFallback className="bg-gradient-to-br from-[#00eada] to-[#00c4b8] text-black font-bold">
              {provider.business_name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-white text-lg">{provider.business_name}</h3>
              {provider.tagline && (
                <p className="text-sm text-gray-300">{provider.tagline}</p>
              )}
            </div>
            
            <p className="text-sm text-gray-400 line-clamp-2">
              {provider.description || "Professional service provider"}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {renderServiceBadges(provider.services)}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{formatPricing(provider.pricing_range)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>4.8</span>
              </div>
            </div>
            
            {provider.portfolio_links && provider.portfolio_links.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(provider.portfolio_links[0], '_blank')}
                  className="text-[#00eada] hover:text-[#00c4b8] p-0 h-auto"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Portfolio
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleEngageProvider(provider)}
              className="bg-[#00eada] hover:bg-[#00c4b8] text-black font-medium"
            >
              Engage
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-white/10"
              onClick={() => navigate(`/modul8/providers/${provider.id}`)}
            >
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Service Providers...</p>
        </div>
      </div>
    );
  }

  const domainName = DOMAIN_NAMES[parseInt(domainId || '1')] || 'Unknown Domain';
  
  // Filter providers based on active tab
  const filteredProviders = providers.filter(provider => {
    switch (activeTab) {
      case 'active':
        // Show providers with active engagements (this would need additional data)
        return false; // For now, show none until we have engagement data
      case 'affiliated':
        // Show previously engaged providers (this would need additional data)
        return false; // For now, show none until we have engagement data
      default:
        return true; // Show all providers
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <UnifiedHeader 
        platform="modul8" 
        user={session?.user}
        notificationCount={0}
        unreadMessages={0}
        onLogout={logout}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/modul8')}
            className="border-gray-600 text-gray-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{domainName}</h1>
            <p className="text-gray-400">
              Browse and engage with service providers in this domain
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-800/50 border-gray-700">
              <TabsTrigger 
                value="all" 
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#00eada]/20"
              >
                All Providers ({providers.length})
              </TabsTrigger>
              <TabsTrigger 
                value="active" 
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#00eada]/20"
              >
                Active (0)
              </TabsTrigger>
              <TabsTrigger 
                value="affiliated" 
                className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#00eada]/20"
              >
                Affiliated (0)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {providers.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="p-12 text-center">
                    <Building className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No providers found</h3>
                    <p className="text-gray-400">
                      There are no service providers available in this domain yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {providers.map(renderProviderCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No active engagements</h3>
                  <p className="text-gray-400">
                    You don't have any active projects with providers in this domain.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="affiliated" className="space-y-4">
              <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No affiliated providers</h3>
                  <p className="text-gray-400">
                    You haven't worked with any providers in this domain yet.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DomainProviders;
