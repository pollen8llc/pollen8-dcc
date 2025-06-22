
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/useSession';
import { getUserServiceProvider, getProviderServiceRequests, getAvailableServiceRequestsForProvider } from '@/services/modul8Service';
import { ServiceRequest, ServiceProvider } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  DollarSign, 
  Building,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';

const ProviderInbox = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [activeRequests, setActiveRequests] = useState<ServiceRequest[]>([]);
  const [availableRequests, setAvailableRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInboxData = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        
        // Get service provider profile
        const provider = await getUserServiceProvider(session.user.id);
        if (!provider) {
          toast({
            title: "Provider Profile Required",
            description: "Please complete your service provider setup first",
            variant: "destructive"
          });
          navigate('/labr8/setup');
          return;
        }
        setServiceProvider(provider);

        // Load assigned requests for this provider
        const myRequests = await getProviderServiceRequests(provider.id);
        setActiveRequests(myRequests);

        // Load available requests from the marketplace
        const marketRequests = await getAvailableServiceRequestsForProvider(provider.id);
        setAvailableRequests(marketRequests);

      } catch (error) {
        console.error('Error loading inbox data:', error);
        toast({
          title: "Error",
          description: "Failed to load inbox data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadInboxData();
  }, [session?.user?.id, navigate]);

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
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'agreed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewRequest = (request: ServiceRequest) => {
    if (request.service_provider_id) {
      navigate(`/labr8/${request.service_provider_id}/${request.id}/status`);
    } else {
      navigate(`/labr8/request/${request.id}/status`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!serviceProvider) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Service Provider Profile Required</h3>
          <p className="text-muted-foreground text-center mb-4">
            You need to complete your service provider setup to access the inbox.
          </p>
          <Button onClick={() => navigate('/labr8/setup')}>
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Provider Inbox</h1>
        <Badge variant="outline" className="text-sm">
          {serviceProvider.business_name}
        </Badge>
      </div>

      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assigned">
            My Projects ({activeRequests.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available Requests ({availableRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="space-y-4">
          {activeRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Projects</h3>
                <p className="text-muted-foreground text-center">
                  You don't have any assigned projects yet. Check the available requests to find new opportunities.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
                        {request.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {request.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {request.organizer && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span>{request.organizer.organization_name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatBudget(request.budget_range)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${getStatusColor(request.status)} font-medium flex items-center gap-1`}>
                          {getStatusIcon(request.status)}
                          {request.status?.replace('_', ' ') || 'pending'}
                        </Badge>
                        <Button
                          onClick={() => handleViewRequest(request)}
                          size="sm"
                          className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Project
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          {availableRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Available Requests</h3>
                <p className="text-muted-foreground text-center">
                  There are no available service requests in the marketplace at the moment.
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
                        {request.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {request.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {request.organizer && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span>{request.organizer.organization_name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatBudget(request.budget_range)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge className="bg-blue-100 text-blue-800 font-medium">
                          <Clock className="h-4 w-4 mr-1" />
                          Open
                        </Badge>
                        <Button
                          onClick={() => handleViewRequest(request)}
                          size="sm"
                          className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View & Respond
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderInbox;
