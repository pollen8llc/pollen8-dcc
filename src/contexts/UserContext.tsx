
import React, { createContext, useContext, useEffect } from "react";
import { User, UserRole } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  hasPermission: (resource: string, action: string) => boolean;
  checkPermissionAsync: (resource: string, action: string) => Promise<boolean>;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading, logout: authLogout, refreshUser } = useAuth();
  const { hasPermission, checkPermission, isOrganizer } = usePermissions(currentUser);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("UserContext rendering, current user:", currentUser?.name, "role:", currentUser?.role);
  }, [currentUser]);

  // Force refresh user data when role might have changed
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'should_refresh_user_role') {
        console.log("User role change detected, refreshing...");
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUser]);

  // Check for initial refresh flag
  useEffect(() => {
    const shouldRefresh = localStorage.getItem('should_refresh_user_role');
    if (shouldRefresh === 'true' && currentUser) {
      console.log("Initial role refresh needed...");
      localStorage.removeItem('should_refresh_user_role');
      refreshUser();
    }
  }, [currentUser, refreshUser]);

  // Wrap logout to add toast notifications
  const handleLogout = async (): Promise<void> => {
    try {
      // Clear any React Query caches
      queryClient.clear();
      
      await authLogout();
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      // Redirect to home page after logout
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      isLoading,
      hasPermission: checkPermission, // Use the sync version for UI rendering
      checkPermissionAsync: hasPermission, // Expose the async version for data operations
      isOrganizer,
      logout: handleLogout,
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
