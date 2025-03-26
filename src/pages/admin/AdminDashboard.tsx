
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import NotFoundState from "@/components/community/NotFoundState";

const AdminDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, isOrganizer } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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
    if (id && community && !isOrganizer(id)) {
      navigate("/", { replace: true });
    }
  }, [id, community, isOrganizer, navigate]);

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

  // Show community selection if no ID is provided
  if (!id) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          {managedCommunities && managedCommunities.length > 0 ? (
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
          ) : (
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
