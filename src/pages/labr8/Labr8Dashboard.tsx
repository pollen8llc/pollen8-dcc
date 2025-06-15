
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getUserServiceProvider, getServiceRequests } from '@/services/modul8Service';
import { getServiceProviderProjects } from '@/services/modul8ProjectService';
import { DOMAIN_PAGES } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight, 
  Building2,
  FolderOpen,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceProvider, ServiceRequest } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';
import ProjectDashboard from '@/components/labr8/ProjectDashboard';

const Labr8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [myProjects, setMyProjects] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('opportunities');

  useEffect(() => {
    loadDashboardData();
  }, [session?.user?.id]);

  const loadDashboardData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const provider = await getUserServiceProvider(session.user.id);
      if (!provider) {
        navigate('/labr8/setup');
        return;
      }
      
      setServiceProvider(provider);
      
      // Load available service requests based on provider's specializations
      const requests = await getServiceRequests();
      const filteredRequests = requests.filter(request => 
        request.status === 'pending' && 
        (!provider.domain_specializations.length || 
         provider.domain_specializations.includes(request.domain_page))
      );
      setAvailableRequests(filteredRequests);
      
      // Load provider's current projects
      const projects = await getServiceProviderProjects(provider.id);
      setMyProjects(projects);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProjectStats = () => {
    return {
      active: myProjects.filter(p => ['agreed', 'in_progress'].includes(p.status)).length,
      review: myProjects.filter(p => ['pending_review', 'revision_requested'].includes(p.status)).length,
      completed: myProjects.filter(p => p.status === 'completed').length,
      total: myProjects.length
    };
  };

  const stats = getProjectStats();

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
          <h1 className="text-3xl font-bold mb-2">LAB-R8 Dashboard</h1>
          <p className="text-muted-foreground">Service provider portal for project management and opportunities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                  <p className="text-2xl font-bold">{stats.review}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available</p>
                  <p className="text-2xl font-bold">{availableRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="projects">My Projects ({stats.total})</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities" className="space-y-6">
            {/* Domain Pages Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Browse by Domain</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {DOMAIN_PAGES.map((page) => (
                  <Card 
                    key={page.id}
                    className="cursor-pointer transition-all hover:shadow-md hover:bg-muted/50 group"
                    onClick={() => navigate(`/labr8/domain/${page.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm mb-1">{page.title}</h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{page.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" />
                        <span>View requests</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Opportunities */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Opportunities</h2>
              {availableRequests.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No opportunities available
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Check back later for new service requests that match your specializations.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableRequests.slice(0, 6).map((request) => (
                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
                        {request.organizer && (
                          <p className="text-sm text-muted-foreground">
                            {request.organizer.organization_name}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {request.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {request.description}
                          </p>
                        )}
                        
                        <Button
                          onClick={() => navigate(`/labr8/request/${request.id}`)}
                          className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <ProjectDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Labr8Dashboard;
