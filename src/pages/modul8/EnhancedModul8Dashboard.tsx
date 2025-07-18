
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FolderOpen, 
  Users, 
  CheckCircle, 
  Clock,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceRequest, DOMAIN_PAGES } from '@/types/modul8';
import { getOrganizerServiceRequests, getUserOrganizer } from '@/services/modul8Service';
import { useSession } from '@/hooks/useSession';
import { toast } from '@/hooks/use-toast';

const EnhancedModul8Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizer, setOrganizer] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [session?.user?.id]);

  const loadDashboardData = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const userOrganizer = await getUserOrganizer(session.user.id);
      setOrganizer(userOrganizer);

      if (userOrganizer) {
        const userRequests = await getOrganizerServiceRequests(userOrganizer.id);
        setRequests(userRequests);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusStats = () => {
    const stats = {
      active: requests.filter(r => ['in_progress', 'agreed', 'pending_review'].includes(r.status)).length,
      completed: requests.filter(r => r.status === 'completed').length,
      pending: requests.filter(r => r.status === 'pending').length,
      total: requests.length
    };
    return stats;
  };

  const getRecentActivity = () => {
    return requests
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5);
  };

  const stats = getStatusStats();
  const recentActivity = getRecentActivity();

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Modul8 Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your service requests and projects</p>
        </div>
        <Button
          onClick={() => navigate('/modul8/request/new')}
          className="bg-[#00eada] hover:bg-[#00eada]/90 text-black text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">New Request</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm text-muted-foreground">Total Projects</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Active</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold mt-1 text-blue-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold mt-1 text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
              <span className="text-xs sm:text-sm text-muted-foreground">Pending</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold mt-1 text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Domain Pages Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Service Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {DOMAIN_PAGES.slice(0, 6).map((domain) => (
                <button
                  key={domain.id}
                  onClick={() => navigate(`/modul8/domain/${domain.id}`)}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <div>
                    <p className="font-medium text-sm">{domain.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {domain.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
              
              {DOMAIN_PAGES.length > 6 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/modul8/domains')}
                  className="mt-2"
                >
                  View All Domains
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-2">
                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/modul8/request/${request.id}`)}
                  >
                    <div className="h-8 w-8 bg-[#00eada]/10 rounded-full flex items-center justify-center">
                      <FolderOpen className="h-4 w-4 text-[#00eada]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{request.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {request.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(request.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <FolderOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                  <Button
                    onClick={() => navigate('/modul8/request/new')}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Create Your First Request
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="p-3 sm:p-4 md:p-6">
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Button
              onClick={() => navigate('/modul8/request/new')}
              variant="outline"
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
            >
              <Plus className="h-4 w-4 sm:h-6 sm:w-6" />
              <span className="text-center">New Service Request</span>
            </Button>
            
            <Button
              onClick={() => navigate('/modul8/projects')}
              variant="outline"
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
            >
              <FolderOpen className="h-4 w-4 sm:h-6 sm:w-6" />
              <span className="text-center">View All Projects</span>
            </Button>
            
            <Button
              onClick={() => navigate('/modul8/providers')}
              variant="outline"
              className="h-16 sm:h-20 flex-col gap-2 text-xs sm:text-sm"
            >
              <Users className="h-4 w-4 sm:h-6 sm:w-6" />
              <span className="text-center">Browse Providers</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedModul8Dashboard;
