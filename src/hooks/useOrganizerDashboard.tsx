
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as communityService from '@/services/communityService';
import { Community } from '@/models/types';
import { useUser } from '@/contexts/UserContext';

export const useOrganizerDashboard = () => {
  const [communityToDelete, setCommunityToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { currentUser } = useUser();
  
  // Add debugging to track user data
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
    enabled: !!currentUser?.id, // Only run query if we have a user ID
  });

  // When the component mounts, always try to refetch the communities
  useEffect(() => {
    if (currentUser?.id) {
      console.log("Refreshing managed communities list on mount");
      refetch();
    }
  }, [currentUser?.id, refetch]);

  // Log any errors for debugging
  if (communitiesError) {
    console.error("Error fetching managed communities:", communitiesError);
  }

  // Log the managed communities when they change
  useEffect(() => {
    console.log("Managed communities in hook:", managedCommunities);
  }, [managedCommunities]);

  const updateCommunityMutation = useMutation({
    mutationFn: (community: Community) => communityService.updateCommunity(community),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managed-communities', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['communities'] }); // Invalidate main communities list too
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
      queryClient.invalidateQueries({ queryKey: ['managed-communities', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['communities'] }); // Invalidate main communities list too
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

  const toggleCommunityVisibility = useCallback((community: Community) => {
    const updatedCommunity = {
      ...community,
      isPublic: !community.isPublic
    };
    updateCommunityMutation.mutate(updatedCommunity);
  }, [updateCommunityMutation]);

  const handleDeleteCommunity = useCallback((communityId: string) => {
    setCommunityToDelete(communityId);
  }, []);

  const confirmDeleteCommunity = useCallback(() => {
    if (communityToDelete) {
      deleteCommunityMutation.mutate(communityToDelete);
    }
  }, [communityToDelete, deleteCommunityMutation]);

  const refreshCommunities = useCallback(() => {
    console.log("Manually refreshing communities");
    refetch();
  }, [refetch]);

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
    confirmDeleteCommunity,
    refreshCommunities,
  };
};
