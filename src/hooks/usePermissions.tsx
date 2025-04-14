
import { User, UserRole } from "@/models/types";

export const usePermissions = (currentUser: User | null) => {
  // Check if user has permission for a specific action on a resource
  const hasPermission = (resource: string, action: string): boolean => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (currentUser.role === UserRole.ADMIN) return true;
    
    // For now we'll use a simple role-based check
    // Later this would be replaced with a more sophisticated permission system
    switch (currentUser.role) {
      case UserRole.ORGANIZER:
        // Organizers can manage their own communities
        if (resource.startsWith('community')) {
          // For community resources, check if user is an organizer for that specific community
          const communityId = resource.split(':')[1]; // Format: 'community:123'
          if (communityId && !currentUser.managedCommunities?.includes(communityId)) {
            return action === 'read'; // Can only read communities they don't manage
          }
          // Can perform any action on communities they manage
          return true;
        }
        return resource === 'knowledgeBase'; // Organizers can manage knowledge base
      case UserRole.MEMBER:
        // Members can view content and participate in discussions
        return action === 'read' || resource === 'comment';
      default:
        return false;
    }
  };

  // Check if user is an organizer for a specific community
  const isOrganizer = (communityId?: string): boolean => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (currentUser.role === UserRole.ADMIN) return true;
    
    // If user is not an organizer
    if (currentUser.role !== UserRole.ORGANIZER) return false;
    
    // If no communityId provided, check if user is an organizer for any community
    if (!communityId) return currentUser.managedCommunities?.length > 0 || false;
    
    // Check if user is an organizer for the specific community
    return currentUser.managedCommunities?.includes(communityId) || false;
  };

  return { hasPermission, isOrganizer };
};
