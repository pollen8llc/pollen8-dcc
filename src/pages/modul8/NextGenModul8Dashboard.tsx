
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UnifiedHeader } from '@/components/shared/UnifiedHeader';
import { EnhancedStatsCard } from '@/components/shared/EnhancedStatsCard';
import { getUserOrganizer, getOrganizerServiceRequests } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Plus,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Building2,
  Target,
  Calendar,
  MessageSquare,
  Zap,
  BarChart3,
  Globe,
  Briefcase,
  Code,
  Megaphone,
  Scale,
  Camera,
  Palette
} from 'lucide-react';

const NextGenModul8Dashboard = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizerData();
  }, [session?.user?.id]);

  const loadOrganizerData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const organizerData = await getUserOrganizer(session.user.id);
      if (!organizerData) {
        navigate('/modul8/setup');
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

  // Enhanced mock data for demonstration
  const enhancedMetrics = {
    totalProjects: serviceRequests.length,
    activeProjects: serviceRequests.filter(r => r.engagement_status === 'negotiating').length,
    completedProjects: serviceRequests.filter(r => r.engagement_status === 'affiliated').length,
    totalBudget: 45000,
    savedCosts: 8500,
    avgResponseTime: "4.2 hrs",
    providerSatisfaction: 4.7
  };

  // Map icons to domain pages
  const domainIconMap = {
    'Web Development': Code,
    'Marketing': Megaphone,
    'Legal Services': Scale,
    'Photography': Camera,
    'Design': Palette,
    'Business Consulting': Briefcase,
    'Content Creation': Camera,
    'Event Planning': Calendar,
    'Financial Services': BarChart3,
    'Health & Wellness': Target
  };

  const domainActivity = DOMAIN_PAGES.slice(0, 6).map(domain => ({
    ...domain,
    icon: domainIconMap[domain.title] || Building2, // Add fallback icon
    activeProviders: Math.floor(Math.random() * 20) + 5,
    recentRequests: Math.floor(Math.random() * 8) + 1,
    avgRating: (4 + Math.random()).toFixed(1)
  }));

  const recentActivities = [
    { type: "provider_response", title: "New proposal received", domain: "Web Development", time: "2 hours ago", urgent: true },
    { type: "project_update", title: "Project milestone completed", domain: "Marketing", time: "5 hours ago", urgent: false },
    { type: "new_provider", title: "Provider joined network", domain: "Legal Services", time: "1 day ago", urgent: false },
    { type: "budget_alert", title: "Budget threshold reached", domain: "Event Planning", time: "2 days ago", urgent: true }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <UnifiedHeader 
        platform="modul8" 
        user={session?.user}
        notificationCount={5}
        unreadMessages={3}
        onLogout={logout}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ecosystem Dashboard</h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage your service network and collaborations
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <Badge variant="teal" className="font-medium">
                {enhancedMetrics.totalProjects} total projects
              </Badge>
              <Badge variant="outline">
                {domainActivity.length} domains active
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => navigate('/modul8/request/create')}
              className="bg-gradient-to-r from-[#00eada] to-[#00c4b8] hover:from-[#00c4b8] hover:to-[#00eada] text-white font-semibold flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Request
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedStatsCard
            title="Active Projects"
            value={enhancedMetrics.activeProjects}
            change={{ value: "+2", trend: "up", period: "this week" }}
            icon={<Target className="h-5 w-5 text-blue-600" />}
          />
          <EnhancedStatsCard
            title="Total Budget"
            value={`$${enhancedMetrics.totalBudget.toLocaleString()}`}
            change={{ value: "+15%", trend: "up", period: "quarter" }}
            icon={<BarChart3 className="h-5 w-5 text-green-600" />}
            variant="success"
          />
          <EnhancedStatsCard
            title="Cost Savings"
            value={`$${enhancedMetrics.savedCosts.toLocaleString()}`}
            change={{ value: "+$1.2K", trend: "up", period: "month" }}
            icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
            variant="success"
          />
          <EnhancedStatsCard
            title="Response Time"
            value={enhancedMetrics.avgResponseTime}
            change={{ value: "-1.2hrs", trend: "up", period: "avg" }}
            icon={<Clock className="h-5 w-5 text-orange-600" />}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Domains */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-white/60 border-gray-200/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Service Domains
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {domainActivity.map((domain) => {
                    const Icon = domain.icon;
                    return (
                      <div
                        key={domain.id}
                        onClick={() => navigate(`/modul8/domain/${domain.id}`)}
                        className="p-4 rounded-lg bg-white/80 border border-gray-200/50 hover:shadow-md hover:border-[#00eada]/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-[#00eada]/20 to-[#00c4b8]/20 flex items-center justify-center group-hover:from-[#00eada]/30 group-hover:to-[#00c4b8]/30 transition-all`}>
                            <Icon className="h-5 w-5 text-[#00eada]" />
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#00eada] transition-colors" />
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {domain.title}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Providers</span>
                            <p className="font-semibold">{domain.activeProviders}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Rating</span>
                            <p className="font-semibold">{domain.avgRating}★</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {domain.recentRequests} recent
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="backdrop-blur-xl bg-white/60 border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate('/modul8/request/create')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Request
                </Button>
                <Button 
                  onClick={() => navigate('/modul8/providers')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Browse Providers
                </Button>
                <Button 
                  onClick={() => navigate('/modul8/projects')}
                  variant="outline" 
                  className="w-full justify-start"
                >
                  <Target className="h-4 w-4 mr-2" />
                  View Projects
                </Button>
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
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.urgent ? 'bg-red-500' : 'bg-[#00eada]'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.domain} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Overview */}
            <Card className="backdrop-blur-xl bg-white/60 border-gray-200/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Project Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{enhancedMetrics.activeProjects}</span>
                    <Badge variant="outline" className="text-xs">+2</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold">{enhancedMetrics.completedProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">94%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextGenModul8Dashboard;
