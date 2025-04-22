
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/models/types";
import { logAuditAction } from "./auditService";

/**
 * Creates an invitation for a new user
 */
export const inviteUser = async (
  email: string,
  firstName: string,
  lastName: string,
  role: UserRole
): Promise<boolean> => {
  try {
    console.log(`Starting user invitation process for ${email}`);
    
    // Check if the user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (existingProfile) {
      console.error(`A user with email ${email} already exists`);
      return false;
    }
    
    // Create a user with supabase auth (this will send an invitation email)
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        first_name: firstName,
        last_name: lastName,
        role: role.toString()
      }
    });
    
    if (error) {
      console.error("Error inviting user:", error);
      await logAuditAction({
        action: 'invite_user_failed',
        details: { 
          email, 
          error: error.message,
          role: role.toString() 
        }
      });
      return false;
    }
    
    if (!data.user) {
      console.error("No user data returned from invitation");
      await logAuditAction({
        action: 'invite_user_failed',
        details: { 
          email, 
          error: 'No user data returned',
          role: role.toString() 
        }
      });
      return false;
    }
    
    // Get the role ID for the specified role
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role.toString())
      .single();
    
    if (roleError) {
      console.error("Error fetching role:", roleError);
      await logAuditAction({
        action: 'invite_user_failed',
        targetUserId: data.user.id,
        details: { 
          email,
          error: roleError.message,
          role: role.toString() 
        }
      });
      return false;
    }
    
    // The handle_new_user trigger will create their profile
    // We just need to pre-assign their role
    const { error: roleAssignError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: data.user.id,
        role_id: roleData.id,
        assigned_by: (await supabase.auth.getUser()).data.user?.id
      });
    
    if (roleAssignError) {
      console.error("Error assigning role:", roleAssignError);
      await logAuditAction({
        action: 'invite_user_role_failed',
        targetUserId: data.user.id,
        details: { 
          email,
          error: roleAssignError.message,
          role: role.toString() 
        }
      });
      // Continue anyway as the user was created
    }
    
    // Log successful invitation
    await logAuditAction({
      action: 'invite_user_success',
      targetUserId: data.user.id,
      details: { email, role: role.toString() }
    });
    
    return true;
  } catch (error: any) {
    console.error("Error inviting user:", error);
    await logAuditAction({
      action: 'invite_user_failed',
      details: { 
        email, 
        error: error.message,
        role: role.toString() 
      }
    });
    return false;
  }
};

/**
 * Initiates a password reset for a user
 */
export const resetUserPassword = async (email: string): Promise<boolean> => {
  try {
    console.log(`Starting password reset for ${email}`);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Error resetting password:", error);
      await logAuditAction({
        action: 'reset_password_failed',
        details: { 
          email,
          error: error.message 
        }
      });
      return false;
    }
    
    // Log successful password reset initiation
    await logAuditAction({
      action: 'reset_password_initiated',
      details: { email }
    });
    
    return true;
  } catch (error: any) {
    console.error("Error resetting password:", error);
    await logAuditAction({
      action: 'reset_password_failed',
      details: { 
        email,
        error: error.message 
      }
    });
    return false;
  }
};
