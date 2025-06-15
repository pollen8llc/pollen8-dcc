
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Star,
  FileText,
  MessageSquare
} from 'lucide-react';
import { ServiceRequest } from '@/types/modul8';
import { getServiceProviderProjects } from '@/services/modul8ProjectService';
import { getUserServiceProvider } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';
import ProjectStatusCard from './ProjectStatusCard';
import ProjectCompletionModal from './ProjectCompletionModal';

const ProjectDashboard = () => {
  const { session } = useSession();
  const [projects, setProjects] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ServiceRequest | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [session?.user?.id]);

  const loadProjects = async () => {
    if (!session?.user?.id) return;
    
    try {
      const provider = await getUserServiceProvider(session.user.id);
      if (!provider) return;
      
      const projectData = await getServiceProviderProjects(provider.id);
      setProjects(projectData);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'revision_requested': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending_review': return <FileText className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'revision_requested': return 'bg-yellow-100 text-yellow-800';
      case 'pending_review': return 'bg-purple-100 text-purple-800';
      case 'pending_completion': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filterProjects = (status: string) => {
    switch (status) {
      case 'active':
        return projects.filter(p => ['agreed', 'in_progress'].includes(p.status));
      case 'review':
        return projects.filter(p => ['pending_review', 'revision_requested'].includes(p.status));
      case 'completed':
        return projects.filter(p => p.status === 'completed');
      default:
        return projects;
    }
  };

  const handleCompleteProject = (project: ServiceRequest) => {
    setSelectedProject(project);
    setShowCompletionModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{projects.length} Total Projects</span>
        </div>
      </div>

      {/* Project Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold">
              {projects.filter(p => ['agreed', 'in_progress'].includes(p.status)).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Under Review</span>
            </div>
            <p className="text-2xl font-bold">
              {projects.filter(p => ['pending_review', 'revision_requested'].includes(p.status)).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold">
              {projects.filter(p => p.status === 'completed').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold">4.8</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="review">Under Review</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {['all', 'active', 'review', 'completed'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterProjects(tab).map((project) => (
                <ProjectStatusCard
                  key={project.id}
                  project={project}
                  onComplete={() => handleCompleteProject(project)}
                  onRefresh={loadProjects}
                />
              ))}
            </div>
            
            {filterProjects(tab).length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No {tab === 'all' ? '' : tab} projects found
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {tab === 'active' && "You don't have any active projects at the moment."}
                    {tab === 'review' && "No projects are currently under review."}
                    {tab === 'completed' && "You haven't completed any projects yet."}
                    {tab === 'all' && "You don't have any projects yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Project Completion Modal */}
      {selectedProject && (
        <ProjectCompletionModal
          project={selectedProject}
          open={showCompletionModal}
          onOpenChange={setShowCompletionModal}
          onComplete={() => {
            loadProjects();
            setShowCompletionModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectDashboard;
