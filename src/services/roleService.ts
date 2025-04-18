
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { logAuditAction } from "./auditService";

/**
 * Updates a user's role
 */
export const updateUserRole = async (
  userId: string, 
  role: UserRole
): Promise<boolean> => {
  try {
    console.log(`Starting role update for user ${userId} to ${role}`);
    
    // Get the role ID for the specified role
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role.toString())
      .single();
    
    if (roleError) {
      console.error("Error fetching role:", roleError);
      throw new Error(roleError.message);
    }
    
    if (!roleData || !roleData.id) {
      console.error(`Role '${role}' not found in database`);
      throw new Error(`Role '${role}' not found in database`);
    }
    
    console.log(`Found role ID ${roleData.id} for role ${role}`);
    
    // Get the current user's ID for assigning_by
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Authentication error: Current user not found");
    }
    
    // Begin transaction by removing existing roles
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.error("Error removing existing roles:", deleteError);
      throw new Error(deleteError.message);
    }
    
    console.log(`Deleted existing roles for user ${userId}`);
    
    // Insert the new role
    const { data: insertData, error: insertError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: userId,
        role_id: roleData.id,
        assigned_by: user.id
      })
      .select();
    
    if (insertError) {
      console.error("Error setting role:", insertError);
      throw new Error(insertError.message);
    }
    
    console.log(`Inserted new role for user ${userId}:`, insertData);
    
    // Log the action for audit purposes
    await logAuditAction({
      action: 'update_role',
      targetUserId: userId,
      details: { role: role.toString() }
    });
    
    console.log(`Role update completed successfully for user ${userId} to ${role}`);
    
    // Return success
    return true;
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
