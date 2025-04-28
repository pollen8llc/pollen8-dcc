
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { UserRole, Community } from "@/models/types";
import { Plus, Folder, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { getManagedCommunities } from "@/services/community/communityQueryService";
import { updateCommunity } from "@/services/community/communityMutationService";
import { cn } from "@/lib/utils";
import { DeleteCommunityDialog } from "@/components/community/DeleteCommunityDialog";
import { useToast } from "@/hooks/use-toast";

const DotConnectorDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [managedCommunities, setManagedCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState<Community | null>(null);
  const [updatingVisibility, setUpdatingVisibility] = useState<string | null>(null);

  const loadCommunities = () => {
    if (currentUser && [UserRole.ORGANIZER, UserRole.ADMIN].includes(currentUser.role)) {
      setLoading(true);
      getManagedCommunities(currentUser.id)
        .then((data) => setManagedCommunities(data))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadCommunities();
  }, [currentUser]);

  // Only allow ORGANIZER or ADMIN
  if (!currentUser || ![UserRole.ORGANIZER, UserRole.ADMIN].includes(currentUser.role)) {
    navigate("/");
    return null;
  }

  const handleToggleVisibility = async (community: Community) => {
    try {
      setUpdatingVisibility(community.id);
      const updatedCommunity = {
        ...community,
        is_public: !community.is_public
      };
      
      await updateCommunity(updatedCommunity);
      
      // Update local state
      setManagedCommunities(prevCommunities => 
        prevCommunities.map(c => 
          c.id === community.id ? {...c, is_public: !c.is_public} : c
        )
      );
      
      toast({
        title: "Visibility updated",
        description: `${community.name} is now ${updatedCommunity.is_public ? 'public' : 'private'}.`,
      });
    } catch (error: any) {
      console.error("Error updating community visibility:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update visibility",
      });
    } finally {
      setUpdatingVisibility(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-2 sm:px-4 py-6 max-w-5xl">
        <Card className={cn("glass dark:glass-dark px-2 py-1 md:px-4 md:py-2", "shadow-xl")}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Folder className="w-7 h-7 text-primary" />
                  Dot Connector Dashboard
                </CardTitle>
                <Separator className="my-2" />
                <div className="text-muted-foreground mt-1 mb-2 text-base">
                  Organize and manage communities – onboard new ones or edit those you've already added.
                </div>
              </div>
              <Button
                asChild
                className="gap-2 h-10 rounded-lg px-4 shadow font-semibold text-base bg-primary hover:bg-primary/90 transition-colors"
              >
                <Link to="/create-community">
                  <Plus className="h-5 w-5" />
                  Onboard New Community
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-6">
            <div className="mb-8">
              <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                Your Managed Communities
              </h3>
              <Separator />
              {loading ? (
                <div className="py-8 flex justify-center text-primary animate-pulse">
                  Loading communities...
                </div>
              ) : managedCommunities.length === 0 ? (
                <div className="py-8 text-gray-400 text-center text-base">
                  You have not onboarded any communities yet.<br />
                  Use the <span className="inline-flex items-center gap-1 font-semibold text-primary"><Plus className="w-4 h-4" />Onboard New Community</span> button above to get started!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {managedCommunities.map((community) => (
                    <Card 
                      key={community.id}
                      className="hover:shadow-lg transition-shadow border border-muted-foreground/10 group flex flex-col h-full"
                    >
                      <CardHeader className="pt-4 pb-2 px-4 flex-row items-center gap-2">
                        <div className="flex-1 flex items-center gap-2">
                          <Folder className="text-primary h-6 w-6" />
                          <span className="font-semibold text-base truncate max-w-[140px]" title={community.name}>
                            {community.name}
                          </span>
                          <span className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full",
                            community.is_public ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                              : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                          )}>
                            {community.is_public ? "Public" : "Private"}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full p-2 h-8 w-8"
                            title={community.is_public ? "Make Private" : "Make Public"}
                            onClick={() => handleToggleVisibility(community)}
                            disabled={updatingVisibility === community.id}
                          >
                            {community.is_public ? 
                              <Eye className="h-4 w-4" /> : 
                              <EyeOff className="h-4 w-4" />
                            }
                          </Button>
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="rounded-full p-2 h-8 w-8"
                            title="Edit Community"
                          >
                            <Link to={`/organizer/community/${community.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full p-2 h-8 w-8"
                            title="Delete Community"
                            onClick={() => setCommunityToDelete(community)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 py-2 px-4 flex flex-col justify-between">
                        <div className="text-sm text-muted-foreground">
                          {community.description?.substring(0, 80) || "No description"}
                          {community.description && community.description.length > 80 ? "..." : ""}
                        </div>
                        {community.location && (
                          <div className="text-xs text-gray-400 mt-3">
                            Location: <span className="text-gray-500">{community.location}</span>
                          </div>
                        )}
                      </CardContent>
                      <div className="flex justify-end pb-3 pr-4">
                        <Link
                          className="text-sm text-primary underline hover:no-underline font-medium"
                          to={`/community/${community.id}`}
                        >
                          View Community
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete Community Dialog */}
      {communityToDelete && (
        <DeleteCommunityDialog
          communityId={communityToDelete.id}
          communityName={communityToDelete.name}
          isOpen={Boolean(communityToDelete)}
          setIsOpen={(isOpen) => {
            if (!isOpen) setCommunityToDelete(null);
          }}
          onDeleted={loadCommunities}
        />
      )}
    </div>
  );
};

export default DotConnectorDashboard;
