
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Clock, 
  CheckCircle, 
  DollarSign,
  Calendar,
  ArrowRight,
  FileText,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceRequest, DOMAIN_PAGES } from '@/types/modul8';
import { getServiceProviderProjects } from '@/services/modul8ProjectService';
import { getUserServiceProvider } from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

const EnhancedLabr8Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [projects, setProjects] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceProvider, setServiceProvider] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [session?.user?.id]);

  const loadDashboardData = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const provider = await getUserServiceProvider(session.user.id);
      setServiceProvider(provider);

      if (provider) {
        const providerProjects = await getServiceProviderProjects(provider.id);
        setProjects(providerProjects);
      }
    } catch (error) {
      console.error('Error loading LAB-R8 dashboard:', error);
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
    const stats = {
      active: projects.filter(p => ['agreed', 'in_progress', 'pending_review'].includes(p.status)).length,
      completed: projects.filter(p => p.status === 'completed').length,
      pending_review: projects.filter(p => p.status === 'pending_review').length,
      total: projects.length
    };
    return stats;
  };

  const getProjectsByStatus = (status: string[]) => {
    return projects.filter(p => status.includes(p.status));
  };

  const getDomainProjects = () => {
    const domainMap = new Map();
    projects.forEach(project => {
      const domain = DOMAIN_PAGES.find(d => d.id === project.domain_page);
      if (domain) {
        if (!domainMap.has(domain.id)) {
          domainMap.set(domain.id, { domain, count: 0, projects: [] });
        }
        domainMap.get(domain.id).count++;
        domainMap.get(domain.id).projects.push(project);
      }
    });
    return Array.from(domainMap.values());
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'agreed': return 25;
      case 'in_progress': return 50;
      case 'pending_review': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const stats = getProjectStats();
  const activeProjects = getProjectsByStatus(['agreed', 'in_progress', 'pending_review']);
  const completedProjects = getProjectsByStatus(['completed']);
  const domainBreakdown = getDomainProjects();

  const ProjectCard: React.FC<{ project: ServiceRequest }> = ({ project }) => (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium line-clamp-2">{project.title}</h3>
            <Badge variant="outline" className="ml-2">
              {project.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>

            {project.budget_range && (project.budget_range.min || project.budget_range.max) && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  {project.budget_range.min && project.budget_range.max
                    ? `$${project.budget_range.min.toLocaleString()} - $${project.budget_range.max.toLocaleString()}`
                    : project.budget_range.min
                    ? `From $${project.budget_range.min.toLocaleString()}`
                    : `Up to $${project.budget_range.max?.toLocaleString()}`}
                </span>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{getProgressColor(project.status)}%</span>
              </div>
              <Progress value={getProgressColor(project.status)} className="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">LAB-R8 Dashboard</h1>
          <p className="text-muted-foreground">Manage your assigned projects and deliverables</p>
        </div>
        <Button
          onClick={() => navigate('/modul8/domains')}
          variant="outline"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Browse Opportunities
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Projects</span>
            </div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-blue-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Pending Review</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-orange-600">{stats.pending_review}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="text-2xl font-bold mt-1 text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Projects ({stats.active})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <div className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                          <div className="h-2 bg-muted rounded animate-pulse" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : activeProjects.length > 0 ? (
                  activeProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No Active Projects</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        You don't have any active projects at the moment.
                      </p>
                      <Button
                        onClick={() => navigate('/modul8/domains')}
                        variant="outline"
                      >
                        Browse Opportunities
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <div className="space-y-4">
                {completedProjects.length > 0 ? (
                  completedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No Completed Projects</h3>
                      <p className="text-sm text-muted-foreground">
                        Completed projects will appear here once you finish them.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Domain Breakdown */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Domain Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {domainBreakdown.length > 0 ? (
                  domainBreakdown.map(({ domain, count, projects }) => (
                    <div
                      key={domain.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/modul8/domain/${domain.id}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{domain.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {count} project{count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No domain data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={() => navigate('/modul8/domains')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse New Opportunities
                </Button>
                
                <Button
                  onClick={() => navigate('/labr8/profile')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLabr8Dashboard;
