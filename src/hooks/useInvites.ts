
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { 
  createInvite, 
  getInvitesByCreator, 
  getInviteByCode, 
  invalidateInvite, 
  recordInviteUse, 
  InviteData 
} from "@/services/inviteService";

export const useInvites = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [invites, setInvites] = useState<InviteData[]>([]);
  const [currentInvite, setCurrentInvite] = useState<InviteData | null>(null);
  const { currentUser } = useUser();
  const { toast } = useToast();

  /**
   * Create a new invite
   */
  const handleCreateInvite = async (
    communityId?: string,
    maxUses?: string | number,  // Accept either string or number
    expiresAt?: string
  ): Promise<InviteData | null> => {
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create invites",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      // Convert maxUses to number if it's a string
      const maxUsesNum = maxUses !== undefined ? 
        (typeof maxUses === 'string' ? parseInt(maxUses, 10) || undefined : maxUses) : 
        undefined;
        
      const invite = await createInvite(currentUser.id, communityId, maxUsesNum, expiresAt);

      if (invite) {
        toast({
          title: "Success",
          description: "Invite created successfully",
        });
        
        // Add the new invite to the list
        setInvites(prev => [invite, ...prev]);
        return invite;
      } else {
        toast({
          title: "Error",
          description: "Failed to create invite",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("Error in handleCreateInvite:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load invites created by the current user
   */
  const loadUserInvites = async (): Promise<InviteData[]> => {
    if (!currentUser) {
      return [];
    }

    setIsLoading(true);
    try {
      const loadedInvites = await getInvitesByCreator(currentUser.id);
      setInvites(loadedInvites);
      return loadedInvites;
    } catch (error) {
      console.error("Error in loadUserInvites:", error);
      toast({
        title: "Error",
        description: "Failed to load invites",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get invite by code
   */
  const getInvite = async (code: string): Promise<InviteData | null> => {
    setIsLoading(true);
    try {
      const invite = await getInviteByCode(code);
      setCurrentInvite(invite);
      return invite;
    } catch (error) {
      console.error("Error in getInvite:", error);
      toast({
        title: "Error",
        description: "Failed to get invite",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Invalidate an invite
   */
  const handleInvalidateInvite = async (inviteId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await invalidateInvite(inviteId);
      
      if (success) {
        // Update the local state to reflect the change
        setInvites(prev => 
          prev.map(invite => 
            invite.id === inviteId 
              ? { ...invite, is_active: false } 
              : invite
          )
        );
        
        toast({
          title: "Success",
          description: "Invite invalidated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to invalidate invite",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error in handleInvalidateInvite:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Use an invite - meant for onboarding process
   */
  const useInvite = async (code: string): Promise<string | null> => {
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to use invites",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const inviteId = await recordInviteUse(code, currentUser.id);
      
      if (inviteId) {
        toast({
          title: "Success",
          description: "Invite used successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid or expired invite",
          variant: "destructive",
        });
      }
      
      return inviteId;
    } catch (error) {
      console.error("Error in useInvite:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    invites,
    currentInvite,
    createInvite: handleCreateInvite,
    getInvitesByCreator: loadUserInvites,
    getInviteByCode: getInvite,
    invalidateInvite: handleInvalidateInvite,
    useInvite,
  };
};
