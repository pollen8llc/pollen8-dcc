
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { User } from "@/models/types";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
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
      const communities = memberData.map(m => m.community_id);
      const managedCommunities = memberData
        .filter(m => m.role === 'admin')
        .map(m => m.community_id);

      // Create user object
      setCurrentUser({
        id: userId,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
        role: adminRole?.role || (managedCommunities.length > 0 ? 'ORGANIZER' : 'MEMBER'),
        imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile.email,
        bio: "",
        communities,
        managedCommunities
      });
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      // Fall back to mock data for development
      setMockUser();
    }
  };

  // Create the mock user function for development purposes
  const setMockUser = () => {
    setCurrentUser({
      id: "25",
      name: "Jane Smith",
      role: "ORGANIZER",
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
      email: "jane@example.com",
      bio: "Community organizer and advocate for sustainable practices.",
      communities: ["7"],
      managedCommunities: ["7"]
    });
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (session && session.user) {
        await fetchUserProfile(session.user.id);
      } else {
        // Mock implementation for development
        setMockUser();
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          await fetchUserProfile(session.user.id);
        } else {
          // For development, use mock user
          setMockUser();
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        // Fall back to mock data for development
        setMockUser();
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          // Only try to fetch profile if we have a session
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setCurrentUser(null);
        }
        setIsLoading(false);
      }
    );

    fetchInitialSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Logout user
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return { currentUser, isLoading, session, refreshUser, logout };
};
