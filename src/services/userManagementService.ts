
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { toast } from "@/hooks/use-toast";

/**
 * Fetches all users with their roles and community information
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw new Error(profilesError.message);
    }
    
    // Get all user roles using the new roles system
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role_id,
        roles:role_id (
          name
        )
      `);
      
    if (rolesError) {
      console.error("Error fetching user roles:", rolesError);
      throw new Error(rolesError.message);
    }
    
    // Get community memberships for finding managed communities
    const { data: memberships, error: membershipError } = await supabase
      .from('community_members')
      .select('user_id, community_id, role');
      
    if (membershipError) {
      console.error("Error fetching community memberships:", membershipError);
      throw new Error(membershipError.message);
    }
    
    // Map profiles to User objects
    const users: User[] = profiles.map(profile => {
      // Find roles for this user
      const userRolesForUser = userRoles?.filter(r => r.user_id === profile.id) || [];
      
      // Check if user has admin role
      const isAdmin = userRolesForUser.some(r => r.roles && r.roles.name === 'ADMIN');
      
      // Check if user has organizer role
      const isOrganizer = userRolesForUser.some(r => r.roles && r.roles.name === 'ORGANIZER');
      
      // Find user's community memberships
      const userMemberships = memberships?.filter(m => m.user_id === profile.id) || [];
      
      // Get communities user is a member of
      const communities = userMemberships.map(m => m.community_id);
      
      // Get communities user manages
      const managedCommunities = userMemberships
        .filter(m => m.role === 'admin')
        .map(m => m.community_id);
      
      // Determine user's role based on the new role system
      let role = UserRole.MEMBER;
      
      if (isAdmin) {
        role = UserRole.ADMIN;
      } else if (isOrganizer || managedCommunities.length > 0) {
        role = UserRole.ORGANIZER;
      } else if (communities.length > 0) {
        role = UserRole.MEMBER;
      } else {
        role = UserRole.GUEST;
      }
      
      return {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
        role: role,
        imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile.email || "",
        bio: "",
        communities,
        managedCommunities,
        createdAt: profile.created_at
      };
    });
    
    return users;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    toast({
      title: "Error loading users",
      description: error.message || "Failed to load user data",
      variant: "destructive",
    });
    throw error;
  }
};

/**
 * Updates a user's role
 */
export const updateUserRole = async (
  userId: string, 
  role: UserRole
): Promise<boolean> => {
  try {
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
    
    // Insert the new role
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: userId,
        role_id: roleData.id,
        assigned_by: user.id
      });
    
    if (insertError) {
      console.error("Error setting role:", insertError);
      throw new Error(insertError.message);
    }
    
    // Log the action for audit purposes
    await logAuditAction({
      action: 'update_role',
      targetUserId: userId,
      details: { role: role.toString() }
    });
    
    // Return success
    return true;
  } catch (error: any) {
    console.error("Error updating user role:", error);
    toast({
      title: "Error updating role",
      description: error.message || "Failed to update user role",
      variant: "destructive",
    });
    return false;
  }
};

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
    toast({
      title: "Error inviting user",
      description: error.message || "Failed to send invitation",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Deactivates a user account
 */
export const deactivateUser = async (userId: string): Promise<boolean> => {
  try {
    // Check that we're not deactivating the last admin
    const { data: adminCount } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('roles.name', 'ADMIN')
      .not('user_id', 'eq', userId)
      .count();
    
    if (adminCount && adminCount.count === 0) {
      toast({
        title: "Cannot deactivate user",
        description: "You cannot deactivate the last administrator account",
        variant: "destructive",
      });
      return false;
    }
    
    // Deactivate the user in auth system
    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { banned: true }
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
    toast({
      title: "Error deactivating user",
      description: error.message || "Failed to deactivate user",
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
    toast({
      title: "Error resetting password",
      description: error.message || "Failed to initiate password reset",
      variant: "destructive",
    });
    return false;
  }
};

interface AuditLogEntry {
  action: string;
  targetUserId?: string;
  details?: Record<string, any>;
}

/**
 * Logs an audit action for tracking changes
 */
const logAuditAction = async (entry: AuditLogEntry): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Cannot log audit action: User not authenticated");
      return;
    }
    
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        action: entry.action,
        performed_by: user.id,
        target_user_id: entry.targetUserId,
        details: entry.details || {},
      });
    
    if (error) {
      console.error("Error logging audit action:", error);
    }
  } catch (error) {
    console.error("Error in audit logging:", error);
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

/**
 * Get user communities
 */
export const getUserCommunities = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        community_id,
        role,
        communities:community_id (
          id,
          name,
          logo_url
        )
      `)
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error fetching user communities:", error);
      throw error;
    }
    
    return data.map(membership => ({
      ...membership.communities,
      role: membership.role
    }));
  } catch (error: any) {
    console.error("Error in getUserCommunities:", error);
    throw error;
  }
};
