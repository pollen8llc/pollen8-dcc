
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import * as communityService from '@/services/communityService';
import { Community } from '@/models/types';

export const useOrganizerDashboard = () => {
  const [communityToDelete, setCommunityToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: managedCommunities, isLoading } = useQuery({
    queryKey: ['managed-communities'],
    queryFn: () => communityService.getManagedCommunities(""),
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

  return {
    activeTab,
    setActiveTab,
    managedCommunities,
    isLoading,
    communityToDelete,
    setCommunityToDelete,
    toggleCommunityVisibility,
    handleDeleteCommunity,
    confirmDeleteCommunity,
  };
};
