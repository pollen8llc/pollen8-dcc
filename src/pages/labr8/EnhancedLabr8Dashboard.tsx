
import React from "react";
import { useSession } from "@/hooks/useSession";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatsCard from "@/components/labr8/StatsCard";
import RequestList from "@/components/labr8/RequestList";
import ActivityFeed from "@/components/labr8/ActivityFeed";
import { Labr8Navigation } from "@/components/labr8/Labr8Navigation";
import { 
  Building2, 
  ExternalLink, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Calendar,
  MessageSquare,
  FileText,
  Zap,
  Award,
  Target
} from "lucide-react";
import { useLabr8Dashboard } from "@/hooks/useLabr8Dashboard";
import { toast } from "@/hooks/use-toast";

const EnhancedLabr8Dashboard: React.FC = () => {
  const { session, logout } = useSession();
  const {
    loading,
    error,
    serviceProvider,
    pendingRequests,
    negotiatingRequests,
    activeProjects,
    completedProjects,
    reload,
  } = useLabr8Dashboard(session?.user?.id);

  React.useEffect(() => {
    if (error)
      toast({
        title: "Error loading data",
        description: error,
        variant: "destructive",
      });
  }, [error]);

  // Mock data for enhanced features
  const financialData = {
    monthlyRevenue: 15750,
    yearlyRevenue: 189000,
    pendingPayments: 4200,
    averageProjectValue: 3500
  };

  const performanceData = {
    clientSatisfaction: 4.8,
    responseTime: "2.3 hrs",
    completionRate: 94,
    repeatClients: 78
  };

  const recentClients = [
    { id: 1, name: "Tech Startup Inc.", avatar: "", lastProject: "Web Development", status: "Active" },
    { id: 2, name: "Marketing Agency", avatar: "", lastProject: "Brand Design", status: "Completed" },
    { id: 3, name: "E-commerce Co.", avatar: "", lastProject: "Mobile App", status: "In Progress" }
  ];

  const upcomingDeadlines = [
    { project: "Website Redesign", client: "Tech Startup Inc.", dueDate: "Tomorrow", priority: "high" },
    { project: "Logo Design", client: "Marketing Agency", dueDate: "In 3 days", priority: "medium" },
    { project: "App Testing", client: "E-commerce Co.", dueDate: "Next week", priority: "low" }
  ];

  const displayName = serviceProvider?.business_name || "Loading...";

  return (
    <div className="min-h-screen bg-gray-50">
      <Labr8Navigation notificationCount={8} unreadMessages={3} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={serviceProvider?.logo_url} />
              <AvatarFallback className="bg-[#00eada] text-black text-lg font-bold">
                {displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
              <p className="text-lg text-muted-foreground">{displayName}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">{performanceData.clientSatisfaction}</span>
                <span className="text-sm text-muted-foreground">({performanceData.repeatClients}% repeat clients)</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              View Calendar
            </Button>
            <Button className="bg-[#00eada] hover:bg-[#00eada]/90 text-black flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </Button>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Monthly Revenue"
            value={`$${financialData.monthlyRevenue.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-green-600" />}
            accentColor="bg-green-100"
            change="+12%"
          />
          <StatsCard
            label="Pending Payments"
            value={`$${financialData.pendingPayments.toLocaleString()}`}
            icon={<Clock className="h-6 w-6 text-orange-600" />}
            accentColor="bg-orange-100"
          />
          <StatsCard
            label="Active Projects"
            value={activeProjects.length}
            icon={<Target className="h-6 w-6 text-blue-600" />}
            accentColor="bg-blue-100"
          />
          <StatsCard
            label="Completion Rate"
            value={`${performanceData.completionRate}%`}
            icon={<Award className="h-6 w-6 text-purple-600" />}
            accentColor="bg-purple-100"
            change="+2%"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Requests & Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="requests" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="requests">New Requests ({pendingRequests.length})</TabsTrigger>
                    <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="requests" className="mt-4">
                    <RequestList
                      type="incoming"
                      requests={pendingRequests.slice(0, 5)}
                      loading={loading}
                      emptyLabel="No new requests"
                      onDelete={reload}
                    />
                  </TabsContent>
                  
                  <TabsContent value="active" className="mt-4">
                    <RequestList
                      type="active"
                      requests={activeProjects.slice(0, 5)}
                      loading={loading}
                      emptyLabel="No active projects"
                      onDelete={reload}
                    />
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-4">
                    <RequestList
                      type="completed"
                      requests={completedProjects.slice(0, 5)}
                      loading={loading}
                      emptyLabel="No completed projects"
                      onDelete={reload}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className="font-medium">{performanceData.responseTime}</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Client Satisfaction</span>
                    <span className="font-medium">{performanceData.clientSatisfaction}/5.0</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Project Completion</span>
                    <span className="font-medium">{performanceData.completionRate}%</span>
                  </div>
                  <Progress value={performanceData.completionRate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recent Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentClients.map((client) => (
                    <div key={client.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {client.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.lastProject}</p>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        client.status === 'Active' ? 'bg-green-100 text-green-700' :
                        client.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {client.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        deadline.priority === 'high' ? 'bg-red-500' :
                        deadline.priority === 'medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{deadline.project}</p>
                        <p className="text-xs text-muted-foreground">{deadline.client}</p>
                        <p className="text-xs text-muted-foreground">{deadline.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedLabr8Dashboard;
