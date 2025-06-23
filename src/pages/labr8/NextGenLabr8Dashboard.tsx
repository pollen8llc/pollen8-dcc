
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import { EnhancedStatsCard } from "@/components/shared/EnhancedStatsCard";
import { useLabr8Dashboard } from "@/hooks/useLabr8Dashboard";
import { CounterOfferForm } from "@/components/labr8/CounterOfferForm";
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
  Reply
} from "lucide-react";

const NextGenLabr8Dashboard: React.FC = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
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
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'negotiating': return 'bg-orange-100 text-orange-800';
      case 'agreed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const renderRequestCard = (request: any) => (
    <div key={request.id} className="p-4 rounded-lg bg-white/80 border border-gray-200/50 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{request.title}</h4>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {request.description?.substring(0, 150)}...
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
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

          {/* Scope and Terms Links */}
          {(request.scope_details || request.terms) && (
            <div className="flex gap-3 mb-3">
              {request.scope_details && (
                <a
                  href={request.scope_details}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#00eada] hover:text-[#00c4b8]"
                >
                  <ExternalLink className="h-3 w-3" />
                  Scope Document
                </a>
              )}
              {request.terms && (
                <a
                  href={request.terms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#00eada] hover:text-[#00c4b8]"
                >
                  <ExternalLink className="h-3 w-3" />
                  Terms & Conditions
                </a>
              )}
            </div>
          )}
          
          <Badge className={`${getStatusColor(request.status)} font-medium`}>
            {request.status?.replace('_', ' ') || 'pending'}
          </Badge>
        </div>
        
        <div className="flex flex-col items-end gap-2 ml-4">
          <Button
            onClick={() => handleCounterOffer(request)}
            size="sm"
            className="bg-[#00eada] hover:bg-[#00c4b8] text-black flex items-center gap-1"
          >
            <Reply className="h-4 w-4" />
            Counter Offer
          </Button>
          <Button
            onClick={() => navigate(`/labr8/requests/${request.id}`)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProjectCard = (project: any) => (
    <div key={project.id} className="p-4 rounded-lg bg-white/80 border border-gray-200/50 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {project.description?.substring(0, 150)}...
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {project.organizer && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>{project.organizer.organization_name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {formatBudget(project.budget_range)}
            </div>
          </div>

          {/* Scope and Terms Links */}
          {(project.scope_details || project.terms) && (
            <div className="flex gap-3 mb-3">
              {project.scope_details && (
                <a
                  href={project.scope_details}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#00eada] hover:text-[#00c4b8]"
                >
                  <ExternalLink className="h-3 w-3" />
                  Scope Document
                </a>
              )}
              {project.terms && (
                <a
                  href={project.terms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#00eada] hover:text-[#00c4b8]"
                >
                  <ExternalLink className="h-3 w-3" />
                  Terms & Conditions
                </a>
              )}
            </div>
          )}
          
          <Badge className={`${getStatusColor(project.status)} font-medium`}>
            {project.status?.replace('_', ' ') || 'pending'}
          </Badge>
        </div>
        
        <div className="flex flex-col items-end gap-2 ml-4">
          <Button
            onClick={() => navigate(`/labr8/requests/${project.id}`)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      
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
                <Badge variant="outline" className="font-medium">
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
                      New Requests
                      {pendingRequests.length > 0 && (
                        <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                          {pendingRequests.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="negotiating">
                      In Negotiation ({negotiatingRequests.length})
                    </TabsTrigger>
                    <TabsTrigger value="active">
                      Active ({activeProjects.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedProjects.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="incoming" className="space-y-4">
                    {pendingRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No new requests at the moment</p>
                      </div>
                    ) : (
                      pendingRequests.slice(0, 3).map(renderRequestCard)
                    )}
                  </TabsContent>
                  
                  <TabsContent value="negotiating" className="space-y-4">
                    {negotiatingRequests.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No ongoing negotiations</p>
                      </div>
                    ) : (
                      negotiatingRequests.slice(0, 3).map(renderRequestCard)
                    )}
                  </TabsContent>
                  
                  <TabsContent value="active" className="space-y-4">
                    {activeProjects.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No active projects</p>
                      </div>
                    ) : (
                      activeProjects.slice(0, 3).map(renderProjectCard)
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="space-y-4">
                    {completedProjects.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
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

      {/* Counter Offer Dialog */}
      <Dialog open={showCounterOffer} onOpenChange={setShowCounterOffer}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Submit Counter Offer</DialogTitle>
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

export default NextGenLabr8Dashboard;
