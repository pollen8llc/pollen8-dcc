
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Admin user ID
const ADMIN_USER_ID = "38a18dd6-4742-419b-b2c1-70dec5c51729";

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
        return;
      }

      // Get user's communities and roles
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('community_id, role')
        .eq('user_id', userId);

      if (memberError) {
        console.error("Error fetching community memberships:", memberError);
        return;
      }

      // Get admin role if exists
      const { data: adminRole } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      // Extract communities and managed communities
      const communities = memberData?.map(m => m.community_id) || [];
      const managedCommunities = memberData
        ?.filter(m => m.role === 'admin')
        .map(m => m.community_id) || [];

      // Create user object
      const role = adminRole?.role === "ADMIN" ? UserRole.ADMIN : 
                  (managedCommunities.length > 0 ? UserRole.ORGANIZER : UserRole.MEMBER);
      
      const userData: User = {
        id: userId,
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User',
        role: role,
        imageUrl: profile?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile?.email || "user@example.com",
        bio: "", // Using an empty string as default since bio doesn't exist in the profiles table
        communities,
        managedCommunities
      };

      console.log("User data fetched:", userData);
      setCurrentUser(userData);
      
      // Store a flag if this is the admin user
      if (userId === ADMIN_USER_ID) {
        localStorage.setItem('shouldRedirectToAdmin', 'true');
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
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
        description: "There was a problem loading your profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { currentUser, isLoading: isLoading, refreshUser, fetchUserProfile };
};
