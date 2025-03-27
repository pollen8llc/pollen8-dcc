
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/models/types";

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
    // Step 1: Sign up the user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
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

    // Step 2: Update the user's role in the profiles table
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        role: UserRole.ADMIN 
      })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error("Error updating admin role:", updateError);
      return {
        success: false,
        message: "Account created but failed to set admin permissions"
      };
    }

    return {
      success: true,
      message: `Admin account for ${email} created successfully`
    };
  } catch (error: any) {
    console.error("Unexpected error creating admin account:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred"
    };
  }
};
