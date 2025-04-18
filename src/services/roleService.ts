import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { logAuditAction } from "./auditService";

/**
 * Updates a user's role using the database function
 */
export const updateUserRole = async (
  userId: string, 
  role: UserRole
): Promise<boolean> => {
  try {
    console.log(`Starting role update for user ${userId} to ${role}`);
    
    // Call the database function to update the role
    const { data, error } = await supabase.rpc('update_user_role', {
      p_user_id: userId,
      p_role_name: role.toString(),
      p_assigner_id: null  // Will use auth.uid() in the function
    });
    
    if (error) {
      console.error("Error updating role:", error);
      throw error;
    }
    
    console.log(`Role update completed successfully for user ${userId} to ${role}`);
    return data;
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return false;
  }
};

/**
 * Get available roles
 */
export const getRoles = async () => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error("Error in getRoles:", error);
    throw error;
  }
};
