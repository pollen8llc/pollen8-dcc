import React, { createContext, useContext, useEffect, useMemo } from "react";
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
  recoverUserSession: () => Promise<boolean>; // Added missing function type
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isLoading, logout: authLogout, refreshUser, recoverUserSession } = useAuth();
  const { hasPermission, checkPermission, isOrganizer } = usePermissions(currentUser);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check for initial refresh flag - this handles the case when the user's own role was changed
  useEffect(() => {
    const shouldRefresh = localStorage.getItem('should_refresh_user_role');
    if (shouldRefresh === 'true' && currentUser) {
      console.log("Initial role refresh needed...");
      
      // Clear the flag FIRST to prevent infinite loops
      localStorage.removeItem('should_refresh_user_role');
      
      // Force invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      
      // Refresh user data
      refreshUser().then(() => {
        // Show toast notification about role change
        toast({
          title: "Role updated",
          description: "Your user role has been updated. Some functionality may be different.",
        });
      }).catch(error => {
        console.error("Error refreshing user after role change:", error);
      });
    }
  }, [currentUser, refreshUser, toast, queryClient]);

  // Force refresh user data when role might have changed
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'should_refresh_user_role' && event.newValue === 'true') {
        // Clear the flag FIRST to prevent infinite loops
        localStorage.removeItem('should_refresh_user_role');
        
        console.log("User role change detected, refreshing...");
        
        // Force invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
        
        // Refresh the user data
        refreshUser().then(() => {
          // Show toast notification about role change
          toast({
            title: "Role updated",
            description: "Your user role has been updated. Some functionality may be different.",
          });
        }).catch(error => {
          console.error("Error refreshing user after role change:", error);
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUser, toast, queryClient]);

  // Wrap logout to add toast notifications and handle errors better
  const handleLogout = async (): Promise<void> => {
    try {
      // Clear any React Query caches
      queryClient.clear();
      
      // Call the auth logout function
      await authLogout();
      
      // Show success toast
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      
      // Redirect to auth page after logout
      navigate("/auth");
    } catch (error) {
      console.error("Error during logout:", error);
      
      // Still show logout success since we're cleaning local state anyway
      toast({
        title: "Logged out",
        description: "You have been logged out of your account",
      });
      
      // Still redirect to auth page
      navigate("/auth");
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currentUser, 
    isLoading,
    hasPermission: checkPermission, // Use the sync version for UI rendering
    checkPermissionAsync: hasPermission, // Expose the async version for data operations
    isOrganizer,
    logout: handleLogout,
    refreshUser,
    recoverUserSession // Add the recover function to the context value
  }), [currentUser, isLoading, checkPermission, hasPermission, isOrganizer, handleLogout, refreshUser, recoverUserSession]);

  return (
    <UserContext.Provider value={contextValue}>
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
