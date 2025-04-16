
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
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
    // Check if the user already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (existingProfile) {
      const { toast } = useToast();
      toast({
        title: "User already exists",
        description: `A user with email ${email} already exists`,
        variant: "destructive",
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
      throw new Error(roleError.message);
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
      throw new Error(error.message);
    }
    
    if (!data.user) {
      throw new Error("Failed to create user");
    }
    
    // When the user accepts the invitation, the handle_new_user trigger will create their profile
    // We need to pre-assign their role
    const { error: roleAssignError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: data.user.id,
        role_id: roleData.id,
        assigned_by: (await supabase.auth.getUser()).data.user?.id
      });
    
    if (roleAssignError) {
      console.error("Error assigning role:", roleAssignError);
      // Continue anyway as the user was created
    }
    
    // Log the action for audit purposes
    await logAuditAction({
      action: 'invite_user',
      targetUserId: data.user.id,
      details: { email, role: role.toString() }
    });
    
    return true;
  } catch (error: any) {
    console.error("Error inviting user:", error);
    const { toast } = useToast();
    toast({
      title: "Error inviting user",
      description: error.message || "Failed to send invitation",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Initiates a password reset for a user
 */
export const resetUserPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Error resetting password:", error);
      throw new Error(error.message);
    }
    
    // Log the action for audit purposes
    await logAuditAction({
      action: 'reset_password',
      details: { email }
    });
    
    return true;
  } catch (error: any) {
    console.error("Error resetting password:", error);
    const { toast } = useToast();
    toast({
      title: "Error resetting password",
      description: error.message || "Failed to initiate password reset",
      variant: "destructive",
    });
    return false;
  }
};
