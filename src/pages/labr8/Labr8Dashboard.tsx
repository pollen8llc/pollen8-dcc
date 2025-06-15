
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
  LogOut,
  RefreshCw
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
    console.log('Labr8Dashboard: Session state changed:', session);
    if (session?.user?.id) {
      loadDashboardData();
    } else {
      console.log('Labr8Dashboard: No session found, redirecting to auth');
      navigate('/labr8');
    }
  }, [session?.user?.id]);

  const loadDashboardData = async () => {
    if (!session?.user?.id) {
      console.log('No user session available');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Loading dashboard data for user:', session.user.id);
      
      const provider = await getUserServiceProvider(session.user.id);
      console.log('Service provider found:', provider);
      
      if (!provider) {
        console.log('No service provider found, redirecting to setup');
        toast({
          title: "Setup Required",
          description: "Please complete your service provider setup first",
          variant: "destructive"
        });
        navigate('/labr8/setup');
        return;
      }
      
      setServiceProvider(provider);
      
      // Load provider's current projects
      console.log('Loading projects for provider:', provider.id);
      const projects = await getServiceProviderProjects(provider.id);
      console.log('Loaded projects:', projects);
      setMyProjects(Array.isArray(projects) ? projects : []);
      
      if (!projects || projects.length === 0) {
        console.log('No projects found for provider');
        toast({
          title: "No Projects",
          description: "You don't have any active projects yet. Projects will appear here when organizers assign work to you.",
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive"
      });
      setMyProjects([]);
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

  const handleRefresh = () => {
    console.log('Refreshing dashboard data...');
    loadDashboardData();
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      </div>
    );
  }

  // Show auth required message if no session
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <LogOut className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Authentication Required
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Please log in to access your LAB-R8 dashboard
              </p>
              <Button onClick={() => navigate('/labr8')}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
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
            <p className="text-muted-foreground">
              Service provider portal for project management
              {serviceProvider && (
                <span className="ml-2 text-sm">
                  • {serviceProvider.business_name}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
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

        {/* Debug Info - Remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-sm text-yellow-800">Debug Info</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-yellow-700">
              <div>User ID: {session?.user?.id || 'None'}</div>
              <div>Service Provider: {serviceProvider ? serviceProvider.business_name : 'None'}</div>
              <div>Projects Count: {myProjects.length}</div>
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Content */}
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
