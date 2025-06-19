import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { useNavigate } from 'react-router-dom';
import { 
  getUserServiceProvider,
  getProviderServiceRequests,
  getAvailableServiceRequestsForProvider,
  updateServiceRequest
} from '@/services/modul8Service';
import { ServiceProvider, ServiceRequest } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Building2, 
  Search,
  Filter,
  Building,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  UserX
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const GridLabr8Dashboard = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [allRequests, setAllRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    checkAccessAndLoadData();
  }, [session?.user?.id]);

  useEffect(() => {
    filterRequests();
  }, [allRequests, searchTerm, statusFilter]);

  const checkAccessAndLoadData = async () => {
    if (!session?.user?.id) {
      navigate('/labr8/auth');
      return;
    }

    try {
      setLoading(true);
      const provider = await getUserServiceProvider(session.user.id);
      
      // Only allow service providers to access this dashboard
      if (!provider) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      
      setServiceProvider(provider);
      setAccessDenied(false);

      // Get both assigned and available requests
      const [assigned, available] = await Promise.all([
        getProviderServiceRequests(provider.id),
        getAvailableServiceRequestsForProvider(provider.id)
      ]);

      // Combine and deduplicate requests
      const combinedRequests = [...assigned, ...available];
      const uniqueRequests = combinedRequests.filter((request, index, self) => 
        index === self.findIndex(r => r.id === request.id)
      );

      setAllRequests(uniqueRequests);
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

  const filterRequests = () => {
    let filtered = allRequests;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.organizer?.organization_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'pending' | 'negotiating' | 'agreed' | 'in_progress' | 'completed' | 'declined') => {
    try {
      await updateServiceRequest(requestId, { status: newStatus });
      toast({
        title: "Status Updated",
        description: `Request status updated to ${newStatus}`,
      });
      checkAccessAndLoadData(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await updateServiceRequest(requestId, { status: 'declined' });
      toast({
        title: "Request Rejected",
        description: "The request has been removed from your dashboard",
      });
      checkAccessAndLoadData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive"
      });
    }
  };

  const handleViewRequest = (request: ServiceRequest) => {
    navigate(`/labr8/${serviceProvider?.id}/${request.id}/status`);
  };

  const formatBudget = (budget: any) => {
    if (!budget || typeof budget !== 'object') return 'Budget TBD';
    const { min, max, currency = 'USD' } = budget;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    }
    return 'Budget TBD';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'negotiating': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'agreed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'declined': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'negotiating': return <Clock className="h-4 w-4" />;
      case 'agreed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Building className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
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

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UserX className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground text-center mb-6">
                This dashboard is only available to registered service providers.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/labr8/setup')}>
                  Set Up Provider Profile
                </Button>
                <Button variant="outline" onClick={() => navigate('/labr8')}>
                  Back to LAB-R8
                </Button>
              </div>
            </CardContent>
          </Card>
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
          <div className="flex items-center gap-4 mb-6">
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

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests by title, description, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="negotiating">Negotiating</SelectItem>
                  <SelectItem value="agreed">Agreed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredRequests.length} of {allRequests.length} requests
          </div>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Requests Found
              </h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || statusFilter !== 'all' 
                  ? "Try adjusting your search or filters" 
                  : "New service requests will appear here"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2">{request.title}</CardTitle>
                    <Badge className={`${getStatusColor(request.status)} border font-medium ml-2`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">
                        {request.status?.replace('_', ' ')}
                      </span>
                    </Badge>
                  </div>
                  
                  {request.organizer && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={request.organizer.logo_url} />
                        <AvatarFallback>
                          <Building className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="line-clamp-1">{request.organizer.organization_name}</span>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  {request.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {request.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      {formatBudget(request.budget_range)}
                    </div>
                    {request.timeline && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {request.timeline}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewRequest(request)}
                        size="sm"
                        className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                      >
                        View Details
                      </Button>
                      {request.status === 'pending' && (
                        <Button
                          onClick={() => handleRejectRequest(request.id)}
                          variant="outline"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Status Update Dropdown */}
                    {request.status !== 'completed' && request.status !== 'declined' && (
                      <Select onValueChange={(value) => handleStatusUpdate(request.id, value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="negotiating">Start Negotiating</SelectItem>
                          <SelectItem value="agreed">Accept Request</SelectItem>
                          <SelectItem value="in_progress">Mark In Progress</SelectItem>
                          <SelectItem value="completed">Mark Completed</SelectItem>
                          <SelectItem value="declined">Decline</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground mt-3">
                    Received {new Date(request.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GridLabr8Dashboard;
