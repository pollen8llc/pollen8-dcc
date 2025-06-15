
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getUserServiceProvider } from '@/services/modul8Service';
import { getServiceProviderProjects } from '@/services/modul8ProjectService';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Building2,
  FolderOpen,
  Star,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceProvider, ServiceRequest } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';
import ProjectDashboard from '@/components/labr8/ProjectDashboard';

const Labr8Dashboard = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [myProjects, setMyProjects] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    loadDashboardData();
  }, [session?.user?.id]);

  const loadDashboardData = async () => {
    if (!session?.user?.id) return;
    
    try {
      console.log('Loading dashboard data for user:', session.user.id);
      const provider = await getUserServiceProvider(session.user.id);
      console.log('Service provider:', provider);
      
      if (!provider) {
        console.log('No service provider found, redirecting to setup');
        navigate('/labr8/setup');
        return;
      }
      
      setServiceProvider(provider);
      
      // Load provider's current projects
      console.log('Loading projects for provider:', provider.id);
      const projects = await getServiceProviderProjects(provider.id);
      console.log('Loaded projects:', projects);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/labr8');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">LAB-R8 Dashboard</h1>
            <p className="text-muted-foreground">Service provider portal for project management</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content - Only Projects Tab */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 max-w-md">
            <TabsTrigger value="projects">My Projects ({stats.total})</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <ProjectDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Labr8Dashboard;
