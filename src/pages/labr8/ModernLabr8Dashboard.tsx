
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-foreground">LAB-R8 Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Welcome back, {displayName}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 border-primary text-primary hover:bg-primary/10 transition"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <Button
              onClick={reload}
              className="rounded-xl bg-primary hover:bg-primary/80 px-6 py-2 font-semibold text-primary-foreground shadow transition border border-primary/30"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatsCard
            label="Incoming"
            value={pendingRequests.length}
            icon={<ExternalLink className="h-6 w-6 text-blue-400" />}
            accentColor="bg-blue-500/20"
          />
          <StatsCard
            label="In Discussion"
            value={negotiatingRequests.length}
            icon={<AlertCircle className="h-6 w-6 text-orange-400" />}
            accentColor="bg-orange-500/20"
          />
          <StatsCard
            label="Active"
            value={activeProjects.length}
            icon={<Clock className="h-6 w-6 text-purple-400" />}
            accentColor="bg-purple-500/20"
          />
          <StatsCard
            label="Completed"
            value={completedProjects.length}
            icon={<CheckCircle2 className="h-6 w-6 text-green-400" />}
            accentColor="bg-green-500/20"
          />
        </div>

        {/* Request Management Tabs */}
        <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/40">
          <Tabs defaultValue="incoming" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-xl border mb-6 bg-muted/20">
              <TabsTrigger value="incoming">Incoming ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="discussing">Discussing ({negotiatingRequests.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
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
        <div className="mt-12">
          <h2 className="text-xl font-extrabold mb-4 text-foreground">Recent Activity</h2>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default ModernLabr8Dashboard;
