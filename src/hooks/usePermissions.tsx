
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
    
    // First, try to use the database function for checking permissions
    try {
      // Get the user's roles from the user_roles table
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:role_id (
            name,
            permissions
          )
        `)
        .eq('user_id', currentUser.id);
        
      if (userRolesError) {
        console.error("Error getting user roles:", userRolesError);
        // Fall back to client-side checks
      } else if (userRoles && userRoles.length > 0) {
        // Check if user has ADMIN role
        const adminRole = userRoles.find(r => r.roles && r.roles.name === 'ADMIN');
        if (adminRole) {
          console.log("User has ADMIN role from database, granting permission");
          return true;
        }
        
        // Check each role's permissions
        for (const userRole of userRoles) {
          if (userRole.roles && userRole.roles.permissions) {
            const permissions = userRole.roles.permissions as Record<string, any>;
            
            // Check for all permissions
            if (permissions && typeof permissions === 'object' && 'all' in permissions && permissions.all === true) {
              console.log("User role has 'all' permissions");
              return true;
            }
            
            // Check for resource-specific "all actions" permission
            if (permissions && typeof permissions === 'object' && 
                resource in permissions && permissions[resource] === true) {
              console.log(`User role has all permissions for resource: ${resource}`);
              return true;
            }
            
            // Check for specific resource and action
            if (permissions && typeof permissions === 'object' && 
                resource in permissions && 
                typeof permissions[resource] === 'object' && 
                action in permissions[resource] && 
                permissions[resource][action] === true) {
              console.log(`User role has specific permission for ${resource}.${action}`);
              return true;
            }
            
            // Check for array of actions
            if (permissions && typeof permissions === 'object' && 
                resource in permissions && 
                Array.isArray(permissions[resource]) && 
                permissions[resource].includes(action)) {
              console.log(`User role has ${action} in actions array for ${resource}`);
              return true;
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      // Fall back to client-side checks
    }
    
    // Fall back to the role-based check system
    console.log("Falling back to client-side role checks");
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
  const checkPermission = (resource: string, action: string): boolean => {
    if (!currentUser) return false;
    
    console.log("Sync checking permission for user:", currentUser.id, "role:", currentUser.role);
    
    // System admins have all permissions
    if (currentUser.role === UserRole.ADMIN) {
      return true;
    }
    
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
