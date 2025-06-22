
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { useNavigate } from 'react-router-dom';
import { getUserOrganizer, getOrganizerServiceRequests } from '@/services/modul8Service';
import { Organizer, ServiceRequest } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import ServiceRequestCard from '@/components/modul8/ServiceRequestCard';

const ModernModul8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizerData();
  }, [session?.user?.id]);

  const loadOrganizerData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const organizerData = await getUserOrganizer(session.user.id);
      if (!organizerData) {
        navigate('/modul8/setup/organizer');
        return;
      }
      
      setOrganizer(organizerData);
      const requests = await getOrganizerServiceRequests(organizerData.id);
      setServiceRequests(Array.isArray(requests) ? requests : []);
    } catch (error) {
      console.error('Error loading organizer data:', error);
      setServiceRequests([]);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = (filter: string) => {
    switch (filter) {
      case 'active':
        return serviceRequests.filter(r => ['negotiating', 'agreed', 'in_progress'].includes(r.status));
      case 'pending':
        return serviceRequests.filter(r => r.status === 'pending');
      case 'completed':
        return serviceRequests.filter(r => r.status === 'completed');
      default:
        return serviceRequests;
    }
  };

  const getStatusCounts = () => {
    return {
      total: serviceRequests.length,
      pending: serviceRequests.filter(r => r.status === 'pending').length,
      active: serviceRequests.filter(r => ['negotiating', 'agreed', 'in_progress'].includes(r.status)).length,
      completed: serviceRequests.filter(r => r.status === 'completed').length
    };
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-[#00eada] flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Modul8 Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Welcome back, <span className="font-semibold">{organizer?.organization_name}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/modul8/directory')}
              variant="outline"
              className="border-[#00eada] text-[#00eada] hover:bg-[#00eada]/10"
            >
              <Users className="h-4 w-4 mr-2" />
              Browse Providers
            </Button>
            <Button 
              onClick={() => navigate('/modul8/request')}
              className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{statusCounts.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{statusCounts.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{statusCounts.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{statusCounts.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Management */}
        <Card>
          <CardHeader>
            <CardTitle>Project Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All ({statusCounts.total})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
                <TabsTrigger value="active">Active ({statusCounts.active})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({statusCounts.completed})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {serviceRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by creating your first service request
                    </p>
                    <Button 
                      onClick={() => navigate('/modul8/request')}
                      className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Request
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceRequests.map((request) => (
                      <ServiceRequestCard
                        key={request.id}
                        request={request}
                        onUpdate={loadOrganizerData}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredRequests('pending').map((request) => (
                    <ServiceRequestCard
                      key={request.id}
                      request={request}
                      onUpdate={loadOrganizerData}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="active" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredRequests('active').map((request) => (
                    <ServiceRequestCard
                      key={request.id}
                      request={request}
                      onUpdate={loadOrganizerData}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getFilteredRequests('completed').map((request) => (
                    <ServiceRequestCard
                      key={request.id}
                      request={request}
                      onUpdate={loadOrganizerData}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernModul8Dashboard;
