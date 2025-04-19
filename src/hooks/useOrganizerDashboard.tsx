import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as communityService from '@/services/communityService';
import { Community } from '@/models/types';
import { useUser } from '@/contexts/UserContext';
import * as auditService from '@/services/auditService';
import { usePermissions } from '@/hooks/usePermissions';

export const useOrganizerDashboard = () => {
  const [communityToDelete, setCommunityToDelete] = useState<string | null>(null);
  const [activeDeletingId, setActiveDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currentUser } = useUser();
  const { isOwner } = usePermissions(currentUser);
  
  console.log("OrganizerDashboard - Current user:", currentUser?.id, "role:", currentUser?.role);
  
  const { data: managedCommunities, isLoading, error: communitiesError, refetch } = useQuery({
    queryKey: ['managed-communities', currentUser?.id],
    queryFn: () => {
      if (!currentUser?.id) {
        console.error("Cannot fetch managed communities - user ID is missing");
        return Promise.resolve([]);
      }
      console.log("Hook: Fetching managed communities for user:", currentUser.id);
      return communityService.getManagedCommunities(currentUser.id);
    },
    enabled: !!currentUser?.id,
  });

  useEffect(() => {
    if (currentUser?.id) {
      console.log("Refreshing managed communities list on mount");
      refetch();
    }
  }, [currentUser?.id, refetch]);

  if (communitiesError) {
    console.error("Error fetching managed communities:", communitiesError);
  }

  useEffect(() => {
    console.log("Managed communities in hook:", managedCommunities);
  }, [managedCommunities]);

  const updateCommunityMutation = useMutation({
    mutationFn: (community: Community) => communityService.updateCommunity(community),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managed-communities', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
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
    mutationFn: async (communityId: string) => {
      console.log("Starting deletion process for community:", communityId);
      
      return communityService.deleteCommunity(communityId);
    },
    onMutate: (communityId) => {
      console.log("Preparing to delete community:", communityId);
      setActiveDeletingId(communityId);
      
      toast({
        title: "Deleting community...",
        description: "Please wait while we process your request.",
      });
      
      return { communityId };
    },
    onSuccess: async (_, communityId) => {
      console.log("Successfully deleted community:", communityId);
      
      queryClient.invalidateQueries({ queryKey: ['managed-communities', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      
      toast({
        title: "Community deleted",
        description: "The community has been deleted successfully.",
      });
      
      setCommunityToDelete(null);
      setActiveDeletingId(null);
    },
    onError: (error: Error) => {
      console.error("Error deleting community:", error);
      
      let errorMessage = "Failed to delete the community. Please try again.";
      
      if (error.message.includes("not the owner")) {
        errorMessage = "Only community owners can delete their communities.";
      } else if (error.message.includes("authentication required")) {
        errorMessage = "You need to be logged in to delete a community.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      setCommunityToDelete(null);
      setActiveDeletingId(null);
    },
    onSettled: () => {
      console.log("Community deletion process completed");
      setActiveDeletingId(null);
    }
  });

  const toggleCommunityVisibility = useCallback((community: Community) => {
    const updatedCommunity = {
      ...community,
      isPublic: !community.isPublic
    };
    updateCommunityMutation.mutate(updatedCommunity);
  }, [updateCommunityMutation]);

  const handleDeleteCommunity = useCallback((communityId: string) => {
    console.log("User requested to delete community:", communityId);
    if (!currentUser?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a community",
        variant: "destructive",
      });
      return;
    }
    setCommunityToDelete(communityId);
  }, [currentUser?.id, toast]);

  return {
    activeTab,
    setActiveTab,
    managedCommunities,
    isLoading,
    communitiesError,
    communityToDelete,
    setCommunityToDelete,
    toggleCommunityVisibility,
    handleDeleteCommunity,
    confirmDeleteCommunity: () => {
      if (communityToDelete) {
        deleteCommunityMutation.mutate(communityToDelete);
      }
    },
    activeDeletingId,
  };
};
