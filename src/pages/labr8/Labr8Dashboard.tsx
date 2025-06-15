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
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Labr8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [assignedRequests, setAssignedRequests] = useState<ServiceRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviderData();
  }, [session?.user?.id]);

  const loadProviderData = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      
      const provider = await getUserServiceProvider(session.user.id);
      if (!provider) {
        navigate('/labr8/setup');
        return;
      }
      setServiceProvider(provider);

      // Load assigned requests (requests sent to this provider)
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
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'negotiating': return 'bg-orange-100 text-orange-800';
      case 'agreed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewRequest = (request: ServiceRequest) => {
    navigate(`/labr8/${request.id}/status`);
  };

  const handleLogout = async () => {
    try {
      const { session } = useSession();
      if (session) {
        await session.logout();
        navigate('/labr8');
        toast({
          title: "Logged out",
          description: "You have been successfully logged out",
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  // Categorize requests
  const pendingRequests = incomingRequests.filter(r => r.status === 'pending');
  const negotiatingRequests = assignedRequests.filter(r => r.status === 'negotiating');
  const activeProjects = assignedRequests.filter(r => ['agreed', 'in_progress'].includes(r.status));
  const completedProjects = assignedRequests.filter(r => r.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
          </div>
        </div>
      </div>
    );
  }

  const RequestCard = ({ request }: { request: ServiceRequest }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold line-clamp-1">{request.title}</h3>
              <Badge className={`${getStatusColor(request.status)} font-medium`}>
                {request.status?.replace('_', ' ') || 'pending'}
              </Badge>
            </div>
            
            {request.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {request.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              {request.organizer && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={request.organizer.logo_url} />
                    <AvatarFallback>
                      <Building className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="line-clamp-1">{request.organizer.organization_name}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatBudget(request.budget_range)}
              </div>
              {request.timeline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {request.timeline}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Received {new Date(request.created_at).toLocaleDateString()}
          </span>
          <Button
            onClick={() => handleViewRequest(request)}
            size="sm"
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
          >
            View Request
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-[#00eada] flex items-center justify-center">
                <Building2 className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">LAB-R8 Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {serviceProvider?.business_name}
                </p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Requests</p>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Discussion</p>
                  <p className="text-2xl font-bold">{negotiatingRequests.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">{activeProjects.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedProjects.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Tabs */}
        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="incoming">
              Incoming ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="discussing">
              Discussing ({negotiatingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="mt-6">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Incoming Requests
                  </h3>
                  <p className="text-muted-foreground text-center">
                    New service requests will appear here when organizers reach out to you.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="discussing" className="mt-6">
            {negotiatingRequests.length === 0 ? (
              <Card>
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
              <Card>
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
              <Card>
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
      </div>
    </div>
  );
};

export default Labr8Dashboard;
