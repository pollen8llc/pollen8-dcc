
import { User, UserRole } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

export const usePermissions = (currentUser: User | null) => {
  // Check if user has permission for a specific action on a resource
  const hasPermission = async (resource: string, action: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    console.log("Checking permission for user:", currentUser.id, "role:", currentUser.role);
    
    // System admins have all permissions
    if (currentUser.role === UserRole.ADMIN) {
      console.log("User is ADMIN, granting permission");
      return true;
    }
    
    try {
      // For community resources, check ownership
      if (resource.startsWith('community:')) {
        const communityId = resource.split(':')[1];
        if (!communityId) return false;
        
        const { data: isOwner } = await supabase.rpc('is_community_owner', {
          user_id: currentUser.id,
          community_id: communityId
        });
        
        return isOwner || action === 'read';
      }
      
      // Handle other resource types based on role
      switch (currentUser.role) {
        case UserRole.ORGANIZER:
          return action === 'read' || resource === 'knowledgeBase';
        case UserRole.MEMBER:
          return action === 'read' || resource === 'comment';
        default:
          return false;
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      return false;
    }
  };

  // A synchronous version of hasPermission for use in rendering components
  const checkPermission = (resource: string, action: string): boolean => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (currentUser.role === UserRole.ADMIN) {
      return true;
    }
    
    // Basic role-based check for UI rendering
    switch (currentUser.role) {
      case UserRole.ORGANIZER:
        if (resource.startsWith('community')) {
          const communityId = resource.split(':')[1];
          if (communityId && currentUser.managedCommunities?.includes(communityId)) {
            return true;
          }
          return action === 'read';
        }
        return resource === 'knowledgeBase' || action === 'read';
      case UserRole.MEMBER:
        return action === 'read' || resource === 'comment';
      default:
        return false;
    }
  };

  // Check if user is an owner of a specific community
  const isOrganizer = (communityId?: string): boolean => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (currentUser.role === UserRole.ADMIN) return true;
    
    // If no communityId provided, check if user owns any communities
    if (!communityId) return currentUser.managedCommunities?.length > 0 || false;
    
    // Check if user owns the specific community
    return currentUser.managedCommunities?.includes(communityId) || false;
  };

  return { hasPermission, checkPermission, isOrganizer };
};
