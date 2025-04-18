
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

  // Check for initial refresh flag - this handles the case when the user's own role was changed
  useEffect(() => {
    const shouldRefresh = localStorage.getItem('should_refresh_user_role');
    if (shouldRefresh === 'true' && currentUser) {
      console.log("Initial role refresh needed...");
      
      // Force invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
      
      // Clear the flag and refresh user data
      localStorage.removeItem('should_refresh_user_role');
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
      if (event.key === 'should_refresh_user_role') {
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
