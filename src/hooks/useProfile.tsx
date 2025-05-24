
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const useProfile = (session: Session | null) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Listen for role change events via localStorage to support cross-tab updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'should_refresh_user_role' && e.newValue === 'true') {
        console.log("Role change detected via localStorage, refreshing user data");
        refreshUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on mount if we need to refresh
    if (localStorage.getItem('should_refresh_user_role') === 'true') {
      console.log("Role refresh flag detected on mount, refreshing user data");
      refreshUser();
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fetch user profile from Supabase with improved error handling
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      setError(null);
      
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
          setError("Profile not found");
          return null;
        }
        setError(`Error fetching profile: ${profileError.message}`);
        throw profileError;
      }

      console.log("Profile fetched successfully:", profile);

      // First check if user has admin role using our non-recursive function
      let role = UserRole.MEMBER; // Default role
      
      try {
        // Get all user roles from the user_roles table
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
        } else if (userRoles && userRoles.length > 0) {
          console.log("User roles fetched:", JSON.stringify(userRoles, null, 2));
          
          // Check for admin role first (highest priority)
          const hasAdminRole = userRoles.some(r => {
            return r.roles && r.roles.name === 'ADMIN';
          });
          
          if (hasAdminRole) {
            role = UserRole.ADMIN;
            console.log("User has ADMIN role");
          } else {
            // Check for organizer role next
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
          console.log("No roles found for user, defaulting to MEMBER");
        }
      } catch (roleErr) {
        console.error("Exception in role fetching:", roleErr);
        // Continue with default role
      }
      
      // Try to get user's owned communities with error handling
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
        bio: profile?.bio || "", 
        communities,
        managedCommunities,
        createdAt: profile?.created_at || new Date().toISOString(),
        profile_complete: profile?.profile_complete || false
      };

      console.log("User data constructed successfully:", userData);
      setCurrentUser(userData);
      setError(null);
      return userData;
    } catch (error: any) {
      console.error("Error in fetchUserProfile:", error);
      setError(`Failed to load profile: ${error.message || "Unknown error"}`);
      return null;
    }
  };

  // Create profile if it doesn't exist with improved error handling and retries
  const createProfileIfNotExists = useCallback(async (retryCount = 0) => {
    try {
      if (!session?.user) {
        console.log("No session available for profile creation");
        return false;
      }
      
      const userId = session.user.id;
      console.log("Attempting to create profile for user:", userId, "retry:", retryCount);
      setError(null);
      
      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking for existing profile:", checkError);
        setError(`Error checking for profile: ${checkError.message}`);
        if (retryCount < 2) {
          console.log(`Retry attempt ${retryCount + 1} for checking profile existence`);
          await new Promise(r => setTimeout(r, 1000)); // Longer delay before retry
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
        setError("Could not get user authentication data");
        return false;
      }
      
      // Extract name from user metadata if available
      const firstName = authUser.user.user_metadata?.first_name || '';
      const lastName = authUser.user.user_metadata?.last_name || '';
      const email = authUser.user.email || '';
      
      console.log("Creating profile with data:", { userId, email, firstName, lastName });
      
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
              privacy_settings: { profile_visibility: "public" },
              profile_complete: false
            })
            .select()
            .single();
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
            setError(`Error creating profile: ${insertError.message}`);
            
            if (attempt < 2) {
              console.log("Retrying profile creation...");
              await new Promise(r => setTimeout(r, 1000));
              return createProfile(attempt + 1);
            }
            
            return false;
          }
          
          console.log("Profile created successfully:", newProfile);
          toast({
            title: "Profile created",
            description: "Your profile has been set up and is ready to customize"
          });
          return true;
        } catch (err: any) {
          console.error("Exception in profile creation:", err);
          setError(`Exception in profile creation: ${err.message || "Unknown error"}`);
          if (attempt < 2) {
            await new Promise(r => setTimeout(r, 1000));
            return createProfile(attempt + 1);
          }
          return false;
        }
      };
      
      return await createProfile();
      
    } catch (error: any) {
      console.error("Error in createProfileIfNotExists:", error);
      setError(`Error creating profile: ${error.message || "Unknown error"}`);
      return false;
    }
  }, [session, toast]);

  // Effect to update user data when session changes
  useEffect(() => {
    const updateUserData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (session && session.user) {
          console.log("Session found, fetching user profile:", session.user.id);
          const profile = await fetchUserProfile(session.user.id);
          if (!profile) {
            console.log("No profile found for user, profile creation may be needed");
            setError("No profile found for user");
          }
        } else {
          console.log("No session, clearing current user");
          setCurrentUser(null);
        }
      } catch (error: any) {
        console.error("Error updating user data:", error);
        setError(`Error updating user data: ${error.message || "Unknown error"}`);
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
      console.log("No session for refresh, clearing user");
      setCurrentUser(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    console.log("Refreshing user data for session:", session.user.id);
    
    try {
      await fetchUserProfile(session.user.id);
      // Clear the role refresh flag after successful refresh
      localStorage.removeItem('should_refresh_user_role');
    } catch (error: any) {
      console.error("Error refreshing user data:", error);
      setError(`Error refreshing user data: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  return { 
    currentUser, 
    isLoading, 
    refreshUser, 
    fetchUserProfile, 
    createProfileIfNotExists,
    error
  };
};
