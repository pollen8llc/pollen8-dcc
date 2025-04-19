
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/models/types";
import * as communityService from "@/services/communityService";
import * as adminService from "@/services/adminService";
import { useToast } from "@/hooks/use-toast";
import UserManagementTab from "@/components/admin/UserManagementTab";
import AdminOverviewCards from "@/components/admin/AdminOverviewCards";
import ManagedCommunitiesGrid from "@/components/admin/ManagedCommunitiesGrid";
import CommunityManagementDashboard from "@/components/admin/CommunityManagementDashboard";
import NotFoundState from "@/components/community/NotFoundState";

const AdminDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || "overview";
  const { currentUser, isOrganizer } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const { toast } = useToast();

  // Ensure admin role for the specific user
  useEffect(() => {
    const ensureAdminInDatabase = async () => {
      if (currentUser?.id === "38a18dd6-4742-419b-b2c1-70dec5c51729") {
        try {
          const result = await adminService.ensureAdminRole();
          if (!result.success) {
            toast({
              title: "Admin role setup error",
              description: result.message,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error ensuring admin role:", error);
        }
      }
    };

    ensureAdminInDatabase();
  }, [currentUser?.id]);

  // If no community ID is provided, fetch managed communities
  const { data: managedCommunities, isLoading: loadingCommunities } = useQuery({
    queryKey: ['managed-communities', currentUser?.id],
    queryFn: () => communityService.getManagedCommunities(currentUser?.id || ""),
    enabled: !id && !!currentUser?.id
  });

  // If a community ID is provided, fetch that specific community
  const { data: community, isLoading: loadingCommunity, error: communityError } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communityService.getCommunityById(id || ""),
    enabled: !!id
  });

  // Check if user has permission to view this community
  useEffect(() => {
    if (id && community && !isOrganizer(id) && currentUser?.role !== UserRole.ADMIN) {
      navigate("/", { replace: true });
    }
  }, [id, community, isOrganizer, navigate, currentUser]);

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab !== "overview" && !id) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('tab', activeTab);
      navigate({ search: newSearchParams.toString() }, { replace: true });
    }
  }, [activeTab, navigate, searchParams, id]);

  const isAdmin = currentUser?.role === UserRole.ADMIN;

  if (loadingCommunities || loadingCommunity) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aquamarine mx-auto"></div>
          <h1 className="text-2xl font-bold mt-4">Loading dashboard...</h1>
        </div>
      </div>
    );
  }

  if (id && (communityError || !community)) {
    return <NotFoundState />;
  }

  // Show admin dashboard or community selection if no ID is provided
  if (!id) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          {isAdmin && (
            <div className="mb-10">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full mb-8 glass dark:glass-dark">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="users">User Management</TabsTrigger>
                  <TabsTrigger value="settings">System Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Administration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">
                        Welcome to the admin dashboard. Use the tabs above to manage users, roles, and system settings.
                      </p>
                      <AdminOverviewCards onTabChange={setActiveTab} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users">
                  <UserManagementTab />
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        System settings will be implemented in a future update.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {(isOrganizer() || isAdmin) && managedCommunities && managedCommunities.length > 0 && (
            <ManagedCommunitiesGrid communities={managedCommunities} />
          )}
          
          {!isAdmin && !isOrganizer() && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">You don't have admin privileges</h2>
              <p className="text-muted-foreground">
                Contact an administrator if you believe you should have access to this page.
              </p>
            </div>
          )}
          
          {(isOrganizer() || isAdmin) && (!managedCommunities || managedCommunities.length === 0) && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">You don't manage any communities yet</h2>
              <p className="text-muted-foreground">
                Create a community to start managing it.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If a community ID is provided, show community management dashboard
  return (
    <div className="min-h-screen">
      <Navbar />
      <CommunityManagementDashboard 
        community={community}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default AdminDashboard;
