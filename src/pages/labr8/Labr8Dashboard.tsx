
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { useLabr8Dashboard } from '@/hooks/useLabr8Dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Inbox, 
  MessageSquare, 
  CheckCircle, 
  Clock,
  Building2,
  User,
  DollarSign,
  Calendar
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/labr8/StatsCard';
import { formatDistanceToNow } from 'date-fns';

const Labr8Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [activeTab, setActiveTab] = useState('pending');
  
  const {
    loading,
    error,
    serviceProvider,
    pendingRequests,
    negotiatingRequests,
    activeProjects,
    completedProjects,
    reload
  } = useLabr8Dashboard(session?.user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'negotiating':
      case 'assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'agreed':
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRequestClick = (requestId: string) => {
    navigate(`/labr8/dashboard/request/${requestId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00eada]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={reload}>Try Again</Button>
          </div>
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
            <h1 className="text-2xl font-bold mb-4">Setup Required</h1>
            <p className="text-muted-foreground mb-4">
              Please complete your service provider profile to access your dashboard.
            </p>
            <Button onClick={() => navigate('/labr8/setup')}>
              Complete Setup
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">LAB-R8 Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {serviceProvider.business_name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Pending Requests"
            value={pendingRequests.length}
            icon={<Inbox className="h-5 w-5 text-[#00eada]" />}
            accentColor="bg-[#00eada]/20"
          />
          <StatsCard
            label="Negotiating"
            value={negotiatingRequests.length}
            icon={<MessageSquare className="h-5 w-5 text-blue-600" />}
            accentColor="bg-blue-600/20"
          />
          <StatsCard
            label="Active Projects"
            value={activeProjects.length}
            icon={<Clock className="h-5 w-5 text-purple-600" />}
            accentColor="bg-purple-600/20"
          />
          <StatsCard
            label="Completed"
            value={completedProjects.length}
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
            accentColor="bg-green-600/20"
          />
        </div>

        {/* Request Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="negotiating" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Negotiating ({negotiatingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Active ({activeProjects.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed ({completedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Pending Requests
                  </h3>
                  <p className="text-muted-foreground text-center">
                    New service requests will appear here when available.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingRequests.map((request) => (
                  <Card 
                    key={request.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleRequestClick(request.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <Badge className={`${getStatusColor(request.status)} border text-xs`}>
                          {request.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {request.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {request.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {request.organizer && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{request.organizer.organization_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                      
                      {request.budget_range?.min && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>
                            ${request.budget_range.min.toLocaleString()}
                            {request.budget_range.max && 
                              ` - $${request.budget_range.max.toLocaleString()}`
                            }
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="negotiating" className="mt-6">
            {negotiatingRequests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Active Negotiations
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Projects you're negotiating will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {negotiatingRequests.map((request) => (
                  <Card 
                    key={request.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleRequestClick(request.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <Badge className={`${getStatusColor(request.status)} border text-xs`}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {request.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {request.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {request.organizer && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{request.organizer.organization_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                    Projects in progress will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeProjects.map((request) => (
                  <Card 
                    key={request.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleRequestClick(request.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <Badge className={`${getStatusColor(request.status)} border text-xs`}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {request.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {request.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {request.organizer && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{request.organizer.organization_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                      
                      {request.project_progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{request.project_progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#00eada] h-2 rounded-full" 
                              style={{ width: `${request.project_progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedProjects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Completed Projects
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Completed projects will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedProjects.map((request) => (
                  <Card 
                    key={request.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleRequestClick(request.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{request.title}</CardTitle>
                        <Badge className={`${getStatusColor(request.status)} border text-xs`}>
                          COMPLETED
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {request.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {request.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {request.organizer && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>{request.organizer.organization_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
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
    </div>
  );
};

export default Labr8Dashboard;
