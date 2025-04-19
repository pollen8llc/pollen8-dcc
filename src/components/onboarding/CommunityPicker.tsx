
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAllCommunities } from "@/services/communityService";
import { joinCommunity } from "@/services/communityService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Community } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const CommunityPicker: React.FC = () => {
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser();

  const { data: communities = [], isLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      return getAllCommunities(1, 12);
    },
  });

  const joinCommunityMutation = useMutation({
    mutationFn: ({ userId, communityId }: { userId: string, communityId: string }) =>
      joinCommunity(userId, communityId),
    onSuccess: () => {
      refreshUser();
    },
    onError: (error) => {
      console.error("Error joining community:", error);
      toast({
        title: "Error joining community",
        description: "There was a problem joining the community. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggleCommunity = (communityId: string) => {
    setSelectedCommunities(prev => 
      prev.includes(communityId) 
        ? prev.filter(id => id !== communityId) 
        : [...prev, communityId]
    );
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast({
        title: "Not signed in",
        description: "You must be signed in to join communities.",
        variant: "destructive",
      });
      return;
    }

    if (selectedCommunities.length === 0) {
      toast({
        title: "No communities selected",
        description: "Please select at least one community to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Join all selected communities
      for (const communityId of selectedCommunities) {
        await joinCommunityMutation.mutateAsync({
          userId: currentUser.id,
          communityId
        });
      }

      toast({
        title: "Success!",
        description: `You've joined ${selectedCommunities.length} communities.`,
      });
      
      // Redirect to dashboard
      navigate("/");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Loading communities...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Communities to Join</CardTitle>
        <CardDescription>
          Choose communities that match your interests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {communities.map((community: Community) => (
            <div
              key={community.id}
              className="flex items-center space-x-3 border p-3 rounded-md hover:bg-accent/50 cursor-pointer"
              onClick={() => handleToggleCommunity(community.id)}
            >
              <Checkbox
                id={`community-${community.id}`}
                checked={selectedCommunities.includes(community.id)}
                onCheckedChange={() => handleToggleCommunity(community.id)}
              />
              <div className="flex items-center space-x-3 flex-1">
                <img
                  src={community.imageUrl}
                  alt={community.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{community.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {community.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/")}>
            Skip for now
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={selectedCommunities.length === 0 || joinCommunityMutation.isPending}
          >
            {joinCommunityMutation.isPending ? "Joining..." : "Join Selected Communities"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityPicker;
