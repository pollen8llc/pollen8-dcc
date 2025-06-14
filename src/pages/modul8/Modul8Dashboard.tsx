import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, getOrganizerServiceRequests, getServiceProvidersByDomain, createEngagement } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, MessageSquare, CheckCircle, Building2, Star, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Organizer, ServiceRequest, ServiceProvider } from '@/types/modul8';
import ServiceRequestCard from '@/components/modul8/ServiceRequestCard';
import { toast } from '@/hooks/use-toast';

// Mock service providers for each domain
const MOCK_PROVIDERS = {
  1: [ // Fundraising & Sponsorship
    { name: "FundRaise Pro", tagline: "Expert grant writers for nonprofits", logo: "💰" },
    { name: "Sponsor Connect", tagline: "Corporate partnership specialists", logo: "🤝" }
  ],
  2: [ // Event Production & Logistics
    { name: "EventFlow Solutions", tagline: "End-to-end event management", logo: "🎪" },
    { name: "Logistics Masters", tagline: "Seamless venue coordination", logo: "📋" }
  ],
  3: [ // Legal & Compliance
    { name: "LegalEase Partners", tagline: "Nonprofit legal specialists", logo: "⚖️" },
    { name: "Compliance Guard", tagline: "Risk management & compliance", logo: "🛡️" }
  ],
  4: [ // Marketing & Communications
    { name: "Brand Builders", tagline: "Digital marketing for impact", logo: "📢" },
    { name: "Story Craft", tagline: "Content & communications", logo: "✍️" }
  ],
  5: [ // Technology & Digital Infrastructure
    { name: "TechForGood", tagline: "Custom software solutions", logo: "💻" },
    { name: "Digital Bridge", tagline: "CRM & automation experts", logo: "🌐" }
  ],
  6: [ // Vendor & Marketplace Management
    { name: "Supply Chain Pro", tagline: "Vendor relationship management", logo: "🔗" },
    { name: "Market Connect", tagline: "Marketplace development", logo: "🏪" }
  ],
  7: [ // Partnership Development & Collaboration
    { name: "Alliance Partners", tagline: "Strategic partnership building", logo: "🤲" },
    { name: "Collab Network", tagline: "Collaboration frameworks", logo: "🌟" }
  ],
  8: [ // Community Engagement & Relationship Management
    { name: "Community First", tagline: "Member engagement specialists", logo: "👥" },
    { name: "Relationship Labs", tagline: "Community growth experts", logo: "💬" }
  ]
};

const Modul8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizerData();
  }, [session?.user?.id]);

  useEffect(() => {
    loadServiceProviders();
  }, [selectedPage]);

  const loadOrganizerData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const organizerData = await getUserOrganizer(session.user.id);
      if (!organizerData) {
        navigate('/modul8/setup/organizer');
        return;
      }
      
      setOrganizer(organizerData);
      const requests = await getOrganizerServiceRequests(organizerData.id);
      setServiceRequests(Array.isArray(requests) ? requests : []);
    } catch (error) {
      console.error('Error loading organizer data:', error);
      setServiceRequests([]);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadServiceProviders = async () => {
    try {
      const providers = await getServiceProvidersByDomain(selectedPage);
      setServiceProviders(providers);
    } catch (error) {
      console.error('Error loading service providers:', error);
      setServiceProviders([]);
    }
  };

  const handleEngageProvider = async (providerId: string) => {
    if (!organizer) return;
    
    try {
      // Track engagement
      await createEngagement({
        organizer_id: organizer.id,
        service_provider_id: providerId,
        engagement_type: 'engage'
      });
      
      // Navigate to create service request with provider pre-selected
      navigate(`/modul8/request/new?domain=${selectedPage}&provider=${providerId}`);
    } catch (error) {
      console.error('Error tracking engagement:', error);
      // Still navigate even if tracking fails
      navigate(`/modul8/request/new?domain=${selectedPage}&provider=${providerId}`);
    }
  };

  const formatPricing = (pricing: any) => {
    if (!pricing || typeof pricing !== 'object') return 'Contact for pricing';
    const { min, max, currency = 'USD' } = pricing;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Contact for pricing';
  };

  const filteredRequests = (serviceRequests || []).filter(request => {
    if (request.domain_page !== selectedPage) return false;
    
    switch (activeTab) {
      case 'active':
        return request.engagement_status === 'negotiating';
      case 'affiliated':
        return request.engagement_status === 'affiliated';
      default:
        return true;
    }
  });

  const currentDomain = DOMAIN_PAGES.find(p => p.id === selectedPage);
  const currentProviders = MOCK_PROVIDERS[selectedPage as keyof typeof MOCK_PROVIDERS] || [];

  const getStatusCounts = () => {
    const domainRequests = (serviceRequests || []).filter(r => r.domain_page === selectedPage);
    return {
      all: domainRequests.length,
      active: domainRequests.filter(r => r.engagement_status === 'negotiating').length,
      affiliated: domainRequests.filter(r => r.engagement_status === 'affiliated').length
    };
  };

  const statusCounts = getStatusCounts();

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Modul8 Dashboard</h1>
          <p className="text-muted-foreground">Manage your ecosystem partnerships and collaborations</p>
        </div>

        {/* Domain Page Selector */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DOMAIN_PAGES.map((page) => (
              <Card 
                key={page.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPage === page.id 
                    ? 'ring-2 ring-[#00eada] bg-[#00eada]/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setSelectedPage(page.id)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{page.title}</h3>
                  <p className="text-xs text-muted-foreground">{page.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Domain Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{currentDomain?.title}</CardTitle>
                <p className="text-muted-foreground mt-1">{currentDomain?.description}</p>
              </div>
              <Button 
                onClick={() => navigate(`/modul8/request/new?domain=${selectedPage}`)}
                className="flex items-center gap-2 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                <Plus className="h-4 w-4" />
                Request Service
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Service Providers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Available Service Providers ({serviceProviders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {serviceProviders.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No service providers yet
                </h3>
                <p className="text-muted-foreground">
                  Service providers specializing in {currentDomain?.title.toLowerCase()} will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{provider.business_name}</h4>
                          {provider.tagline && (
                            <p className="text-sm text-muted-foreground mb-2">{provider.tagline}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-current" />
                          --
                        </div>
                      </div>
                      
                      {provider.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {provider.description}
                        </p>
                      )}
                      
                      {provider.tags && provider.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {provider.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {provider.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{provider.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="text-sm text-muted-foreground mb-3">
                        {formatPricing(provider.pricing_range)}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {/* View profile functionality */}}
                        >
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                          onClick={() => handleEngageProvider(provider.id)}
                        >
                          Engage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Active ({statusCounts.active})
            </TabsTrigger>
            <TabsTrigger value="affiliated" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Affiliated ({statusCounts.affiliated})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No {activeTab === 'all' ? 'service requests' : activeTab} partnerships yet
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start building your ecosystem by requesting services from providers
                  </p>
                  <Button 
                    onClick={() => navigate(`/modul8/request/new?domain=${selectedPage}`)}
                    className="flex items-center gap-2 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    <Plus className="h-4 w-4" />
                    Request Service
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <ServiceRequestCard 
                    key={request.id} 
                    request={request}
                    onUpdate={loadOrganizerData}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Modul8Dashboard;
