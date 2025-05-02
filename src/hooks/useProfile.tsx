
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const useProfile = (session: Session | null) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch user profile from Supabase with improved error handling
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      
      // Get user profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles') 
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        if (profileError.code === 'PGRST116') {
          console.log("Profile not found, will attempt to create one");
          return null;
        }
        throw profileError;
      }

      console.log("Profile fetched:", profile);

      // Get user's role from the 'user_roles' table with better error handling
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:role_id (
            name
          )
        `)
        .eq('user_id', userId);

      if (userRolesError) {
        console.error("Error fetching user roles:", userRolesError);
        // Continue with a default role instead of throwing error
      }

      console.log("User roles fetched:", JSON.stringify(userRoles || [], null, 2));
      
      // Determine the highest role with fallback
      let role = UserRole.MEMBER; // Default role
      
      if (userRoles && userRoles.length > 0) {
        // Check for admin role
        const hasAdminRole = userRoles.some(r => {
          return r.roles && r.roles.name === 'ADMIN';
        });
        
        if (hasAdminRole) {
          role = UserRole.ADMIN;
          console.log("User has ADMIN role");
        } else {
          // Check for organizer role
          const hasOrganizerRole = userRoles.some(r => {
            return r.roles && r.roles.name === 'ORGANIZER';
          });
          
          if (hasOrganizerRole) {
            role = UserRole.ORGANIZER;
            console.log("User has ORGANIZER role");
          } else {
            console.log("User is a regular MEMBER");
          }
        }
      } else {
        console.log("No roles found, defaulting to MEMBER");
      }
      
      console.log("Determined role:", role);

      // Get user's owned communities with error handling
      let managedCommunities: string[] = [];
      try {
        const { data: ownedCommunities, error: ownedError } = await supabase
          .rpc('get_user_owned_communities', { user_id: userId });
          
        if (ownedError) {
          console.error("Error fetching owned communities:", ownedError);
        } else {
          console.log("User owned communities:", ownedCommunities || []);
          managedCommunities = ownedCommunities?.map(m => m.community_id) || [];
        }
      } catch (err) {
        console.error("Exception fetching communities:", err);
      }
      
      // In the new model, users are only members of communities they own
      const communities = managedCommunities;

      // Create user object
      const userData: User = {
        id: userId,
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User',
        role: role,
        imageUrl: profile?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile?.email || "",
        bio: profile?.bio || "", // Now using bio from profile
        communities,
        managedCommunities,
        createdAt: profile?.created_at || new Date().toISOString()
      };

      console.log("User data constructed:", userData);
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  // Create profile if it doesn't exist with improved error handling and retries
  const createProfileIfNotExists = useCallback(async (retryCount = 0) => {
    try {
      if (!session?.user) return false;
      
      const userId = session.user.id;
      console.log("Attempting to create profile for user:", userId);
      
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking for existing profile:", checkError);
        if (retryCount < 2) {
          console.log(`Retry attempt ${retryCount + 1} for checking profile existence`);
          return await createProfileIfNotExists(retryCount + 1);
        }
        return false;
      }
      
      // If profile exists, don't create a new one
      if (existingProfile) {
        console.log("Profile already exists, no need to create");
        return true;
      }
      
      // Get user email from auth user
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) {
        console.error("Could not get auth user data");
        return false;
      }
      
      // Extract name from user metadata if available
      const firstName = authUser.user.user_metadata?.first_name || '';
      const lastName = authUser.user.user_metadata?.last_name || '';
      const email = authUser.user.email || '';
      
      // Create profile with retry logic
      const createProfile = async (attempt = 0) => {
        try {
          console.log(`Creating profile, attempt ${attempt + 1}`);
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              user_id: userId,
              email: email,
              first_name: firstName,
              last_name: lastName,
              privacy_settings: { profile_visibility: "connections" },
              profile_complete: false // Mark as incomplete so the wizard will show
            })
            .select()
            .single();
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
            
            if (attempt < 2) {
              console.log("Retrying profile creation...");
              await new Promise(r => setTimeout(r, 500)); // Add delay before retry
              return createProfile(attempt + 1);
            }
            
            return false;
          }
          
          console.log("Profile created successfully:", newProfile);
          return true;
        } catch (err) {
          console.error("Exception in profile creation:", err);
          if (attempt < 2) {
            return createProfile(attempt + 1);
          }
          return false;
        }
      };
      
      return await createProfile();
      
    } catch (error) {
      console.error("Error in createProfileIfNotExists:", error);
      return false;
    }
  }, [session]);

  // Effect to update user data when session changes
  useEffect(() => {
    const updateUserData = async () => {
      setIsLoading(true);
      
      try {
        if (session && session.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (!profile) {
            // Don't set currentUser to null yet, we'll handle profile creation in useAuth
            console.log("No profile found for user");
          }
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error updating user data:", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    updateUserData();
  }, [session]);

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!session?.user) {
      setCurrentUser(null);
      return;
    }
    
    setIsLoading(true);
    console.log("Refreshing user data, session:", session);
    
    try {
      await fetchUserProfile(session.user.id);
      // Clear the role refresh flag after successful refresh
      localStorage.removeItem('should_refresh_user_role');
    } catch (error) {
      console.error("Error refreshing user data:", error);
      // Don't show toast here, we'll handle that in useAuth
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  return { 
    currentUser, 
    isLoading, 
    refreshUser, 
    fetchUserProfile, 
    createProfileIfNotExists 
  };
};
