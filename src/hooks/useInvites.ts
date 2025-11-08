
import { useState, useCallback } from "react";
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
    maxUses?: string | number,
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
      // Convert maxUses to number if it's a string and not empty
      let maxUsesNum: number | undefined = undefined;
      
      if (maxUses !== undefined && maxUses !== "") {
        if (typeof maxUses === 'string') {
          const parsed = parseInt(maxUses, 10);
          if (!isNaN(parsed)) {
            maxUsesNum = parsed;
          }
        } else {
          maxUsesNum = maxUses as number;
        }
      }
      
      const invite = await createInvite(currentUser.id, undefined, maxUsesNum, expiresAt);

      if (invite) {
        toast({
          title: "Success",
          description: "Invite created successfully",
        });
        
        // Add the new invite to the list
        setInvites(prev => [invite, ...prev]);
        return invite;
      } else {
        throw new Error("Failed to create invite");
      }
    } catch (error) {
      console.error("Error in handleCreateInvite:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
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
  const loadUserInvites = useCallback(async (): Promise<InviteData[]> => {
    if (!currentUser) {
      return [];
    }

    setIsLoading(true);
    try {
      const loadedInvites = await getInvitesByCreator(currentUser.id);
      setInvites(Array.isArray(loadedInvites) ? loadedInvites : []);
      return Array.isArray(loadedInvites) ? loadedInvites : [];
    } catch (error) {
      console.error("Error in loadUserInvites:", error);
      toast({
        title: "Error",
        description: "Failed to load invites",
        variant: "destructive",
      });
      setInvites([]);
      throw error; // Re-throw to allow component-level error handling
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, toast]);

  /**
   * Get invite by code
   */
  const getInvite = useCallback(async (code: string): Promise<InviteData | null> => {
    if (!code) {
      console.error("No code provided to getInvite");
      return null;
    }
    
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
  }, [toast]);

  /**
   * Invalidate an invite
   */
  const handleInvalidateInvite = async (inviteId: string): Promise<boolean> => {
    if (!inviteId) {
      throw new Error("No inviteId provided");
    }
    
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
        
        return true;
      } else {
        throw new Error("Failed to invalidate invite");
      }
    } catch (error) {
      console.error("Error in handleInvalidateInvite:", error);
      throw error; // Re-throw for component-level handling
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Use an invite - for backward compatibility (deprecated)
   * Use the public microsite flow instead
   */
  const useInvite = async (code: string): Promise<string | null> => {
    console.warn("useInvite is deprecated. Use the public microsite flow at /i/:linkId instead");
    return null;
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
