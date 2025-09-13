
import { User, UserRole } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

export const usePermissions = (currentUser: User | null) => {
  // Check if user has permission for a specific action on a resource
  const hasPermission = async (resource: string, action: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (isAdmin()) {
      return true;
    }
    
    // Service providers ONLY have access to LABR8 resources and their own profile
    if (isServiceProvider()) {
      console.log('Service provider permission check:', { resource, action, allowed: resource.startsWith('labr8') || (resource === 'profile' && action === 'read') });
      return resource.startsWith('labr8') || (resource === 'profile' && action === 'read');
    }
    
    try {
      // For community resources, check ownership
      if (resource.startsWith('community:')) {
        const communityId = resource.split(':')[1];
        if (!communityId) return false;
        
        // Check if user is the owner (creator) of the community
        const { data: isOwner } = await supabase.rpc('is_community_owner', {
          user_id: currentUser.id,
          community_id: communityId
        });
        
        // If they're the owner, they have full permissions
        if (isOwner) return true;
        
        // If they're not the owner but an organizer, they have limited permissions
        if (isOrganizer(communityId)) {
          return action === 'read' || action === 'update' || action === 'manage_members';
        }
        
        // For regular users allow read access
        return action === 'read';
      }
      
      // Handle other resource types based on role
      switch (currentUser.role) {
        case UserRole.ORGANIZER:
          return action === 'read' || resource === 'knowledgeBase';
        case UserRole.SERVICE_PROVIDER:
          return resource.startsWith('labr8') || (resource === 'profile' && action === 'read');
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
    if (isAdmin()) {
      return true;
    }
    
    // Service providers are STRICTLY restricted to LABR8 only
    if (isServiceProvider()) {
      const allowed = resource.startsWith('labr8') || (resource === 'profile' && action === 'read');
      console.log('Service provider sync permission check:', { resource, action, allowed, userRole: currentUser.role });
      return allowed;
    }
    
    // Basic role-based check for UI rendering
    switch (currentUser.role) {
      case UserRole.ADMIN:
        return true;
      case UserRole.ORGANIZER:
        if (resource.startsWith('community')) {
          const communityId = resource.split(':')[1];
          if (communityId && currentUser.managedCommunities?.includes(communityId)) {
            return true;
          }
          return action === 'read';
        }
        return resource === 'knowledgeBase' || action === 'read';
      case UserRole.SERVICE_PROVIDER:
        return resource.startsWith('labr8') || (resource === 'profile' && action === 'read');
      case UserRole.MEMBER:
        return action === 'read' || resource === 'comment';
      default:
        return false;
    }
  };

  // Helper functions for clear role checks - centralized here to avoid duplication
  const isAdmin = (): boolean => {
    const result = currentUser?.role === UserRole.ADMIN || (currentUser?.role as string) === 'ADMIN';
    console.log('isAdmin check:', { currentUser: currentUser?.id, role: currentUser?.role, result });
    return result;
  };
  
  // Check if user is an organizer (either by role OR by managing communities)
  const isOrganizer = (communityId?: string): boolean => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (isAdmin()) return true;
    
    // Check for ORGANIZER role
    if (currentUser.role === UserRole.ORGANIZER || (currentUser?.role as string) === 'ORGANIZER') return true;
    
    // If no communityId provided, check if user manages any communities
    if (!communityId) return Array.isArray(currentUser.managedCommunities) && currentUser.managedCommunities.length > 0;
    
    // Check if user manages the specific community
    return Array.isArray(currentUser.managedCommunities) && currentUser.managedCommunities.includes(communityId);
  };

  // Check if user is a service provider
  const isServiceProvider = (): boolean => {
    const result = currentUser?.role === UserRole.SERVICE_PROVIDER || (currentUser?.role as string) === 'SERVICE_PROVIDER';
    console.log('isServiceProvider check:', { currentUser: currentUser?.id, role: currentUser?.role, result });
    return result;
  };
  
  // Check if user is an owner of a specific community
  const isOwner = async (communityId: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (isAdmin()) return true;
    
    // Call the Supabase function to check ownership
    try {
      const { data: isOwner } = await supabase.rpc('is_community_owner', {
        user_id: currentUser.id,
        community_id: communityId
      });
      return !!isOwner;
    } catch (error) {
      console.error("Error checking community ownership:", error);
      return false;
    }
  };

  // Helper function to determine role badge for UI
  const getRoleBadge = () => {
    if (!currentUser) return { text: "Guest", color: "bg-gray-500 hover:bg-gray-600" };
    
    if (isAdmin()) {
      return { text: "Admin", color: "bg-purple-500 hover:bg-purple-600" };
    }
    
    if (isServiceProvider()) {
      return { text: "Service Provider", color: "bg-orange-500 hover:bg-orange-600" };
    }
    
    if (isOrganizer()) {
      return { text: "Organizer", color: "bg-blue-500 hover:bg-blue-600" };
    }
    
    if (currentUser.role === UserRole.MEMBER) {
      return { text: "Member", color: "bg-green-500 hover:bg-green-600" };
    }
    
    return { text: "Guest", color: "bg-gray-500 hover:bg-gray-600" };
  };

  // Check if service provider can access other platform areas - ALWAYS FALSE
  const canAccessMainPlatform = (): boolean => {
    if (!currentUser) return false;
    // Service providers are completely restricted from main platform
    const canAccess = currentUser.role !== UserRole.SERVICE_PROVIDER;
    console.log('canAccessMainPlatform check:', { userRole: currentUser.role, canAccess });
    return canAccess;
  };

  return { 
    hasPermission, 
    checkPermission, 
    isAdmin, 
    isOrganizer, 
    isServiceProvider,
    isOwner,
    getRoleBadge,
    canAccessMainPlatform
  };
};
