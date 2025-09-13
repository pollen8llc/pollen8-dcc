
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

  // Listen for role change events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'should_refresh_user_role' && e.newValue === 'true') {
        console.log("Role change detected, refreshing user data");
        refreshUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    if (localStorage.getItem('should_refresh_user_role') === 'true') {
      console.log("Role refresh flag detected on mount");
      refreshUser();
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fetch user profile with simplified approach
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      setError(null);
      
      // Get user profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles') 
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError(`Error fetching profile: ${profileError.message}`);
        return null;
      }

      if (!profile) {
        console.log("Profile not found for user:", userId);
        setError("Profile not found");
        return null;
      }

      console.log("Profile fetched successfully:", profile);

      // Get user role using the user_roles system
      let role = UserRole.MEMBER; // Default role
      
      try {
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
          console.log("User roles fetched:", userRoles);
          
          // Check for admin role first
          const hasAdminRole = userRoles.some(r => r.roles && r.roles.name === 'ADMIN');
          if (hasAdminRole) {
            role = UserRole.ADMIN;
            console.log("User has ADMIN role");
          } else {
            // Check for service provider role
            const hasServiceProviderRole = userRoles.some(r => 
              r.roles && r.roles.name === 'SERVICE_PROVIDER'
            );
            if (hasServiceProviderRole) {
              role = UserRole.SERVICE_PROVIDER;
              console.log("User has SERVICE_PROVIDER role");
            } else {
              // Check for organizer role
              const hasOrganizerRole = userRoles.some(r => r.roles && r.roles.name === 'ORGANIZER');
              if (hasOrganizerRole) {
                role = UserRole.ORGANIZER;
                console.log("User has ORGANIZER role");
              }
            }
          }
        } else {
          console.log("No roles found for user, defaulting to MEMBER");
        }
      } catch (roleErr) {
        console.error("Exception in role fetching:", roleErr);
      }
      
      // Get managed communities (simplified)
      let managedCommunities: string[] = [];
      try {
        const { data: ownedCommunities, error: ownedError } = await supabase
          .rpc('get_user_owned_communities', { user_id: userId });
          
        if (ownedError) {
          console.error("Error fetching owned communities:", ownedError);
        } else {
          managedCommunities = ownedCommunities?.map(m => m.community_id) || [];
        }
      } catch (err) {
        console.error("Exception fetching communities:", err);
      }
      
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
        profile_complete: profile?.profile_complete || profile?.is_profile_complete || false,
        labr8_setup_complete: profile?.labr8_setup_complete || false,
        modul8_setup_complete: profile?.modul8_setup_complete || false
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

  // Create profile with simplified retry logic
  const createProfileIfNotExists = useCallback(async () => {
    try {
      if (!session?.user) {
        console.log("No session available for profile creation");
        return false;
      }
      
      const userId = session.user.id;
      console.log("Checking/creating profile for user:", userId);
      setError(null);
      
      // Check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking for existing profile:", checkError);
        setError(`Error checking for profile: ${checkError.message}`);
        return false;
      }
      
      if (existingProfile) {
        console.log("Profile already exists, no creation needed");
        return false; // Return false to indicate no new profile was created
      }
      
      // Get user email from auth
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser?.user) {
        console.error("Could not get auth user data");
        setError("Could not get user authentication data");
        return false;
      }
      
      const firstName = authUser.user.user_metadata?.first_name || '';
      const lastName = authUser.user.user_metadata?.last_name || '';
      const email = authUser.user.email || '';
      
      console.log("Creating new profile with data:", { userId, email, firstName, lastName });
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
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
        return false;
      }
      
      console.log("Profile created successfully:", newProfile);
      return true; // Return true to indicate a new profile was created
    } catch (error: any) {
      console.error("Error in createProfileIfNotExists:", error);
      setError(`Error creating profile: ${error.message || "Unknown error"}`);
      return false;
    }
  }, [session]);

  // Effect to update user data when session changes
  useEffect(() => {
    const updateUserData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (session && session.user) {
          console.log("Session found, fetching user profile:", session.user.id);
          await fetchUserProfile(session.user.id);
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
