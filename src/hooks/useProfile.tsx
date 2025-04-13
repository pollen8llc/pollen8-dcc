
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Admin user ID constant
const ADMIN_USER_ID = "38a18dd6-4742-419b-b2c1-70dec5c51729";

export const useProfile = (session: Session | null) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Helper function to determine user role based on data
  const determineUserRole = (
    adminRole: { role: string } | null,
    managedCommunities: string[]
  ): UserRole => {
    if (adminRole?.role === "ADMIN") return UserRole.ADMIN;
    if (managedCommunities.length > 0) return UserRole.ORGANIZER;
    return UserRole.MEMBER;
  };

  // Fetch user profile from Supabase with improved role determination
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log("Fetching profile for user ID:", userId);
      setIsLoading(true);
      
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      // Get user's communities and roles - checking role='admin' for organizers
      const { data: memberData, error: memberError } = await supabase
        .from('community_members')
        .select('community_id, role')
        .eq('user_id', userId);

      if (memberError) {
        console.error("Error fetching community memberships:", memberError);
        throw memberError;
      }

      // Get admin role if exists from admin_roles table
      const { data: adminRole, error: adminRoleError } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (adminRoleError) {
        console.error("Error fetching admin role:", adminRoleError);
        // Don't throw here, just log - we can still continue with other role info
      }

      // Extract communities and managed communities
      const communities = memberData?.map(m => m.community_id) || [];
      const managedCommunities = memberData
        ?.filter(m => m.role === 'admin')
        .map(m => m.community_id) || [];

      // Determine role using the helper function
      const role = determineUserRole(adminRole, managedCommunities);
      
      // Create user object
      const userData: User = {
        id: userId,
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User',
        role: role,
        imageUrl: profile?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile?.email || "user@example.com",
        bio: "", // Provide a default empty string as bio isn't in the profiles table
        communities,
        managedCommunities
      };

      console.log("User data fetched:", userData);
      setCurrentUser(userData);
      
      // Store a flag if this is the admin user
      if (userId === ADMIN_USER_ID) {
        localStorage.setItem('shouldRedirectToAdmin', 'true');
      }
      
      return userData;
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      setCurrentUser(null);
      toast({
        title: "Error loading profile",
        description: "There was a problem fetching your user profile. Please try refreshing the page.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Effect to update user data when session changes
  useEffect(() => {
    let mounted = true;
    
    const updateUserData = async () => {
      if (!session?.user) {
        if (mounted) {
          setCurrentUser(null);
          setIsLoading(false);
        }
        return;
      }
      
      try {
        setIsLoading(true);
        await fetchUserProfile(session.user.id);
      } catch (error) {
        console.error("Error updating user data:", error);
        if (mounted) {
          setCurrentUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    updateUserData();

    return () => {
      mounted = false;
    };
  }, [session, fetchUserProfile]);

  // Refresh user data - exported for manual refreshes
  const refreshUser = useCallback(async (): Promise<void> => {
    if (!session?.user) {
      setCurrentUser(null);
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Refreshing user data for:", session.user.id);
      await fetchUserProfile(session.user.id);
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast({
        title: "Error refreshing profile",
        description: "There was a problem updating your profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, fetchUserProfile, toast]);

  return { currentUser, isLoading, refreshUser, fetchUserProfile };
};
