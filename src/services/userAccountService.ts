
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAuditAction } from "./auditService";

/**
 * Deactivates a user account
 */
export const deactivateUser = async (userId: string): Promise<boolean> => {
  try {
    // Check that we're not deactivating the last admin
    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('user_id, roles!inner(name)')
      .eq('roles.name', 'ADMIN')
      .not('user_id', 'eq', userId);
    
    if (!adminRoles || adminRoles.length === 0) {
      const { toast } = useToast();
      toast({
        title: "Cannot deactivate user",
        description: "You cannot deactivate the last administrator account",
        variant: "destructive",
      });
      return false;
    }
    
    // Deactivate the user in auth system
    // Use the correct attribute for banning a user
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { banned: true } }
    );
    
    if (error) {
      console.error("Error deactivating user:", error);
      throw new Error(error.message);
    }
    
    // Log the action for audit purposes
    await logAuditAction({
      action: 'deactivate_user',
      targetUserId: userId
    });
    
    return true;
  } catch (error: any) {
    console.error("Error deactivating user:", error);
    const { toast } = useToast();
    toast({
      title: "Error deactivating user",
      description: error.message || "Failed to deactivate user",
      variant: "destructive",
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
