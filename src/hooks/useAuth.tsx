
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { User, UserRole } from "@/models/types";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  // Admin user ID
  const ADMIN_USER_ID = "38a18dd6-4742-419b-b2c1-70dec5c51729";

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
      const communities = memberData.map(m => m.community_id);
      const managedCommunities = memberData
        .filter(m => m.role === 'admin')
        .map(m => m.community_id);

      // Create user object - Fix: Convert string role to UserRole enum value
      const userData = {
        id: userId,
        name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User',
        role: adminRole?.role === "ADMIN" ? UserRole.ADMIN : 
              (managedCommunities.length > 0 ? UserRole.ORGANIZER : UserRole.MEMBER),
        imageUrl: profile?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: profile?.email || "user@example.com",
        bio: "", // Using an empty string as default since bio doesn't exist in the profiles table
        communities,
        managedCommunities
      };

      console.log("User data fetched:", userData);
      setCurrentUser(userData);
      
      // Redirect admin user to dashboard after login
      if (userId === ADMIN_USER_ID) {
        setTimeout(() => {
          navigate('/admin');
        }, 0);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  // Create the mock user function for development purposes - will only be used if explicitly called
  const setMockUser = () => {
    console.log("Setting mock user");
    setCurrentUser({
      id: "25",
      name: "Jane Smith",
      role: UserRole.ORGANIZER, // Fix: Use enum value instead of string
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
      email: "jane@example.com",
      bio: "Community organizer and advocate for sustainable practices.",
      communities: ["7"],
      managedCommunities: ["7"]
    });
  };
  
  // Set specific admin user for testing
  const setAdminUser = () => {
    console.log("Setting admin user");
    setCurrentUser({
      id: ADMIN_USER_ID,
      name: "Admin User",
      role: UserRole.ADMIN,
      imageUrl: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
      email: "admin@example.com",
      bio: "System administrator",
      communities: [],
      managedCommunities: []
    });
    navigate('/admin');
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    setIsLoading(true);
    console.log("Refreshing user data, session:", session);
    
    try {
      if (session && session.user) {
        await fetchUserProfile(session.user.id);
      } else {
        // Do not set mock user automatically
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

  // Check for existing session on mount
  useEffect(() => {
    const fetchInitialSession = async () => {
      setIsLoading(true);
      console.log("Initializing auth state...");
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session ? "Session exists" : "No session");
        
        if (session) {
          setSession(session);
          await fetchUserProfile(session.user.id);
        } else {
          // Do not set a mock user, leave as null to show logged out state
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        // Do not fall back to mock data
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session ? "Has session" : "No session");
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

  return { currentUser, isLoading, session, refreshUser, logout, setMockUser, setAdminUser };
};
