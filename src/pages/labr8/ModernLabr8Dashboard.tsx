
import React from "react";
import { useSession } from "@/hooks/useSession";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/labr8/StatsCard";
import RequestList from "@/components/labr8/RequestList";
import ActivityFeed from "@/components/labr8/ActivityFeed";
import { Building2, ExternalLink, AlertCircle, Clock, CheckCircle2, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLabr8Dashboard } from "@/hooks/useLabr8Dashboard";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ModernLabr8Dashboard: React.FC = () => {
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

  // Logout handler with feedback
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      // Optionally reload the page or redirect after logout.
      window.location.href = "/labr8";
    } catch (err) {
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const displayName = serviceProvider?.business_name
    ? <>
        <span className="font-bold">{serviceProvider.business_name}</span>
      </>
    : <span className="text-muted-foreground">Loading profile...</span>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-First Header Design */}
        <div className="pt-6 pb-8 sm:pt-8 sm:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            {/* Logo and Brand Section */}
            <div className="flex items-center justify-center sm:justify-start">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl bg-gradient-to-br from-[#00eada] to-[#00b8a8] flex items-center justify-center shadow-lg">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    LAB-R8
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Service Provider Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Welcome Message and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
                  Welcome back, {displayName}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Manage your projects and client relationships
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  size="sm"
                  className="flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
                <Button
                  onClick={reload}
                  size="sm"
                  className="bg-gradient-to-r from-[#00eada] to-[#00b8a8] hover:from-[#00b8a8] hover:to-[#008f82] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Refresh Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10">
          <StatsCard
            label="Incoming"
            value={pendingRequests.length}
            icon={<ExternalLink className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />}
            accentColor="bg-blue-500/20"
          />
          <StatsCard
            label="In Discussion"
            value={negotiatingRequests.length}
            icon={<AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400" />}
            accentColor="bg-orange-500/20"
          />
          <StatsCard
            label="Active"
            value={activeProjects.length}
            icon={<Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />}
            accentColor="bg-purple-500/20"
          />
          <StatsCard
            label="Completed"
            value={completedProjects.length}
            icon={<CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />}
            accentColor="bg-green-500/20"
          />
        </div>

        {/* Request Management Tabs */}
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-border/40">
          <Tabs defaultValue="incoming" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-xl border mb-6 bg-muted/20">
              <TabsTrigger value="incoming" className="text-xs sm:text-sm">
                Incoming ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="discussing" className="text-xs sm:text-sm">
                Discussing ({negotiatingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs sm:text-sm">
                Active ({activeProjects.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs sm:text-sm">
                Completed ({completedProjects.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="incoming" className="mt-3">
              <RequestList
                type="incoming"
                requests={pendingRequests}
                loading={loading}
                emptyLabel="No incoming requests! You'll see new service requests here."
                onDelete={reload}
              />
            </TabsContent>
            <TabsContent value="discussing" className="mt-3">
              <RequestList
                type="incoming"
                requests={negotiatingRequests}
                loading={loading}
                emptyLabel="No ongoing discussions."
                onDelete={reload}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-3">
              <RequestList
                type="active"
                requests={activeProjects}
                loading={loading}
                emptyLabel="No active projects in progress."
                onDelete={reload}
              />
            </TabsContent>
            <TabsContent value="completed" className="mt-3">
              <RequestList
                type="completed"
                requests={completedProjects}
                loading={loading}
                emptyLabel="No completed projects yet."
                onDelete={reload}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 sm:mt-12 pb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-foreground">Recent Activity</h2>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default ModernLabr8Dashboard;
