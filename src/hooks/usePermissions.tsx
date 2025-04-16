
import { User, UserRole } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

export const usePermissions = (currentUser: User | null) => {
  // Check if user has permission for a specific action on a resource
  const hasPermission = async (resource: string, action: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (currentUser.role === UserRole.ADMIN) return true;
    
    // First, try to use the database function for checking permissions
    try {
      // Get the role ID for the current user using the highest role
      const { data: roleName, error: roleError } = await supabase
        .rpc('get_highest_role', { user_id: currentUser.id });
        
      if (roleError) {
        console.error("Error getting highest role:", roleError);
        // Fall back to client-side checks
      } else if (roleName) {
        // Get the role details
        const { data: roleDetails, error: detailsError } = await supabase
          .from('roles')
          .select('permissions')
          .eq('name', roleName)
          .single();
          
        if (!detailsError && roleDetails && roleDetails.permissions) {
          // Check if role has appropriate permissions
          const permissions = roleDetails.permissions as Record<string, any>;
          
          // Check for all permissions
          if (permissions && typeof permissions === 'object' && 'all' in permissions && permissions.all === true) {
            return true;
          }
          
          // Check for resource-specific "all actions" permission
          if (permissions && typeof permissions === 'object' && 
              resource in permissions && permissions[resource] === true) {
            return true;
          }
          
          // Check for specific resource and action
          if (permissions && typeof permissions === 'object' && 
              resource in permissions && 
              typeof permissions[resource] === 'object' && 
              action in permissions[resource] && 
              permissions[resource][action] === true) {
            return true;
          }
          
          // Check for array of actions
          if (permissions && typeof permissions === 'object' && 
              resource in permissions && 
              Array.isArray(permissions[resource]) && 
              permissions[resource].includes(action)) {
            return true;
          }
          
          // Special cases for resources with IDs (e.g. "community:123")
          if (resource.includes(':')) {
            const [resourceType, resourceId] = resource.split(':');
            
            // Community-specific permissions
            if (resourceType === 'community') {
              // For community resources, check if user is an organizer for that specific community
              // using the cached data in the user object for performance
              if (currentUser.managedCommunities?.includes(resourceId)) {
                return true;
              }
              // Regular members can only read community data
              return action === 'read';
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      // Fall back to client-side checks
    }
    
    // Fall back to the old role-based check system
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
        if (resource === 'users') {
          return action === 'read'; // Organizers can view users but not manage them
        }
        return resource === 'knowledgeBase'; // Organizers can manage knowledge base
      case UserRole.MEMBER:
        // Members can view content and participate in discussions
        return action === 'read' || resource === 'comment';
      default:
        return false;
    }
  };

  // A synchronous version of hasPermission for use in rendering components
  // This should be used when you need to quickly check basic permissions in UI
  const checkPermission = (resource: string, action: string): boolean => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (currentUser.role === UserRole.ADMIN) return true;
    
    // Basic role-based check for UI rendering
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
        if (resource === 'users') {
          return action === 'read'; // Organizers can view users but not manage them
        }
        return resource === 'knowledgeBase'; // Organizers can manage knowledge base
      case UserRole.MEMBER:
        // Members can view content and participate in discussions
        return action === 'read' || resource === 'comment';
      default:
        return false;
    }
  };

  // Check if user is an organizer for a specific community - client-side check
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

  return { hasPermission, checkPermission, isOrganizer };
};
