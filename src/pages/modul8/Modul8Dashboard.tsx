
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, getOrganizerServiceRequests } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, MessageSquare, CheckCircle, ArrowRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Organizer, ServiceRequest } from '@/types/modul8';
import ServiceRequestCard from '@/components/modul8/ServiceRequestCard';
import { toast } from '@/hooks/use-toast';

const Modul8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
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

  const filteredRequests = (serviceRequests || []).filter(request => {
    switch (activeTab) {
      case 'active':
        return request.engagement_status === 'negotiating';
      case 'affiliated':
        return request.engagement_status === 'affiliated';
      default:
        return true;
    }
  });

  const getStatusCounts = () => {
    return {
      all: (serviceRequests || []).length,
      active: (serviceRequests || []).filter(r => r.engagement_status === 'negotiating').length,
      affiliated: (serviceRequests || []).filter(r => r.engagement_status === 'affiliated').length
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

        {/* Domain Pages Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Service Domains</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOMAIN_PAGES.map((page) => (
              <Card 
                key={page.id}
                className="cursor-pointer transition-all hover:shadow-md hover:bg-muted/50 group"
                onClick={() => navigate(`/modul8/domain/${page.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-sm mb-1">{page.title}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{page.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    <span>Browse providers</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/modul8/request/new')}
                className="flex items-center gap-2 bg-[#00eada] hover:bg-[#00eada]/90 text-black h-12"
              >
                <Plus className="h-4 w-4" />
                Create Service Request
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/modul8/setup/provider')}
                className="flex items-center gap-2 h-12"
              >
                <Building2 className="h-4 w-4" />
                Become a Provider
              </Button>
              <Button 
                variant="outline"
                onClick={() => {/* View all providers */}}
                className="flex items-center gap-2 h-12"
              >
                <Users className="h-4 w-4" />
                View All Providers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Requests Tabs */}
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
                    onClick={() => navigate('/modul8/request/new')}
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
