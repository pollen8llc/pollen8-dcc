
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";

// The specific admin user ID
const ADMIN_USER_ID = "38a18dd6-4742-419b-b2c1-70dec5c51729";

/**
 * Ensures that the specific admin user has the ADMIN role in the database
 */
export const ensureAdminRole = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if the admin role exists for this user
    const { data: existingRole, error: queryError } = await supabase
      .from('admin_roles')
      .select('id, role')
      .eq('user_id', ADMIN_USER_ID)
      .maybeSingle();
    
    if (queryError) {
      console.error("Error checking admin role:", queryError);
      return {
        success: false,
        message: queryError.message || "Failed to check admin role"
      };
    }
    
    // If the user already has the ADMIN role, no need to update
    if (existingRole && existingRole.role === UserRole.ADMIN.toString()) {
      return {
        success: true,
        message: "User already has admin privileges"
      };
    }
    
    // If the user has a different role, update it to ADMIN
    if (existingRole) {
      const { error: updateError } = await supabase
        .from('admin_roles')
        .update({ role: UserRole.ADMIN.toString() })
        .eq('id', existingRole.id);
      
      if (updateError) {
        console.error("Error updating role:", updateError);
        return {
          success: false,
          message: updateError.message || "Failed to update to admin role"
        };
      }
    } else {
      // If the user doesn't have any role yet, insert a new ADMIN role
      const { error: insertError } = await supabase
        .from('admin_roles')
        .insert({ 
          user_id: ADMIN_USER_ID,
          role: UserRole.ADMIN.toString()
        });
      
      if (insertError) {
        console.error("Error setting admin role:", insertError);
        return {
          success: false,
          message: insertError.message || "Failed to set admin role"
        };
      }
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

    // Step 2: Check if the user already has an admin role
    const { data: existingRole } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', UserRole.ADMIN.toString())
      .maybeSingle();
    
    if (existingRole) {
      return {
        success: true,
        message: `User ${email} already has admin privileges`
      };
    }

    // Step 3: Insert a record in the admin_roles table
    const { error: roleError } = await supabase
      .from('admin_roles')
      .insert({ 
        user_id: userId,
        role: UserRole.ADMIN.toString()
      });

    if (roleError) {
      console.error("Error setting admin role:", roleError);
      return {
        success: false,
        message: "Account exists but failed to set admin permissions"
      };
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
    // First check if the user already has this role
    const { data: existingRole, error: queryError } = await supabase
      .from('admin_roles')
      .select('id, role')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (queryError) {
      console.error("Error checking existing role:", queryError);
      return {
        success: false,
        message: queryError.message || "Failed to check existing role"
      };
    }
    
    // If the user already has the same role, no need to update
    if (existingRole && existingRole.role === role.toString()) {
      return {
        success: true,
        message: "User already has this role"
      };
    }
    
    // If the user has a different role, update it
    if (existingRole) {
      const { error: updateError } = await supabase
        .from('admin_roles')
        .update({ role: role.toString() })
        .eq('id', existingRole.id);
      
      if (updateError) {
        console.error("Error updating role:", updateError);
        return {
          success: false,
          message: updateError.message || "Failed to update role"
        };
      }
    } else {
      // If the user doesn't have any role yet, insert a new one
      const { error: insertError } = await supabase
        .from('admin_roles')
        .insert({ 
          user_id: userId,
          role: role.toString()
        });
      
      if (insertError) {
        console.error("Error setting role:", insertError);
        return {
          success: false,
          message: insertError.message || "Failed to set role"
        };
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
    
    // Get all admin roles
    const { data: roles, error: rolesError } = await supabase
      .from('admin_roles')
      .select('*');
      
    if (rolesError) {
      console.error("Error fetching admin roles:", rolesError);
      throw new Error(rolesError.message);
    }
    
    // Map profiles to User objects
    const users: User[] = profiles.map(profile => {
      // Find role for this user
      const userRole = roles?.find(r => r.user_id === profile.id);
      let role = UserRole.MEMBER; // Default role
      
      if (userRole) {
        if (userRole.role === UserRole.ADMIN.toString()) {
          role = UserRole.ADMIN;
        } else if (userRole.role === UserRole.ORGANIZER.toString()) {
          role = UserRole.ORGANIZER;
        }
      }
      
      return {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
        role: role,
        imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile.email || "",
        bio: "",
        communities: [],
        managedCommunities: []
      };
    });
    
    return users;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
