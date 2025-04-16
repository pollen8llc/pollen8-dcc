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
        .from('profiles')
        .select('*')
        .eq('id', userId)
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

      // Get user's communities from community_members table
      let { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('community_id, role')
        .eq('user_id', userId);

      if (memberError) {
        console.error("Error fetching community memberships:", memberError);
        // Continue with empty memberships rather than failing
        memberData = [];
      }

      // Get user's roles from the new role system
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:role_id (
            name
          )
        `)
        .eq('user_id', userId);

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        // Continue without roles rather than failing
      }

      // Get highest role using our new database function
      const { data: highestRole, error: highestRoleError } = await supabase
        .rpc('get_highest_role', { user_id: userId });
        
      if (highestRoleError) {
        console.error("Error fetching highest role:", highestRoleError);
        // Fall back to old method
      }

      console.log("User roles fetched:", userRoles);
      console.log("Highest role:", highestRole);

      // Extract communities and managed communities
      const communities = memberData?.map(m => m.community_id) || [];
      const managedCommunities = memberData
        ?.filter(m => m.role === 'admin')
        .map(m => m.community_id) || [];

      // Create user object - determine role based on database information
      let role = UserRole.MEMBER;
      
      // Role determination logic:
      // 1. Use the new highest_role function if available
      if (highestRole) {
        role = UserRole[highestRole as keyof typeof UserRole];
        console.log("Using highest role from function:", role);
      }
      // 2. Fallback: determine from user_roles table
      else if (userRoles && userRoles.length > 0) {
        // Check for ADMIN role first
        const adminRole = userRoles.find(r => r.roles.name === 'ADMIN');
        if (adminRole) {
          role = UserRole.ADMIN;
          console.log("User has ADMIN role from user_roles table");
        }
        // Then check for ORGANIZER
        else if (userRoles.find(r => r.roles.name === 'ORGANIZER')) {
          role = UserRole.ORGANIZER;
          console.log("User has ORGANIZER role from user_roles table");
        }
        // Then check for MEMBER
        else if (userRoles.find(r => r.roles.name === 'MEMBER')) {
          role = UserRole.MEMBER;
          console.log("User has MEMBER role from user_roles table");
        }
      }
      // 3. Fallback: old method
      else {
        // Legacy compatibility for admin_roles table
        const { data: adminRole } = await supabase
          .from('admin_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();

        if (adminRole?.role === "ADMIN") {
          role = UserRole.ADMIN;
          console.log("User has ADMIN role from admin_roles table (legacy)");
        }
        // If not admin, check if user manages any communities
        else if (managedCommunities.length > 0) {
          role = UserRole.ORGANIZER;
        }
        // If not admin or organizer, but has communities, they're a member
        else if (communities.length > 0) {
          role = UserRole.MEMBER;
        }
      }
      
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
