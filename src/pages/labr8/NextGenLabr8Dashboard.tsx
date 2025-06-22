
import React from "react";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { UnifiedHeader } from "@/components/shared/UnifiedHeader";
import { EnhancedStatsCard } from "@/components/shared/EnhancedStatsCard";
import { useLabr8Dashboard } from "@/hooks/useLabr8Dashboard";
import { toast } from "@/hooks/use-toast";
import {
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Calendar,
  Star,
  ArrowRight,
  Activity,
  Target,
  Award,
  Zap
} from "lucide-react";

const NextGenLabr8Dashboard: React.FC = () => {
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

  // Mock enhanced data for demonstration
  const enhancedData = {
    financial: {
      monthlyRevenue: 24750,
      yearlyRevenue: 289000,
      pendingPayments: 8400,
      projectedRevenue: 32000
    },
    performance: {
      clientSatisfaction: 4.9,
      responseTime: "1.8 hrs",
      completionRate: 96,
      repeatClients: 82
    },
    insights: [
      { title: "Peak Request Hours", value: "2-4 PM", trend: "up" },
      { title: "Avg Project Value", value: "$4,200", trend: "up" },
      { title: "Client Retention", value: "94%", trend: "up" }
    ]
  };

  const recentActivity = [
    { type: "new_request", title: "Web Development Project", client: "Tech Startup", time: "2 hours ago", urgent: true },
    { type: "payment", title: "Payment Received", amount: "$3,500", time: "5 hours ago", urgent: false },
    { type: "completion", title: "Mobile App Completed", client: "E-commerce Co.", time: "1 day ago", urgent: false },
    { type: "message", title: "Client Message", client: "Marketing Agency", time: "2 days ago", urgent: false }
  ];

  const displayName = serviceProvider?.business_name || "Your Business";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <UnifiedHeader 
        platform="labr8" 
        user={session?.user}
        notificationCount={pendingRequests.length + 3}
        unreadMessages={2}
        onLogout={logout}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage src={serviceProvider?.logo_url} />
              <AvatarFallback className="bg-gradient-to-br from-[#00eada] to-[#00c4b8] text-white text-lg font-bold">
                {displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-lg text-gray-600">{displayName}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{enhancedData.performance.clientSatisfaction}</span>
                  <span className="text-sm text-gray-500">rating</span>
                </div>
                <Badge variant="teal" className="font-medium">
                  {enhancedData.performance.repeatClients}% repeat clients
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            <Button className="bg-gradient-to-r from-[#00eada] to-[#00c4b8] hover:from-[#00c4b8] hover:to-[#00eada] text-white font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedStatsCard
            title="Monthly Revenue"
            value={`$${enhancedData.financial.monthlyRevenue.toLocaleString()}`}
            change={{ value: "+18%", trend: "up", period: "last month" }}
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            variant="success"
          />
          <EnhancedStatsCard
            title="Active Projects"
            value={activeProjects.length}
            change={{ value: "+3", trend: "up", period: "this week" }}
            icon={<Target className="h-5 w-5 text-blue-600" />}
          />
          <EnhancedStatsCard
            title="Response Time"
            value={enhancedData.performance.responseTime}
            change={{ value: "-0.5hrs", trend: "up", period: "avg" }}
            icon={<Clock className="h-5 w-5 text-purple-600" />}
          />
          <EnhancedStatsCard
            title="Client Satisfaction"
            value={`${enhancedData.performance.clientSatisfaction}/5.0`}
            change={{ value: "+0.2", trend: "up", period: "quarter" }}
            icon={<Award className="h-5 w-5 text-yellow-600" />}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Pipeline */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-white/60 border-gray-200/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Project Pipeline
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="incoming" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="incoming" className="relative">
                      Incoming
                      {pendingRequests.length > 0 && (
                        <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                          {pendingRequests.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="negotiating">
                      Discussing ({negotiatingRequests.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                      Active ({activeProjects.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedProjects.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="incoming" className="space-y-4">
                    {pendingRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="p-4 rounded-lg bg-white/80 border border-gray-200/50 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{request.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{request.description?.substring(0, 100)}...</p>
                            <div className="flex items-center space-x-4 mt-3">
                              <Badge variant="outline">New</Badge>
                              <span className="text-xs text-gray-500">2 hours ago</span>
                            </div>
                          </div>
                          <Button size="sm" className="bg-[#00eada] hover:bg-[#00c4b8] text-black">
                            Respond
                          </Button>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  {/* Add other tab contents here */}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card className="backdrop-blur-xl bg-white/60 border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Project Completion</span>
                    <span className="font-medium">{enhancedData.performance.completionRate}%</span>
                  </div>
                  <Progress value={enhancedData.performance.completionRate} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Client Retention</span>
                    <span className="font-medium">{enhancedData.performance.repeatClients}%</span>
                  </div>
                  <Progress value={enhancedData.performance.repeatClients} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Response Quality</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="backdrop-blur-xl bg-white/60 border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.urgent ? 'bg-red-500' : 'bg-gray-300'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card className="backdrop-blur-xl bg-white/60 border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enhancedData.insights.map((insight, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{insight.title}</p>
                        <p className="text-lg font-bold text-[#00eada]">{insight.value}</p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextGenLabr8Dashboard;
