
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import RequestCard from '@/components/labr8/RequestCard';

const EnhancedLabr8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [assignedRequests, setAssignedRequests] = useState<ServiceRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [session?.user?.id]);

  const loadDashboardData = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      console.log('Loading dashboard data for user:', session.user.id);
      
      const provider = await getUserServiceProvider(session.user.id);
      console.log('Service provider found:', provider);
      
      if (!provider) {
        console.log('No service provider found, redirecting to setup');
        navigate('/labr8/setup');
        return;
      }
      setServiceProvider(provider);

      // Get requests assigned to this provider
      console.log('Fetching assigned requests for provider:', provider.id);
      const assigned = await getProviderServiceRequests(provider.id);
      console.log('Assigned requests:', assigned);
      setAssignedRequests(assigned);

      // Get available requests for this provider (based on domain specializations)
      console.log('Fetching available requests for provider:', provider.id);
      const available = await getAvailableServiceRequestsForProvider(provider.id);
      console.log('Available requests:', available);
      setIncomingRequests(available);
      
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

  const handleRequestDeleted = () => {
    // Reload the dashboard data after deletion
    loadDashboardData();
  };

  // Categorize requests more carefully
  const pendingRequests = incomingRequests.filter(r => r.status === 'pending');
  const negotiatingRequests = assignedRequests.filter(r => r.status === 'negotiating');
  const activeProjects = assignedRequests.filter(r => ['agreed', 'in_progress'].includes(r.status));
  const completedProjects = assignedRequests.filter(r => r.status === 'completed');

  console.log('Request categories:', {
    pending: pendingRequests.length,
    negotiating: negotiatingRequests.length,
    active: activeProjects.length,
    completed: completedProjects.length
  });

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
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
        </div>

        {/* Debug Info - Remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-gray-100 rounded">
            <p className="text-sm">Debug Info:</p>
            <p className="text-xs">Provider ID: {serviceProvider?.id}</p>
            <p className="text-xs">Domain Specializations: {serviceProvider?.domain_specializations?.join(', ') || 'None'}</p>
            <p className="text-xs">Total Assigned: {assignedRequests.length}</p>
            <p className="text-xs">Total Available: {incomingRequests.length}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Incoming Requests</p>
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
                  {serviceProvider?.domain_specializations?.length === 0 && (
                    <p className="text-sm text-orange-600 mt-2">
                      Consider adding domain specializations to your profile to receive relevant requests.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    type="incoming" 
                    onDelete={handleRequestDeleted}
                  />
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
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    type="incoming" 
                    onDelete={handleRequestDeleted}
                  />
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
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    type="active" 
                    onDelete={handleRequestDeleted}
                  />
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
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    type="completed" 
                    onDelete={handleRequestDeleted}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedLabr8Dashboard;
