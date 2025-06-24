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

const Labr8Dashboard = () => {
  const { session, logout } = useSession();
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
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'negotiating': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'agreed': return 'bg-green-50 text-green-700 border-green-200';
      case 'declined': return 'bg-red-50 text-red-700 border-red-200';
      case 'in_progress': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleViewRequest = (request: ServiceRequest) => {
    // Navigate to the new proposal card thread view
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
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00eada]"></div>
          </div>
        </div>
      </div>
    );
  }

  const RequestCard = ({ request }: { request: ServiceRequest }) => (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#00eada] bg-gradient-to-r from-white to-gray-50/50">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{request.title}</h3>
              <Badge className={`${getStatusColor(request.status)} font-semibold border px-3 py-1`}>
                {request.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
              </Badge>
            </div>
            
            {request.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                {request.description}
              </p>
            )}
            
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              {request.organizer && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={request.organizer.logo_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Building className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium line-clamp-1">{request.organizer.organization_name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">{formatBudget(request.budget_range)}</span>
              </div>
              {request.timeline && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>{request.timeline}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Received {new Date(request.created_at).toLocaleDateString()}
          </span>
          <Button
            onClick={() => handleViewRequest(request)}
            size="sm"
            className="bg-[#00eada] hover:bg-[#00eada]/90 text-black font-semibold rounded-lg px-4 py-2 transition-all duration-200 hover:shadow-md"
          >
            <Eye className="h-4 w-4 mr-2" />
            {request.status === 'pending' ? 'View & Respond' : 
             request.status === 'negotiating' ? 'Continue Discussion' :
             request.status === 'agreed' ? 'View Agreement' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#00eada] to-[#00c7b8] flex items-center justify-center shadow-lg">
                <Building2 className="h-8 w-8 text-black" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">LAB-R8 Dashboard</h1>
                <p className="text-lg text-gray-600 font-medium">
                  Welcome back, <span className="text-[#00eada] font-bold">{serviceProvider?.business_name}</span>
                </p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:border-[#00eada] hover:text-[#00eada] transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">New Requests</p>
                  <p className="text-3xl font-black text-blue-900">{pendingRequests.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-200 flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 mb-1">In Discussion</p>
                  <p className="text-3xl font-black text-orange-900">{negotiatingRequests.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-orange-200 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Active Projects</p>
                  <p className="text-3xl font-black text-purple-900">{activeProjects.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-purple-200 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Completed</p>
                  <p className="text-3xl font-black text-green-900">{completedProjects.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-200 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Tabs */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-8">
            <Tabs defaultValue="incoming" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="incoming" className="rounded-lg font-semibold">
                  New Requests ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="discussing" className="rounded-lg font-semibold">
                  Discussing ({negotiatingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="active" className="rounded-lg font-semibold">
                  Active ({activeProjects.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="rounded-lg font-semibold">
                  Completed ({completedProjects.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="incoming" className="mt-6">
                {pendingRequests.length === 0 ? (
                  <Card className="border-dashed border-2 border-gray-300">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <ExternalLink className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-xl font-bold text-gray-500 mb-2">
                        No New Requests
                      </h3>
                      <p className="text-gray-400 text-center max-w-md">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Labr8Dashboard;
