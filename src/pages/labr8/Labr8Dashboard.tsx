
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getUserServiceProvider } from '@/services/modul8Service';
import { getServiceProviderProjects } from '@/services/modul8ProjectService';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  CheckCircle, 
  Building2,
  FolderOpen,
  Star,
  LogOut,
  RefreshCw,
  AlertTriangle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceProvider, ServiceRequest } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';
import ProjectStatusCard from '@/components/labr8/ProjectStatusCard';
import ProjectCompletionModal from '@/components/labr8/ProjectCompletionModal';

const Labr8Dashboard = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [projects, setProjects] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ServiceRequest | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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
      
      console.log('Loading projects for provider:', provider.id);
      const projectData = await getServiceProviderProjects(provider.id);
      console.log('Loaded projects:', projectData);
      const validProjects = Array.isArray(projectData) ? projectData : [];
      setProjects(validProjects);
      
      if (validProjects.length === 0) {
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
      setProjects([]);
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

  const handleCompleteProject = (project: ServiceRequest) => {
    setSelectedProject(project);
    setShowCompletionModal(true);
  };

  const getProjectStats = () => {
    return {
      active: projects.filter(p => ['agreed', 'in_progress'].includes(p.status)).length,
      needsAttention: projects.filter(p => ['revision_requested'].includes(p.status)).length,
      underReview: projects.filter(p => ['pending_review', 'pending_completion'].includes(p.status)).length,
      completed: projects.filter(p => p.status === 'completed').length,
      total: projects.length
    };
  };

  const stats = getProjectStats();
  const urgentProjects = projects.filter(p => p.status === 'revision_requested');
  const activeProjects = projects.filter(p => ['agreed', 'in_progress'].includes(p.status));

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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">LAB-R8 Dashboard</h1>
            <p className="text-muted-foreground">
              {serviceProvider?.business_name || 'Service Provider Portal'}
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

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Needs Attention</p>
                  <p className="text-xl font-bold">{stats.needsAttention}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                  <p className="text-xl font-bold">{stats.underReview}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Projects Section */}
        {urgentProjects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-xl font-semibold text-red-700">Needs Immediate Attention</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgentProjects.map((project) => (
                <ProjectStatusCard
                  key={project.id}
                  project={project}
                  onComplete={() => handleCompleteProject(project)}
                  onRefresh={loadDashboardData}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Active Projects</h2>
            <span className="text-sm text-muted-foreground">{activeProjects.length} active</span>
          </div>

          {activeProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.map((project) => (
                <ProjectStatusCard
                  key={project.id}
                  project={project}
                  onComplete={() => handleCompleteProject(project)}
                  onRefresh={loadDashboardData}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No Active Projects
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any active projects at the moment. New projects will appear here when organizers assign work to you.
                </p>
                <Button 
                  onClick={handleRefresh} 
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4" />
                  Check for Projects
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* All Other Projects */}
        {projects.filter(p => !['agreed', 'in_progress', 'revision_requested'].includes(p.status)).length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Other Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => !['agreed', 'in_progress', 'revision_requested'].includes(p.status))
                .map((project) => (
                  <ProjectStatusCard
                    key={project.id}
                    project={project}
                    onComplete={() => handleCompleteProject(project)}
                    onRefresh={loadDashboardData}
                  />
                ))}
            </div>
          </div>
        )}

        {/* Project Completion Modal */}
        {selectedProject && (
          <ProjectCompletionModal
            project={selectedProject}
            open={showCompletionModal}
            onOpenChange={setShowCompletionModal}
            onComplete={() => {
              loadDashboardData();
              setShowCompletionModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Labr8Dashboard;
