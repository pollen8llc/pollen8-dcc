import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { 
  getUserServiceProvider,
  getProviderServiceRequests,
  getAvailableServiceRequestsForProvider 
} from '@/services/modul8Service';
import { ServiceProvider, ServiceRequest } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Building,
  DollarSign,
  Calendar,
  LogOut,
  MessageSquare,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { UserRole } from '@/models/types';
import { useModuleCompletion } from '@/hooks/useModuleCompletion';

const Labr8Dashboard = () => {
  const { session, logout } = useSession();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [assignedRequests, setAssignedRequests] = useState<ServiceRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { labr8_complete, loading: completionLoading } = useModuleCompletion();

  useEffect(() => {
    loadProviderData();
  }, [session?.user?.id, completionLoading, labr8_complete]);

  const loadProviderData = async () => {
    if (!session?.user?.id) return;
    
    // Check LABR8 setup status - admins can bypass setup
    if (!completionLoading && labr8_complete === false && 
        currentUser?.role !== UserRole.ADMIN && (currentUser?.role as string) !== 'ADMIN') {
      navigate('/labr8/setup');
      return;
    }
    
    if (completionLoading || labr8_complete === null) {
      return;
    }

    try {
      setLoading(true);
      
      const provider = await getUserServiceProvider(session.user.id);
      if (!provider) {
        // If no provider found but setup is marked complete, redirect to setup to fix inconsistency
        navigate('/labr8/setup');
        return;
      }
      setServiceProvider(provider);

      // Load assigned requests - ALL requests where this provider is assigned
      const assigned = await getProviderServiceRequests(provider.id);
      setAssignedRequests(assigned);

      // Load available requests (new incoming requests)
      const available = await getAvailableServiceRequestsForProvider(provider.id);
      setIncomingRequests(available);
      
    } catch (error) {
      console.error('Error loading provider data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return 'Budget TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Budget TBD';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'assigned': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'negotiating': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'agreed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'declined': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in_progress': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleViewRequest = (request: ServiceRequest) => {
    navigate(`/labr8/dashboard/request/${request.id}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/labr8');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  // Enhanced categorization logic for requests
  const pendingRequests = [
    ...incomingRequests.filter(r => r.status === 'pending'),
    ...assignedRequests.filter(r => ['assigned', 'pending'].includes(r.status))
  ];
  
  const negotiatingRequests = assignedRequests.filter(r => r.status === 'negotiating');
  
  // Include both 'agreed' and 'in_progress' in active projects
  const activeProjects = assignedRequests.filter(r => ['agreed', 'in_progress'].includes(r.status));
  
  const completedProjects = assignedRequests.filter(r => r.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  const RequestCard = ({ request }: { request: ServiceRequest }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <h3 className="text-base sm:text-lg font-bold text-foreground line-clamp-1">{request.title}</h3>
              <Badge className={`${getStatusColor(request.status)} font-semibold border px-2 sm:px-3 py-1 text-xs sm:text-sm self-start`}>
                {request.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
              </Badge>
            </div>
            
            {request.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {request.description}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-muted-foreground mb-4">
              {request.organizer && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                    <AvatarImage src={request.organizer.logo_url} />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      <Building className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium line-clamp-1 text-xs sm:text-sm">{request.organizer.organization_name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="font-medium text-xs sm:text-sm">{formatBudget(request.budget_range)}</span>
              </div>
              {request.timeline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                  <span className="text-xs sm:text-sm">{request.timeline}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Received {new Date(request.created_at).toLocaleDateString()}
          </span>
          <Button
            onClick={() => handleViewRequest(request)}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm w-full sm:w-auto"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            {request.status === 'pending' || request.status === 'assigned' ? 'View & Respond' : 
             request.status === 'negotiating' ? 'Continue Discussion' :
             request.status === 'agreed' ? 'View Agreement' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">LAB-R8 Dashboard</h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium">
                  Welcome back, <span className="text-primary font-bold">{serviceProvider?.business_name}</span>
                </p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-border hover:border-primary hover:text-primary transition-all duration-200 self-start sm:self-auto"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
          <Card className="border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg transition-all">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">New Requests</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground">{pendingRequests.length}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg sm:rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg transition-all">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">In Discussion</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground">{negotiatingRequests.length}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg sm:rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg transition-all">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Active Projects</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground">{activeProjects.length}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg sm:rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg transition-all">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Completed</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-foreground">{completedProjects.length}</p>
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg sm:rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Tabs */}
        <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <Tabs defaultValue="incoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8 bg-muted/20 p-1 rounded-xl overflow-hidden">
                <TabsTrigger value="incoming" className="rounded-lg font-semibold text-xs sm:text-sm">
                  <span className="hidden sm:inline">New Requests </span>
                  <span className="sm:hidden">New </span>
                  ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="discussing" className="rounded-lg font-semibold text-xs sm:text-sm">
                  <span className="hidden sm:inline">Discussing </span>
                  <span className="sm:hidden">Talk </span>
                  ({negotiatingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="rounded-lg font-semibold text-xs sm:text-sm">
                  Active ({activeProjects.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-lg font-semibold text-xs sm:text-sm">
                  <span className="hidden sm:inline">Completed </span>
                  <span className="sm:hidden">Done </span>
                  ({completedProjects.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="incoming" className="mt-6">
                {pendingRequests.length === 0 ? (
                  <Card className="border-dashed border-2 border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <ExternalLink className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-bold text-muted-foreground mb-2">
                        No New Requests
                      </h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        New service requests from organizers will appear here when they reach out to you.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {pendingRequests.map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="discussing" className="mt-6">
                {negotiatingRequests.length === 0 ? (
                  <Card className="border-dashed border-2 border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                        No Active Discussions
                      </h3>
                      <p className="text-muted-foreground text-center">
                        Requests you're negotiating will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {negotiatingRequests.map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="active" className="mt-6">
                {activeProjects.length === 0 ? (
                  <Card className="border-dashed border-2 border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                        No Active Projects
                      </h3>
                      <p className="text-muted-foreground text-center">
                        Accepted projects that are in progress will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {activeProjects.map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                {completedProjects.length === 0 ? (
                  <Card className="border-dashed border-2 border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                        No Completed Projects
                      </h3>
                      <p className="text-muted-foreground text-center">
                        Successfully completed projects will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {completedProjects.map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Labr8Dashboard;
