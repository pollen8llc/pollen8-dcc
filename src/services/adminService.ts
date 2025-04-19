import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";

// The specific admin user ID
const ADMIN_USER_ID = "38a18dd6-4742-419b-b2c1-70dec5c51729";

/**
 * Ensures that the specific admin user has the ADMIN role in the database
 */
export const ensureAdminRole = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the ADMIN role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'ADMIN')
      .single();
    
    if (roleError) {
      console.error("Error fetching admin role:", roleError);
      return {
        success: false,
        message: roleError.message || "Failed to fetch admin role"
      };
    }
    
    // Check if the admin role exists for this user
    const { data: existingUserRole, error: queryError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', ADMIN_USER_ID)
      .eq('role_id', adminRole.id)
      .maybeSingle();
    
    if (queryError) {
      console.error("Error checking admin role:", queryError);
      return {
        success: false,
        message: queryError.message || "Failed to check admin role"
      };
    }
    
    // If the user already has the ADMIN role, no need to update
    if (existingUserRole) {
      return {
        success: true,
        message: "User already has admin privileges"
      };
    }
    
    // If the user doesn't have the role yet, insert it
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: ADMIN_USER_ID,
        role_id: adminRole.id,
        assigned_by: ADMIN_USER_ID
      });
    
    if (insertError) {
      console.error("Error setting admin role:", insertError);
      return {
        success: false,
        message: insertError.message || "Failed to set admin role"
      };
    }
    
    // For backwards compatibility, also ensure the admin_roles record exists
    // First insert then handle conflicts separately
    const { error: legacyInsertError } = await supabase
      .from('admin_roles')
      .insert({ 
        user_id: ADMIN_USER_ID,
        role: UserRole.ADMIN.toString()
      });
    
    if (legacyInsertError && legacyInsertError.code !== '23505') { // Not a unique violation
      console.error("Error setting legacy admin role:", legacyInsertError);
      // Don't return failure for legacy table
    }
    
    return {
      success: true,
      message: "Admin role has been set successfully"
    };
  } catch (error: any) {
    console.error("Unexpected error ensuring admin role:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred"
    };
  }
};

/**
 * Creates an admin user account with the provided details
 */
export const createAdminAccount = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if the user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    let userId: string;
    
    if (existingUser) {
      // User already exists, use their ID
      userId = existingUser.id;
      console.log("User already exists, using existing account:", userId);
    } else {
      // Step 1: Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: UserRole.ADMIN
          },
        },
      });

      if (signUpError) {
        console.error("Error signing up admin:", signUpError);
        return {
          success: false, 
          message: signUpError.message || "Failed to create admin account"
        };
      }

      if (!authData.user) {
        return { 
          success: false, 
          message: "User account created but no user data returned" 
        };
      }
      
      userId = authData.user.id;
    }

    // Step 2: Get the ADMIN role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'ADMIN')
      .single();
    
    if (roleError) {
      console.error("Error fetching admin role:", roleError);
      return {
        success: false,
        message: roleError.message || "Failed to fetch admin role"
      };
    }

    // Step 3: Check if the user already has this role
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role_id', adminRole.id)
      .maybeSingle();
    
    if (existingRole) {
      return {
        success: true,
        message: `User ${email} already has admin privileges`
      };
    }

    // Step 4: Insert into user_roles table
    const { error: roleAssignError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: userId,
        role_id: adminRole.id,
        assigned_by: userId
      });

    if (roleAssignError) {
      console.error("Error setting admin role:", roleAssignError);
      return {
        success: false,
        message: "Account exists but failed to set admin permissions"
      };
    }

    // For backwards compatibility, also insert into admin_roles
    // First insert then handle conflicts separately
    const { error: legacyInsertError } = await supabase
      .from('admin_roles')
      .insert({ 
        user_id: userId,
        role: UserRole.ADMIN.toString()
      });
    
    if (legacyInsertError && legacyInsertError.code !== '23505') { // Not a unique violation
      console.error("Error setting legacy admin role:", legacyInsertError);
      // Don't return failure for legacy table
    }

    return {
      success: true,
      message: `Admin account for ${email} ${existingUser ? 'updated' : 'created'} successfully`
    };
  } catch (error: any) {
    console.error("Unexpected error creating admin account:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred"
    };
  }
};

/**
 * Update a user's role
 */
export const updateUserRole = async (
  { userId, role }: { userId: string; role: UserRole }
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get the role ID for the specified role
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', role.toString())
      .single();
    
    if (roleError) {
      console.error("Error fetching role:", roleError);
      return {
        success: false,
        message: roleError.message || "Failed to fetch role"
      };
    }
    
    // Check if the user already has this role
    const { data: existingUserRole, error: checkError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role_id', roleData.id)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking existing role:", checkError);
      return {
        success: false,
        message: checkError.message || "Failed to check existing role"
      };
    }
    
    // If the user already has this role, no need to update
    if (existingUserRole) {
      return {
        success: true,
        message: "User already has this role"
      };
    }
    
    // Get the current user's ID for assigning_by
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return {
        success: false,
        message: "Authentication error: Current user not found"
      };
    }
    
    // Remove any existing roles
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) {
      console.error("Error removing existing roles:", deleteError);
      return {
        success: false,
        message: deleteError.message || "Failed to remove existing roles"
      };
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
      return {
        success: false,
        message: insertError.message || "Failed to set role"
      };
    }
    
    // For backwards compatibility, update admin_roles table if necessary
    if (role === UserRole.ADMIN) {
      // If setting to ADMIN, insert/update admin_roles
      // First try insert, if it fails with duplicate key, try separate approach
      const { error: legacyInsertError } = await supabase
        .from('admin_roles')
        .insert({ 
          user_id: userId,
          role: UserRole.ADMIN.toString()
        });
      
      if (legacyInsertError && legacyInsertError.code !== '23505') { // Not a unique violation
        console.error("Error setting legacy admin role:", legacyInsertError);
        // Don't return failure for legacy table
      }
    } else {
      // If not ADMIN, remove from admin_roles if present
      const { error: legacyDeleteError } = await supabase
        .from('admin_roles')
        .delete()
        .eq('user_id', userId);
      
      if (legacyDeleteError) {
        console.error("Error removing legacy admin role:", legacyDeleteError);
        // Don't return failure for legacy table
      }
    }
    
    return {
      success: true,
      message: `User role updated to ${UserRole[role]} successfully`
    };
  } catch (error: any) {
    console.error("Unexpected error updating user role:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred"
    };
  }
};

/**
 * Get all users with their roles
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
    
    // Get all user roles
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
    
    // For backwards compatibility, also get admin roles
    const { data: legacyAdminRoles, error: legacyError } = await supabase
      .from('admin_roles')
      .select('user_id, role');
      
    if (legacyError) {
      console.error("Error fetching legacy admin roles:", legacyError);
      // Continue without legacy roles rather than failing
    }
    
    // Get communities that users own (new model)
    const { data: ownedCommunities, error: ownedError } = await supabase
      .from('communities')
      .select('id, owner_id');
      
    if (ownedError) {
      console.error("Error fetching owned communities:", ownedError);
      // Continue without communities rather than failing
    }
    
    // Map profiles to User objects
    const users: User[] = profiles.map(profile => {
      // Find roles for this user
      const userRolesForUser = userRoles?.filter(r => r.user_id === profile.id) || [];
      
      // Check if user has admin role in new system
      const isAdmin = userRolesForUser.some(r => r.roles && r.roles.name === 'ADMIN');
      
      // Check if user has organizer role in new system
      const isOrganizer = userRolesForUser.some(r => r.roles && r.roles.name === 'ORGANIZER');
      
      // For backwards compatibility, also check legacy admin role
      const legacyAdminRole = legacyAdminRoles?.find(r => r.user_id === profile.id);
      
      // Find communities user owns
      const userOwnedCommunities = ownedCommunities?.filter(c => c.owner_id === profile.id) || [];
      
      // Get community IDs
      const communities = userOwnedCommunities.map(c => c.id);
      
      // In the new model, all communities a user is associated with are ones they manage
      const managedCommunities = communities;
      
      // Determine user's role
      let role = UserRole.MEMBER;
      
      if (isAdmin || legacyAdminRole?.role === UserRole.ADMIN.toString()) {
        role = UserRole.ADMIN;
      } else if (isOrganizer || managedCommunities.length > 0) {
        role = UserRole.ORGANIZER;
      } else if (communities.length > 0) {
        role = UserRole.MEMBER;
      }
      
      return {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
        role: role,
        imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile.email || "",
        bio: "",
        communities,
        managedCommunities
      };
    });
    
    return users;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Check if a user has admin privileges
 */
export const checkAdminStatus = async (userIdOrEmail: string): Promise<{ 
  isAdmin: boolean; 
  userId?: string; 
  message: string 
}> => {
  try {
    let userId = userIdOrEmail;
    
    // If an email was provided, find the user ID
    if (userIdOrEmail.includes('@')) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userIdOrEmail)
        .maybeSingle();
      
      if (profileError || !profile) {
        console.error("Error finding user by email:", profileError);
        return {
          isAdmin: false,
          message: `User with email ${userIdOrEmail} not found`
        };
      }
      
      userId = profile.id;
    }
    
    // Get the ADMIN role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'ADMIN')
      .single();
    
    if (roleError) {
      console.error("Error fetching admin role:", roleError);
      return {
        isAdmin: false,
        userId,
        message: roleError.message || "Failed to fetch admin role"
      };
    }
    
    // Check if user has the ADMIN role
    const { data: userRole, error: userRoleError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role_id', adminRole.id)
      .maybeSingle();
    
    if (userRoleError) {
      console.error("Error checking admin status:", userRoleError);
      return {
        isAdmin: false,
        userId,
        message: userRoleError.message || "Failed to check admin status"
      };
    }
    
    if (userRole) {
      return {
        isAdmin: true,
        userId,
        message: "User has admin privileges"
      };
    }
    
    // For backwards compatibility, also check admin_roles table
    const { data: legacyAdminRole, error: legacyError } = await supabase
      .from('admin_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', UserRole.ADMIN.toString())
      .maybeSingle();
    
    if (legacyError) {
      console.error("Error checking legacy admin status:", legacyError);
      return {
        isAdmin: false,
        userId,
        message: legacyError.message || "Failed to check legacy admin status"
      };
    }
    
    if (legacyAdminRole) {
      return {
        isAdmin: true,
        userId,
        message: "User has admin privileges (legacy)"
      };
    }
    
    return {
      isAdmin: false,
      userId,
      message: "User does not have admin privileges"
    };
  } catch (error: any) {
    console.error("Unexpected error checking admin status:", error);
    return {
      isAdmin: false,
      message: error.message || "An unexpected error occurred"
    };
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
 * Get users with a specific role
 */
export const getUsersWithRole = async (roleName: string): Promise<User[]> => {
  try {
    // Get the role ID
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .single();
      
    if (roleError) {
      console.error(`Error fetching ${roleName} role:`, roleError);
      throw roleError;
    }
    
    // Get users with this role
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select(`
        user_id
      `)
      .eq('role_id', role.id);
      
    if (userRolesError) {
      console.error(`Error fetching users with ${roleName} role:`, userRolesError);
      throw userRolesError;
    }
    
    // Get profiles for these users
    const userIds = userRoles.map(ur => ur.user_id);
    
    if (userIds.length === 0) {
      return []; // No users with this role
    }
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
      
    if (profilesError) {
      console.error(`Error fetching profiles for ${roleName} users:`, profilesError);
      throw profilesError;
    }
    
    // Transform to User objects
    const users: User[] = profiles.map(profile => {
      return {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
        role: UserRole[roleName as keyof typeof UserRole],
        imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile.email || "",
        bio: "",
        communities: [],
        managedCommunities: []
      };
    });
    
    return users;
  } catch (error: any) {
    console.error(`Error getting users with ${roleName} role:`, error);
    throw error;
  }
};

/**
 * Gets user communities - Updated to use the new ownership model
 * @param userId User ID
 */
export const getUserCommunities = async (userId: string) => {
  try {
    // Get all communities where the user is the owner
    const { data, error } = await supabase
      .from('communities')
      .select('id, name, logo_url')
      .eq('owner_id', userId);
    
    if (error) {
      console.error('Error fetching user communities:', error);
      throw error;
    }
    
    // Transform data to the expected format
    return data.map(community => ({
      ...community,
      role: 'admin' // All owned communities have admin role
    }));
  } catch (error) {
    console.error("Error in getUserCommunities:", error);
    return [];
  }
}
