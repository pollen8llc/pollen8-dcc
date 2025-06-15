
import React from "react";
import { useSession } from "@/hooks/useSession";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/labr8/StatsCard";
import RequestList from "@/components/labr8/RequestList";
import ActivityFeed from "@/components/labr8/ActivityFeed";
import { Building2, ExternalLink, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useLabr8Dashboard } from "@/hooks/useLabr8Dashboard";
import { toast } from "@/hooks/use-toast";

const ModernLabr8Dashboard: React.FC = () => {
  const { session } = useSession();
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
    if (error) toast({
      title: "Error loading data", description: error, variant: "destructive"
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#effaff] to-[#defff7]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-[#00eada] flex items-center justify-center shadow-lg">
              <Building2 className="h-8 w-8 text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">LAB-R8 Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                {serviceProvider
                  ? <>Welcome back, <span className="font-bold">{serviceProvider.business_name}</span></>
                  : "Loading profile..."}
              </p>
            </div>
          </div>
          <button
            onClick={reload}
            className="rounded-lg bg-[#00eada] hover:bg-[#00eada]/80 px-6 py-2 font-semibold text-black shadow transition"
          >
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Incoming"
            value={pendingRequests.length}
            icon={<ExternalLink className="h-6 w-6 text-blue-600" />}
            accentColor="bg-blue-100"
          />
          <StatsCard
            label="In Discussion"
            value={negotiatingRequests.length}
            icon={<AlertCircle className="h-6 w-6 text-orange-600" />}
            accentColor="bg-orange-100"
          />
          <StatsCard
            label="Active"
            value={activeProjects.length}
            icon={<Clock className="h-6 w-6 text-purple-600" />}
            accentColor="bg-purple-100"
          />
          <StatsCard
            label="Completed"
            value={completedProjects.length}
            icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
            accentColor="bg-green-100"
          />
        </div>

        {/* Request Management Tabs */}
        <Tabs defaultValue="incoming" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="incoming">Incoming ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="discussing">Discussing ({negotiatingRequests.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="mt-6">
            <RequestList
              type="incoming"
              requests={pendingRequests}
              loading={loading}
              emptyLabel="No incoming requests! You'll see new service requests here."
              onDelete={reload}
            />
          </TabsContent>
          <TabsContent value="discussing" className="mt-6">
            <RequestList
              type="incoming"
              requests={negotiatingRequests}
              loading={loading}
              emptyLabel="No ongoing discussions."
              onDelete={reload}
            />
          </TabsContent>
          <TabsContent value="active" className="mt-6">
            <RequestList
              type="active"
              requests={activeProjects}
              loading={loading}
              emptyLabel="No active projects in progress."
              onDelete={reload}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <RequestList
              type="completed"
              requests={completedProjects}
              loading={loading}
              emptyLabel="No completed projects yet."
              onDelete={reload}
            />
          </TabsContent>
        </Tabs>

        {/* Recent Activity - future extension */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default ModernLabr8Dashboard;
