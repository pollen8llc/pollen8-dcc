
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getUserServiceProvider, getServiceRequests } from '@/services/modul8Service';
import { ServiceProvider, ServiceRequest } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Briefcase, MessageSquare, CheckCircle, DollarSign, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

const Labr8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProviderData();
  }, [session?.user?.id]);

  const loadProviderData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const provider = await getUserServiceProvider(session.user.id);
      if (!provider) {
        navigate('/labr8/setup');
        return;
      }
      
      setServiceProvider(provider);
      
      // Load all service requests and filter by provider's specializations
      const allRequests = await getServiceRequests();
      const relevantRequests = allRequests.filter(request => 
        provider.domain_specializations.includes(request.domain_page)
      );
      setServiceRequests(relevantRequests);
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

  const getRequestsByStatus = (status: string) => {
    return serviceRequests.filter(request => {
      switch (status) {
        case 'available':
          return request.engagement_status === 'none' && request.status === 'pending';
        case 'negotiating':
          return request.engagement_status === 'negotiating';
        case 'active':
          return request.engagement_status === 'affiliated';
        default:
          return false;
      }
    });
  };

  const handleEngageRequest = (requestId: string) => {
    navigate(`/labr8/request/${requestId}`);
  };

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return 'Budget: TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `${currency} ${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Budget: TBD';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" text="Loading LAB-R8 Dashboard..." />
        </div>
      </div>
    );
  }

  if (!serviceProvider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Service Provider Profile Not Found</h1>
            <Button onClick={() => navigate('/labr8/setup')}>
              Create Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const availableRequests = getRequestsByStatus('available');
  const negotiatingRequests = getRequestsByStatus('negotiating');
  const activeRequests = getRequestsByStatus('active');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">LAB-R8 Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {serviceProvider.business_name}</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Requests</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableRequests.length}</div>
              <p className="text-xs text-muted-foreground">New opportunities</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Negotiation</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{negotiatingRequests.length}</div>
              <p className="text-xs text-muted-foreground">Active discussions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeRequests.length}</div>
              <p className="text-xs text-muted-foreground">Ongoing work</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">
              Available Requests ({availableRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              My Negotiations ({negotiatingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="projects">
              Active Projects ({activeRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {availableRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No available requests
                  </h3>
                  <p className="text-muted-foreground text-center">
                    New service requests from organizers matching your specializations will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
                        <Badge variant="secondary">New</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {request.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {request.description}
                        </p>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{formatBudget(request.budget_range)}</span>
                        </div>
                        
                        {request.timeline && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{request.timeline}</span>
                          </div>
                        )}
                        
                        {request.organizer && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{request.organizer.organization_name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button 
                          className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                          onClick={() => handleEngageRequest(request.id)}
                        >
                          Engage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {negotiatingRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No active negotiations
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Requests you've engaged with will appear here for negotiation
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {negotiatingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
                          <p className="text-muted-foreground mb-4">{request.description}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{formatBudget(request.budget_range)}</span>
                            {request.timeline && <span>Timeline: {request.timeline}</span>}
                          </div>
                        </div>
                        <Button onClick={() => handleEngageRequest(request.id)}>
                          Continue Negotiation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            {activeRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No active projects
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Agreed partnerships and active projects will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
                          <p className="text-muted-foreground mb-4">{request.description}</p>
                          <Badge className="bg-green-100 text-green-800">Active Project</Badge>
                        </div>
                        <Button onClick={() => handleEngageRequest(request.id)}>
                          View Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
