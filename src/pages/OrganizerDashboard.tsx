
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shell } from "@/components/layout/Shell";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Plus, Folder, MapPin, Users, Calendar, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { getManagedCommunities, deleteCommunity, CommunityError } from "@/services/communityService";
import { cn } from "@/lib/utils";

export default function OrganizerDashboard() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("communities");
  const [communityToDelete, setCommunityToDelete] = useState<any | null>(null);

  // Check if user has permission to access this dashboard
  const isAuthorized = currentUser?.role === UserRole.ORGANIZER || currentUser?.role === UserRole.ADMIN;

  // Load communities when the component mounts
  useEffect(() => {
    const loadCommunities = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        const data = await getManagedCommunities(currentUser.id);
        setCommunities(data);
      } catch (err) {
        console.error("Failed to load communities:", err);
        setError(
          err instanceof CommunityError
            ? err.message
            : "Failed to load your communities. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) {
      loadCommunities();
    }
  }, [currentUser, isAuthorized]);

  const handleDeleteCommunity = async () => {
    if (!communityToDelete) return;

    try {
      await deleteCommunity(communityToDelete.id);
      
      // Remove the deleted community from the state
      setCommunities(communities.filter(c => c.id !== communityToDelete.id));
      
      // Close the dialog
      setCommunityToDelete(null);
    } catch (err) {
      console.error("Failed to delete community:", err);
      setError(
        err instanceof CommunityError
          ? err.message
          : "Failed to delete community. Please try again."
      );
    }
  };

  // If user is not authorized, show access denied
  if (!isAuthorized) {
    return (
      <Shell>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need organizer or admin permissions to access this dashboard.
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage and moderate your communities
          </p>
        </div>
        
        <Button asChild size="lg">
          <Link to="/community/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Community
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-6 grid grid-cols-3">
          <TabsTrigger value="communities">Your Communities</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : communities.length === 0 ? (
            <Card className="overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Communities Found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  You haven't created any communities yet. Get started by creating your first community.
                </p>
                <Button asChild>
                  <Link to="/community/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Community
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((community) => (
                <Card key={community.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl line-clamp-1">
                          {community.name}
                        </CardTitle>
                        <div className="mt-1 flex gap-1">
                          {community.is_public ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Public</Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">Private</Badge>
                          )}
                          
                          {community.type && (
                            <Badge variant="outline">{community.type}</Badge>
                          )}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/community/${community.id}/edit`}>
                              Edit Community
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => setCommunityToDelete(community)}
                          >
                            Delete Community
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {community.description || "No description provided."}
                    </p>
                    
                    <div className="space-y-2">
                      {community.location && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{community.location}</span>
                        </div>
                      )}
                      
                      {community.member_count && (
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{community.member_count} members</span>
                        </div>
                      )}
                      
                      {community.event_frequency && (
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{community.event_frequency.charAt(0).toUpperCase() + community.event_frequency.slice(1)} events</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className={cn("flex justify-between pt-3", 
                    community.target_audience && community.target_audience.length > 0 ? "border-t" : ""
                  )}>
                    <div className="flex flex-wrap gap-1">
                      {community.target_audience && community.target_audience.length > 0 ? (
                        community.target_audience.slice(0, 3).map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                      ) : null}
                      
                      {community.target_audience && community.target_audience.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{community.target_audience.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <Button asChild variant="ghost" size="sm" className="text-primary">
                      <Link to={`/community/${community.id}`}>
                        View
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="invites">
          <Card>
            <CardHeader>
              <CardTitle>Invites Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Invite management features will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Organizer Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Organizer settings will be implemented soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!communityToDelete} onOpenChange={(open) => !open && setCommunityToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Community</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-medium">{communityToDelete?.name}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setCommunityToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCommunity}>
              Delete Community
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
