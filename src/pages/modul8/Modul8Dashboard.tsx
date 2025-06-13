
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, getOrganizerServiceRequests } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, MessageSquare, CheckCircle, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Organizer, ServiceRequest } from '@/types/modul8';
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
  const [selectedPage, setSelectedPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizerData();
  }, [session?.user?.id]);

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
      setServiceRequests(requests);
    } catch (error) {
      console.error('Error loading organizer data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = serviceRequests.filter(request => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
                    ? 'ring-2 ring-primary bg-primary/5' 
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
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Request Service
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Featured Providers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Featured Service Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProviders.map((provider, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <div className="text-2xl">{provider.logo}</div>
                  <div>
                    <h4 className="font-medium">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground">{provider.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All ({filteredRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Active ({serviceRequests.filter(r => r.domain_page === selectedPage && r.engagement_status === 'negotiating').length})
            </TabsTrigger>
            <TabsTrigger value="affiliated" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Affiliated ({serviceRequests.filter(r => r.domain_page === selectedPage && r.engagement_status === 'affiliated').length})
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
                    className="flex items-center gap-2"
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
