
import React, { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UnifiedHeader } from "@/components/shared/UnifiedHeader";
import { EnhancedStatsCard } from "@/components/shared/EnhancedStatsCard";
import { CounterOfferForm } from "@/components/labr8/CounterOfferForm";
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
  Zap,
  ExternalLink,
  Building,
  AlertCircle,
  Eye,
  Reply,
  Plus,
  Building2,
  Globe,
  BarChart3,
  Briefcase
} from "lucide-react";

const Labr8Dashboard: React.FC = () => {
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

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCounterOffer, setShowCounterOffer] = useState(false);

  React.useEffect(() => {
    if (error)
      toast({
        title: "Error loading data",
        description: error,
        variant: "destructive",
      });
  }, [error]);

  // Enhanced data for demonstration
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
      case 'pending': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'negotiating': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'agreed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in_progress': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'completed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleCounterOffer = (request: any) => {
    setSelectedRequest(request);
    setShowCounterOffer(true);
  };

  const handleCounterOfferSuccess = () => {
    setShowCounterOffer(false);
    setSelectedRequest(null);
    reload();
    toast({
      title: "Counter Offer Submitted",
      description: "Your counter offer has been sent to the client.",
    });
  };

  const handleViewDetails = (item: any) => {
    // Navigate to detailed view with proper URL structure
    if (item.status === 'completed' || item.status === 'in_progress') {
      window.open(`/labr8/projects/${item.id}`, '_blank');
    } else {
      window.open(`/labr8/request/${item.id}`, '_blank');
    }
  };

  const handleViewScope = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleViewTerms = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderRequestCard = (request: any) => (
    <div key={request.id} className="glass-card glass-morphism-hover p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-semibold text-white text-lg mb-2">{request.title}</h4>
            <p className="text-sm text-gray-300 line-clamp-2">
              {request.description?.substring(0, 150)}...
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {request.organizer && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>{request.organizer.organization_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-[#00eada]">{formatBudget(request.budget_range)}</span>
            </div>
          </div>

          {/* Clickable Document Links */}
          {(request.scope_details || request.terms) && (
            <div className="flex gap-3">
              {request.scope_details && (
                <button
                  onClick={() => handleViewScope(request.scope_details)}
                  className="inline-flex items-center gap-1 text-sm text-[#00eada] hover:text-[#00c4b8] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Scope Document
                </button>
              )}
              {request.terms && (
                <button
                  onClick={() => handleViewTerms(request.terms)}
                  className="inline-flex items-center gap-1 text-sm text-[#00eada] hover:text-[#00c4b8] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Terms & Conditions
                </button>
              )}
            </div>
          )}
          
          <Badge className={`${getStatusColor(request.status)} font-medium border`}>
            {request.status?.replace('_', ' ') || 'pending'}
          </Badge>
        </div>
        
        <div className="flex flex-col items-end gap-2 ml-4">
          <Button
            onClick={() => handleCounterOffer(request)}
            size="sm"
            className="bg-[#00eada] hover:bg-[#00c4b8] text-black flex items-center gap-1 font-medium"
          >
            <Reply className="h-4 w-4" />
            Counter Offer
          </Button>
          <Button
            onClick={() => handleViewDetails(request)}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-white/10 flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProjectCard = (project: any) => (
    <div key={project.id} className="glass-card glass-morphism-hover p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-semibold text-white text-lg mb-2">{project.title}</h4>
            <p className="text-sm text-gray-300 line-clamp-2">
              {project.description?.substring(0, 150)}...
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {project.organizer && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>{project.organizer.organization_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-[#00eada]">{formatBudget(project.budget_range)}</span>
            </div>
          </div>

          {/* Clickable Document Links */}
          {(project.scope_details || project.terms) && (
            <div className="flex gap-3">
              {project.scope_details && (
                <button
                  onClick={() => handleViewScope(project.scope_details)}
                  className="inline-flex items-center gap-1 text-sm text-[#00eada] hover:text-[#00c4b8] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Scope Document
                </button>
              )}
              {project.terms && (
                <button
                  onClick={() => handleViewTerms(project.terms)}
                  className="inline-flex items-center gap-1 text-sm text-[#00eada] hover:text-[#00c4b8] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Terms & Conditions
                </button>
              )}
            </div>
          )}
          
          <Badge className={`${getStatusColor(project.status)} font-medium border`}>
            {project.status?.replace('_', ' ') || 'pending'}
          </Badge>
        </div>
        
        <div className="flex flex-col items-end gap-2 ml-4">
          <Button
            onClick={() => handleViewDetails(project)}
            className="bg-[#00eada] hover:bg-[#00c4b8] text-black flex items-center gap-1 font-medium"
            size="sm"
          >
            <Eye className="h-4 w-4" />
            View Project
          </Button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
            <Avatar className="h-16 w-16 border-4 border-[#00eada]/30 shadow-lg">
              <AvatarImage src={serviceProvider?.logo_url} />
              <AvatarFallback className="bg-gradient-to-br from-[#00eada] to-[#00c4b8] text-black text-lg font-bold">
                {displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white">Provider Console</h1>
              <p className="text-lg text-gray-300">{displayName}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-white">{enhancedData.performance.clientSatisfaction}</span>
                  <span className="text-sm text-gray-400">rating</span>
                </div>
                <Badge variant="outline" className="font-medium border-[#00eada] text-[#00eada]">
                  {enhancedData.performance.repeatClients}% repeat clients
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-white/10">
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
            <Button className="bg-gradient-to-r from-[#00eada] to-[#00c4b8] hover:from-[#00c4b8] hover:to-[#00eada] text-black font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">${enhancedData.financial.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+18% from last month</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Projects</p>
                  <p className="text-2xl font-bold text-white">{activeProjects.length}</p>
                  <p className="text-xs text-blue-400">+3 this week</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Response Time</p>
                  <p className="text-2xl font-bold text-white">{enhancedData.performance.responseTime}</p>
                  <p className="text-xs text-purple-400">-0.5hrs avg</p>
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Client Satisfaction</p>
                  <p className="text-2xl font-bold text-white">{enhancedData.performance.clientSatisfaction}/5.0</p>
                  <p className="text-xs text-yellow-400">+0.2 this quarter</p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Pipeline */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5" />
                    Project Pipeline
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="incoming" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-800/50 border-gray-700">
                    <TabsTrigger value="incoming" className="relative text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#00eada]/20">
                      New Requests
                      {pendingRequests.length > 0 && (
                        <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs bg-red-500/20 text-red-300">
                          {pendingRequests.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="negotiating" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#00eada]/20">
                      In Negotiation ({negotiatingRequests.length})
                    </TabsTrigger>
                    <TabsTrigger value="active" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#00eada]/20">
                      Active ({activeProjects.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-[#00eada]/20">
                      Completed ({completedProjects.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="incoming" className="space-y-4">
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <p>No new requests at the moment</p>
                      </div>
                    ) : (
                      pendingRequests.slice(0, 3).map(renderRequestCard)
                    )}
                  </TabsContent>
                  
                  <TabsContent value="negotiating" className="space-y-4">
                    {negotiatingRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <p>No ongoing negotiations</p>
                      </div>
                    ) : (
                      negotiatingRequests.slice(0, 3).map(renderRequestCard)
                    )}
                  </TabsContent>
                  
                  <TabsContent value="active" className="space-y-4">
                    {activeProjects.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Target className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <p>No active projects</p>
                      </div>
                    ) : (
                      activeProjects.slice(0, 3).map(renderProjectCard)
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="space-y-4">
                    {completedProjects.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <p>No completed projects yet</p>
                      </div>
                    ) : (
                      completedProjects.slice(0, 3).map(renderProjectCard)
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Metrics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Project Completion</span>
                    <span className="font-medium text-white">{enhancedData.performance.completionRate}%</span>
                  </div>
                  <Progress value={enhancedData.performance.completionRate} className="h-2 bg-gray-700" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Client Retention</span>
                    <span className="font-medium text-white">{enhancedData.performance.repeatClients}%</span>
                  </div>
                  <Progress value={enhancedData.performance.repeatClients} className="h-2 bg-gray-700" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Response Quality</span>
                    <span className="font-medium text-white">98%</span>
                  </div>
                  <Progress value={98} className="h-2 bg-gray-700" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.urgent ? 'bg-red-400' : 'bg-[#00eada]'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5" />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enhancedData.insights.map((insight, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-300">{insight.title}</p>
                        <p className="text-lg font-bold text-[#00eada]">{insight.value}</p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Counter Offer Dialog */}
      <Dialog open={showCounterOffer} onOpenChange={setShowCounterOffer}>
        <DialogContent className="max-w-3xl glass-card border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Submit Counter Offer</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <CounterOfferForm
              serviceRequestId={selectedRequest.id}
              fromUserId={session?.user?.id || ''}
              originalProposal={selectedRequest}
              onSuccess={handleCounterOfferSuccess}
              onCancel={() => setShowCounterOffer(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Labr8Dashboard;
