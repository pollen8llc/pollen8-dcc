
import { User, UserRole } from "@/models/types";
import { useMemo } from "react";

export const usePermissions = (currentUser: User | null) => {
  // Memoized permission check to avoid unnecessary re-renders
  const hasPermission = useMemo(() => 
    (resource: string, action: string): boolean => {
      if (!currentUser) return false;
      
      // System admins have all permissions
      if (currentUser.role === UserRole.ADMIN) return true;
      
      // For now we'll use a simple role-based check
      // Later this would be replaced with a more sophisticated permission system
      switch (currentUser.role) {
        case UserRole.ORGANIZER:
          // Organizers can manage their own communities
          return resource.startsWith('community') || resource === 'knowledgeBase';
        case UserRole.MEMBER:
          // Members can view content and participate in discussions
          return action === 'read' || resource === 'comment';
        case UserRole.GUEST:
          // Guests can only view public content
          return action === 'read' && (resource === 'public' || resource === 'auth');
        default:
          return false;
      }
    }, 
    [currentUser]
  );

  // Check if user is an organizer for a specific community
  const isOrganizer = useMemo(() => 
    (communityId?: string): boolean => {
      if (!currentUser) return false;
      
      // System admins have all permissions
      if (currentUser.role === UserRole.ADMIN) return true;
      
      // If user is not an organizer
      if (currentUser.role !== UserRole.ORGANIZER) return false;
      
      // If no communityId provided, check if user is an organizer for any community
      if (!communityId) return Boolean(currentUser.managedCommunities?.length);
      
      // Check if user is an organizer for the specific community
      return Boolean(currentUser.managedCommunities?.includes(communityId));
    },
    [currentUser]
  );

  return { hasPermission, isOrganizer };
};
