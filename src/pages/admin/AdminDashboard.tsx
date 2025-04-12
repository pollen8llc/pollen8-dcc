
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Community } from "@/models/types";
import * as communityService from "@/services/communityService";
import AdminMembersTab from "@/components/admin/AdminMembersTab";
import AdminSettingsTab from "@/components/admin/AdminSettingsTab";
import AdminStatsTab from "@/components/admin/AdminStatsTab";
import UserManagementTab from "@/components/admin/UserManagementTab";
import NotFoundState from "@/components/community/NotFoundState";

const AdminDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || "overview";
  const { currentUser, isOrganizer, hasPermission } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);

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
    if (id && community && !isOrganizer(id) && currentUser?.role !== "ADMIN") {
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

  const isAdmin = currentUser?.role === "ADMIN";

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
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="hover:shadow-md cursor-pointer transition-all" onClick={() => setActiveTab("users")}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">User Management</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Manage user accounts, assign roles and permissions
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card className="hover:shadow-md cursor-pointer transition-all" onClick={() => setActiveTab("settings")}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">System Settings</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Configure global settings and system preferences
                            </p>
                          </CardContent>
                        </Card>
                      </div>
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
            <div>
              <h2 className="text-xl font-semibold mb-4">Select a community to manage:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {managedCommunities.map((community: Community) => (
                  <Card 
                    key={community.id}
                    className="hover:shadow-md cursor-pointer transition-all"
                    onClick={() => navigate(`/admin/community/${community.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle>{community.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video relative mb-4 overflow-hidden rounded-md">
                        <img 
                          src={community.imageUrl} 
                          alt={community.name} 
                          className="object-cover w-full h-full" 
                        />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {community.description}
                      </p>
                      <div className="mt-4 text-sm">
                        <span className="font-medium">{community.memberCount}</span> members
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
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
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Managing: {community.name}</h1>
            <p className="text-muted-foreground mt-1">
              Make changes to your community settings and manage members
            </p>
          </div>
          <div className="flex gap-2">
            <a 
              href={`/community/${community.id}`} 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              View public page →
            </a>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8 glass dark:glass-dark">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Created: {community.createdAt || 'Not available'}</p>
                  <p>Last updated: {community.updatedAt || 'Not available'}</p>
                  <p>Visibility: {community.isPublic ? 'Public' : 'Private'}</p>
                  <p>Total members: {community.memberCount}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="members">
            <AdminMembersTab communityId={community.id} />
          </TabsContent>
          
          <TabsContent value="statistics">
            <AdminStatsTab communityId={community.id} />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettingsTab community={community} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
