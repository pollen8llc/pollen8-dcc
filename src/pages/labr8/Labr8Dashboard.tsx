import React, { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Clock, 
  DollarSign, 
  User, 
  ExternalLink,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Labr8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [assignedRequests, setAssignedRequests] = useState<ServiceRequest[]>([]);
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [session?.user?.id]);

  const loadDashboardData = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      
      // Get service provider data
      const provider = await getUserServiceProvider(session.user.id);
      if (!provider) {
        navigate('/labr8/setup');
        return;
      }
      setServiceProvider(provider);

      // Load assigned requests
      const assigned = await getProviderServiceRequests(provider.id);
      setAssignedRequests(assigned);

      // Load available requests in provider's domains
      const available = await getAvailableServiceRequestsForProvider(provider.id);
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

  const formatBudget = (budgetRange: any) => {
    if (!budgetRange || typeof budgetRange !== 'object') return 'Budget TBD';
    const { min, max, currency = 'USD' } = budgetRange;
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
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">
                    {assignedRequests.filter(r => r.status === 'assigned' || r.status === 'in_progress').length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {assignedRequests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Work</p>
                  <p className="text-2xl font-bold">{availableRequests.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-[#00eada]/20 flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-[#00eada]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Tabs */}
        <Tabs defaultValue="assigned" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assigned">My Projects ({assignedRequests.length})</TabsTrigger>
            <TabsTrigger value="available">Available Work ({availableRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="assigned" className="mt-6">
            {assignedRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Assigned Projects
                  </h3>
                  <p className="text-muted-foreground text-center">
                    You don't have any assigned projects yet. Check the available work tab to find new opportunities.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {assignedRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {request.organizer?.organization_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatBudget(request.budget_range)}
                            </div>
                            {request.timeline && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {request.timeline}
                              </div>
                            )}
                          </div>
                          {request.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {request.description}
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(request.status || 'pending')}>
                          {request.status?.replace('_', ' ') || 'pending'}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          onClick={() => navigate(`/labr8/request/${request.id}`)}
                          size="sm"
                          className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                        >
                          View Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            {availableRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Available Work
                  </h3>
                  <p className="text-muted-foreground text-center">
                    There are no available service requests in your specialization areas at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {availableRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {request.organizer?.organization_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatBudget(request.budget_range)}
                            </div>
                            {request.timeline && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {request.timeline}
                              </div>
                            )}
                          </div>
                          {request.description && (
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {request.description}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">Available</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Posted {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        <Button
                          onClick={() => navigate(`/labr8/request/${request.id}`)}
                          size="sm"
                          variant="outline"
                        >
                          View Details
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
