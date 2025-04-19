
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2, Shield } from "lucide-react";
import { Community } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

interface CommunitiesListProps {
  isLoading: boolean;
  managedCommunities: Community[] | undefined;
  onDeleteCommunity: (id: string) => void;
  isDeletingId?: string | null;
}

const CommunitiesList = ({ 
  isLoading, 
  managedCommunities, 
  onDeleteCommunity, 
  isDeletingId 
}: CommunitiesListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [communityOwnership, setCommunityOwnership] = useState<Record<string, boolean>>({});

  // Check ownership status for each community when the component loads
  useEffect(() => {
    const checkOwnership = async () => {
      if (!managedCommunities || !currentUser?.id) return;
      
      const ownershipStatus: Record<string, boolean> = {};
      
      for (const community of managedCommunities) {
        try {
          const { data: isOwner } = await supabase.rpc('is_community_owner', {
            user_id: currentUser.id,
            community_id: community.id
          });
          ownershipStatus[community.id] = !!isOwner;
        } catch (error) {
          console.error(`Error checking ownership for community ${community.id}:`, error);
          ownershipStatus[community.id] = false;
        }
      }
      
      setCommunityOwnership(ownershipStatus);
    };
    
    checkOwnership();
  }, [managedCommunities, currentUser?.id]);

  const handleDeleteAttempt = (communityId: string) => {
    if (!communityOwnership[communityId]) {
      toast({
        title: "Permission denied",
        description: "Only community owners can delete communities. You are an organizer but not the owner of this community.",
        variant: "destructive"
      });
      return;
    }
    
    onDeleteCommunity(communityId);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!managedCommunities?.length) {
    return (
      <div className="col-span-full text-center py-8">
        <p className="text-muted-foreground mb-4">You haven't created any communities yet</p>
        <Button 
          onClick={() => navigate("/create-community")}
          variant="outline"
        >
          Create Your First Community
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {managedCommunities.map((community) => (
        <Card 
          key={community.id}
          className="hover:shadow-md transition-all"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{community.name}</CardTitle>
              {communityOwnership[community.id] && (
                <div className="flex items-center text-xs text-emerald-600 font-medium">
                  <Shield className="h-3 w-3 mr-1" />
                  Owner
                </div>
              )}
            </div>
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
                onClick={() => handleDeleteAttempt(community.id)}
                disabled={isDeletingId === community.id || !communityOwnership[community.id]}
                title={!communityOwnership[community.id] ? "Only community owners can delete communities" : "Delete this community"}
              >
                {isDeletingId === community.id ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-1" />
                )}
                {isDeletingId === community.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommunitiesList;
