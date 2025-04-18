
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as communityService from "@/services/communityService";
import { PlusCircle, Globe, GlobeSlash, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Community } from "@/models/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [communityToDelete, setCommunityToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: managedCommunities, isLoading } = useQuery({
    queryKey: ['managed-communities', currentUser?.id],
    queryFn: () => communityService.getManagedCommunities(currentUser?.id || ""),
    enabled: !!currentUser?.id
  });

  const updateCommunityMutation = useMutation({
    mutationFn: (community: Community) => communityService.updateCommunity(community),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managed-communities'] });
      toast({
        title: "Community updated",
        description: "The community visibility has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating community:", error);
      toast({
        title: "Error",
        description: "Failed to update the community. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCommunityMutation = useMutation({
    mutationFn: (communityId: string) => communityService.deleteCommunity(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managed-communities'] });
      toast({
        title: "Community deleted",
        description: "The community has been deleted successfully.",
      });
      setCommunityToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting community:", error);
      toast({
        title: "Error",
        description: "Failed to delete the community. Please try again.",
        variant: "destructive",
      });
      setCommunityToDelete(null);
    },
  });

  const toggleCommunityVisibility = (community: Community) => {
    const updatedCommunity = {
      ...community,
      isPublic: !community.isPublic
    };
    updateCommunityMutation.mutate(updatedCommunity);
  };

  const handleDeleteCommunity = (communityId: string) => {
    setCommunityToDelete(communityId);
  };

  const confirmDeleteCommunity = () => {
    if (communityToDelete) {
      deleteCommunityMutation.mutate(communityToDelete);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Community Management</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your communities
            </p>
          </div>
          <Button 
            onClick={() => navigate("/create-community")} 
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Community
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8 glass dark:glass-dark">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communities">My Communities</TabsTrigger>
            <TabsTrigger value="directory">Directory Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Quick Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                ) : managedCommunities?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't created any communities yet</p>
                    <Button 
                      onClick={() => navigate("/create-community")}
                      variant="outline"
                    >
                      Create Your First Community
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">{managedCommunities?.length}</CardTitle>
                        <p className="text-sm text-muted-foreground">Communities</p>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">
                          {managedCommunities?.filter(c => c.isPublic).length || 0}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Public Communities</p>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">
                          {managedCommunities?.filter(c => !c.isPublic).length || 0}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">Private Communities</p>
                      </CardHeader>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="communities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : managedCommunities?.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground mb-4">You haven't created any communities yet</p>
                  <Button 
                    onClick={() => navigate("/create-community")}
                    variant="outline"
                  >
                    Create Your First Community
                  </Button>
                </div>
              ) : (
                managedCommunities?.map((community) => (
                  <Card 
                    key={community.id}
                    className="hover:shadow-md transition-all"
                  >
                    <CardHeader>
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
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/community/${community.id}`)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/admin/community/${community.id}`)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteCommunity(community.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="directory">
            <Card>
              <CardHeader>
                <CardTitle>Directory Visibility</CardTitle>
                <CardDescription>
                  Control which of your communities appear in the public directory
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded"></div>
                    ))}
                  </div>
                ) : managedCommunities?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't created any communities yet</p>
                    <Button 
                      onClick={() => navigate("/create-community")}
                      variant="outline"
                    >
                      Create Your First Community
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {managedCommunities?.map((community) => (
                      <Card key={community.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden">
                              <img 
                                src={community.imageUrl} 
                                alt={community.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{community.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {community.memberCount} members
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {community.isPublic ? (
                              <Globe className="h-4 w-4 text-green-500" />
                            ) : (
                              <GlobeSlash className="h-4 w-4 text-red-500" />
                            )}
                            <Switch 
                              checked={community.isPublic} 
                              onCheckedChange={() => toggleCommunityVisibility(community)}
                              aria-label="Toggle directory visibility"
                            />
                            <span className="text-sm ml-1">
                              {community.isPublic ? "Public" : "Private"}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!communityToDelete} onOpenChange={() => setCommunityToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              community and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCommunity} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizerDashboard;
