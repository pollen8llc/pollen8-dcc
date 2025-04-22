
import { supabase } from "@/integrations/supabase/client";
import { logAuditAction } from "./auditService";

/**
 * Deactivates a user account
 */
export const deactivateUser = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Starting user deactivation for ${userId}`);
    
    // Check that we're not deactivating the last admin
    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('user_id, roles!inner(name)')
      .eq('roles.name', 'ADMIN')
      .not('user_id', 'eq', userId);
    
    if (!adminRoles || adminRoles.length === 0) {
      console.error("Cannot deactivate the last administrator account");
      await logAuditAction({
        action: 'deactivate_user_failed',
        targetUserId: userId,
        details: { error: 'Cannot deactivate last admin' }
      });
      return false;
    }
    
    // Deactivate the user in auth system
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { banned: true } }
    );
    
    if (error) {
      console.error("Error deactivating user:", error);
      await logAuditAction({
        action: 'deactivate_user_failed',
        targetUserId: userId,
        details: { error: error.message }
      });
      return false;
    }
    
    // Log successful deactivation
    await logAuditAction({
      action: 'deactivate_user_success',
      targetUserId: userId
    });
    
    return true;
  } catch (error: any) {
    console.error("Error deactivating user:", error);
    await logAuditAction({
      action: 'deactivate_user_failed',
      targetUserId: userId,
      details: { error: error.message }
    });
    return false;
  }
};

/**
 * Get user communities
 */
export const getUserCommunities = async (userId: string) => {
  try {
    // With our new model, we get communities that the user owns
    const { data, error } = await supabase
      .from('communities')
      .select(`
        id,
        name,
        logo_url
      `)
      .eq('owner_id', userId);
      
    if (error) {
      console.error("Error fetching user communities:", error);
      throw error;
    }
    
    return data.map(community => ({
      ...community,
      role: 'admin' // In the new model, all user communities are owned/admin
    }));
  } catch (error: any) {
    console.error("Error in getUserCommunities:", error);
    throw error;
  }
};
