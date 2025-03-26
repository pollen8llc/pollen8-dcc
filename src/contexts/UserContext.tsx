
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Once we have authentication set up, we'll fetch the full user profile here
          // For now, we're using a placeholder user for development
          setMockUser();
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // TEMPORARY: Set a mock user for development
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

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          // When auth is set up, we'll fetch the user profile here
          setMockUser();
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
    if (!communityId) return true;
    
    // Check if user is an organizer for the specific community
    return currentUser.managedCommunities?.includes(communityId) || false;
  };

  // Logout user
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
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
    // This would fetch the latest user data from the database
    // For now, we'll just use the mock implementation
    setIsLoading(true);
    try {
      // Mock implementation
      setMockUser();
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
