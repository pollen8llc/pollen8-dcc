
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session } from "@supabase/supabase-js";

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Create the mock user function here for development purposes
  const setMockUser = () => {
    setCurrentUser({
      id: "25",
      name: "Jane Smith",
      role: UserRole.ORGANIZER,
      imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
      email: "jane@example.com",
      bio: "Community organizer and advocate for sustainable practices.",
      communities: ["7"],
      managedCommunities: ["7"]
    });
  };

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

      // Extract communities and managed communities
      const communities = memberData.map(m => m.community_id);
      const managedCommunities = memberData
        .filter(m => m.role === 'admin')
        .map(m => m.community_id);

      // Create user object
      setCurrentUser({
        id: userId,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
        role: managedCommunities.length > 0 ? UserRole.ORGANIZER : UserRole.MEMBER,
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

  // Check if user has permission for a specific action on a resource
  const hasPermission = (resource: string, action: string): boolean => {
    if (!currentUser) return false;
    
    // System admins have all permissions
    if (currentUser.role === UserRole.ADMIN) return true;
    
    // For now we'll use a simple role-based check
    // Later this would be replaced with a more sophisticated permission system
    switch (currentUser.role) {
      case UserRole.ORGANIZER:
        // Organizers can manage their own communities
        return resource.startsWith('community') || resource === 'knowledgeBase';
      case UserRole.MEMBER:
        // Members can view content and participate in discussions
        return action === 'read' || resource === 'comment';
      default:
        return false;
    }
  };

  // Check if user is an organizer for a specific community
  const isOrganizer = (communityId?: string): boolean => {
    if (!currentUser || currentUser.role !== UserRole.ORGANIZER) return false;
    
    // If no communityId provided, check if user is an organizer for any community
    if (!communityId) return currentUser.managedCommunities?.length > 0 || false;
    
    // Check if user is an organizer for the specific community
    return currentUser.managedCommunities?.includes(communityId) || false;
  };

  // Logout user
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setSession(null);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    }
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

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      isLoading, 
      hasPermission, 
      isOrganizer,
      logout,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
