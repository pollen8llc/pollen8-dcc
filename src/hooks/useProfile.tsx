
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
      
      // Get profile data
      const { data: profile, error: profileError } = await supabase
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
            
            profile = newProfile;
          } else {
            throw new Error("Cannot create profile: User data not available");
          }
        } else {
          throw profileError;
        }
      }

      console.log("Profile fetched:", profile);

      // Get user's communities and roles
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('community_id, role')
        .eq('user_id', userId);

      if (memberError) {
        console.error("Error fetching community memberships:", memberError);
        // Continue with empty memberships rather than failing
        memberData = [];
      }

      // Get admin role if exists
      const { data: adminRole, error: adminError } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (adminError) {
        console.error("Error fetching admin role:", adminError);
        // Continue with no admin role rather than failing
      }

      console.log("Admin role fetched:", adminRole);

      // Extract communities and managed communities
      const communities = memberData?.map(m => m.community_id) || [];
      const managedCommunities = memberData
        ?.filter(m => m.role === 'admin')
        .map(m => m.community_id) || [];

      // Create user object - determine role based on database information
      let role = UserRole.MEMBER;
      
      // Role determination logic:
      // 1. Check if user is in admin_roles table
      if (adminRole?.role === "ADMIN") {
        role = UserRole.ADMIN;
      }
      // 2. If not admin, check if user manages any communities
      else if (managedCommunities.length > 0) {
        role = UserRole.ORGANIZER;
      }
      // 3. If not admin or organizer, but has communities, they're a member
      else if (communities.length > 0) {
        role = UserRole.MEMBER;
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
