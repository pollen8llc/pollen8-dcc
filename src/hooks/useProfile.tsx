
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const useProfile = (session: Session | null) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      
      // Use let instead of const to allow reassignment
      let { data: profile, error: profileError } = await supabase
        .from('profiles') // Using the correct profiles table
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        // Check if profile doesn't exist
        if (profileError.code === 'PGRST116') {
          console.log("Profile not found, creating new profile");
          // Attempt to create a profile
          const authUser = await supabase.auth.getUser();
          if (authUser.data?.user) {
            const { data: newProfile, error: createError } = await supabase.from('profiles').insert({
              id: userId,
              email: authUser.data.user.email,
              first_name: authUser.data.user.user_metadata?.first_name || '',
              last_name: authUser.data.user.user_metadata?.last_name || ''
            }).select('*').single();
            
            if (createError) {
              console.error("Error creating profile:", createError);
              throw createError;
            }
            
            // Reassign profile to newProfile
            profile = newProfile;
          } else {
            throw new Error("Cannot create profile: User data not available");
          }
        } else {
          throw profileError;
        }
      }

      console.log("Profile fetched:", profile);

      // Get user's role from the 'user_roles' table
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
        throw userRolesError;
      }

      console.log("User roles fetched:", JSON.stringify(userRoles, null, 2));
      
      // Determine the highest role
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

      // Get user's owned communities
      const { data: ownedCommunities, error: ownedError } = await supabase
        .rpc('get_user_owned_communities', { user_id: userId });
        
      if (ownedError) {
        console.error("Error fetching owned communities:", ownedError);
        throw ownedError;
      }
      
      console.log("User owned communities:", ownedCommunities);

      const managedCommunities = ownedCommunities?.map(m => m.community_id) || [];
      // In the new model, users are only members of communities they own
      const communities = managedCommunities;

      // Create user object
      const userData: User = {
        id: userId,
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User',
        role: role,
        imageUrl: profile?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile?.email || "",
        bio: "", // Default empty string as bio is not in the profiles table
        communities,
        managedCommunities,
        createdAt: profile?.created_at || new Date().toISOString()
      };

      console.log("User data constructed:", userData);
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      throw error;
    }
  };

  // Effect to update user data when session changes
  useEffect(() => {
    const updateUserData = async () => {
      setIsLoading(true);
      
      try {
        if (session && session.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error updating user data:", error);
        setCurrentUser(null);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile data. Please try logging out and in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    updateUserData();
  }, [session]);

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    setIsLoading(true);
    console.log("Refreshing user data, session:", session);
    
    try {
      if (session && session.user) {
        await fetchUserProfile(session.user.id);
        // Clear the role refresh flag after successful refresh
        localStorage.removeItem('should_refresh_user_role');
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast({
        title: "Error refreshing profile",
        description: "There was a problem loading your profile data. Please try logging out and in again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { currentUser, isLoading, refreshUser, fetchUserProfile };
};
