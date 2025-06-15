
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getUserServiceProvider, getServiceProviderRequests, getAvailableServiceRequests } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  Pause,
  SkipForward,
  Clock,
  DollarSign,
  Building2,
  Star,
  Briefcase,
  TrendingUp,
  Search,
  Filter,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceProvider, ServiceRequest } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';

const SpotifyLabr8Dashboard = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [myProjects, setMyProjects] = useState<ServiceRequest[]>([]);
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'available'>('projects');

  useEffect(() => {
    loadDashboardData();
  }, [session?.user?.id]);

  const loadDashboardData = async () => {
    if (!session?.user?.id) return;
    
    try {
      console.log('Loading dashboard data for user:', session.user.id);
      const provider = await getUserServiceProvider(session.user.id);
      
      if (!provider) {
        console.log('No service provider found, redirecting to setup');
        navigate('/labr8/setup');
        return;
      }
      
      setServiceProvider(provider);
      
      // Load provider's current projects
      const projects = await getServiceProviderRequests(provider.id);
      setMyProjects(projects);
      
      // Load available service requests in provider's domains
      const available = await getAvailableServiceRequests(session.user.id);
      setAvailableRequests(available);
      
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
      active: myProjects.filter(p => ['agreed', 'in_progress', 'assigned'].includes(p.status)).length,
      pending: myProjects.filter(p => p.status === 'pending').length,
      completed: myProjects.filter(p => p.status === 'completed').length,
      total: myProjects.length
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'assigned':
        return 'bg-purple-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getDomainName = (domainPage: number) => {
    const domain = DOMAIN_PAGES.find(d => d.id === domainPage);
    return domain ? domain.title : `Domain ${domainPage}`;
  };

  const formatBudgetRange = (budgetRange: any) => {
    if (!budgetRange || typeof budgetRange !== 'object') return null;
    
    const { min, max, currency = 'USD' } = budgetRange;
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    } else if (min) {
      return `$${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to $${max.toLocaleString()}`;
    }
    return null;
  };

  const stats = getProjectStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1db954]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Spotify-style Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1db954] rounded-full flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-black" />
              </div>
              <span className="text-2xl font-bold">LAB-R8</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('projects')}
                className={`text-sm font-medium hover:text-white transition-colors ${
                  activeTab === 'projects' ? 'text-white border-b-2 border-[#1db954]' : 'text-gray-400'
                }`}
              >
                My Projects
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('available')}
                className={`text-sm font-medium hover:text-white transition-colors ${
                  activeTab === 'available' ? 'text-white border-b-2 border-[#1db954]' : 'text-gray-400'
                }`}
              >
                Available Work
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-8 bg-gradient-to-b from-gray-900 to-black">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">
            Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'}, {serviceProvider?.business_name}
          </h1>
          <p className="text-gray-400">Ready to create something amazing?</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Play className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.active}</p>
                  <p className="text-sm text-gray-400">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                  <p className="text-sm text-gray-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.completed}</p>
                  <p className="text-sm text-gray-400">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{availableRequests.length}</p>
                  <p className="text-sm text-gray-400">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-8">
        {activeTab === 'projects' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Projects</h2>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {myProjects.length > 0 ? (
              <div className="space-y-3">
                {myProjects.map((project, index) => (
                  <Card
                    key={project.id}
                    className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-all cursor-pointer group"
                    onClick={() => navigate(`/labr8/request/${project.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0 group-hover:bg-gray-700 transition-colors">
                          <span className="text-gray-400 font-mono text-sm">#{index + 1}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate group-hover:text-[#1db954] transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {project.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>{getDomainName(project.domain_page)}</span>
                          </div>
                          {formatBudgetRange(project.budget_range) && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatBudgetRange(project.budget_range)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(project.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <Badge 
                          className={`${getStatusColor(project.status)} text-white border-none`}
                        >
                          {formatStatus(project.status)}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#1db954] hover:text-[#1db954] hover:bg-[#1db954]/10"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Projects Yet</h3>
                  <p className="text-gray-400 mb-4">
                    You don't have any projects assigned yet. Check out available work to get started.
                  </p>
                  <Button
                    onClick={() => setActiveTab('available')}
                    className="bg-[#1db954] hover:bg-[#1db954]/90 text-black font-medium"
                  >
                    Browse Available Work
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Available Work</h2>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {availableRequests.length > 0 ? (
              <div className="space-y-3">
                {availableRequests.map((request, index) => (
                  <Card
                    key={request.id}
                    className="bg-gray-900/50 border-gray-800 hover:bg-gray-800/50 transition-all cursor-pointer group"
                    onClick={() => navigate(`/modul8/service-request/${request.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#1db954] to-green-600 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-black font-bold text-sm">NEW</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate group-hover:text-[#1db954] transition-colors">
                            {request.title}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {request.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>{getDomainName(request.domain_page)}</span>
                          </div>
                          {formatBudgetRange(request.budget_range) && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatBudgetRange(request.budget_range)}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(request.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#1db954] hover:text-[#1db954] hover:bg-[#1db954]/10"
                        >
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Available Work</h3>
                  <p className="text-gray-400">
                    No new service requests match your specializations at the moment. Check back later!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifyLabr8Dashboard;
