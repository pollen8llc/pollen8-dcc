
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
  recoverUserSession: () => Promise<boolean>;
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

  // Add automatic session recovery if we detect UI state issues
  useEffect(() => {
    // Check if we have a situation where currentUser is null but localStorage has JWT
    // This indicates a potential token refresh failure
    const checkForBrokenAuthState = () => {
      if (!isLoading && !currentUser) {
        try {
          const hasLocalStorageAuth = localStorage.getItem('sb-oltcuwvgdzszxshpfnre-auth') !== null;
          
          if (hasLocalStorageAuth) {
            console.log("Detected potential auth state mismatch - local storage has auth data but no user state");
            
            // Only attempt recovery once by setting a flag
            const hasAttemptedRecovery = sessionStorage.getItem('auth_recovery_attempted');
            
            if (!hasAttemptedRecovery) {
              sessionStorage.setItem('auth_recovery_attempted', 'true');
              
              // Add slight delay before attempting recovery to avoid race conditions
              setTimeout(() => {
                recoverUserSession().then(success => {
                  if (!success) {
                    console.log("Auto-recovery failed, user may need to log out and back in");
                  }
                });
              }, 2000);
            }
          }
        } catch (err) {
          // LocalStorage might be unavailable in some environments
          console.error("Error checking local storage auth:", err);
        }
      } else if (currentUser) {
        // Clear recovery attempted flag when we have a user
        sessionStorage.removeItem('auth_recovery_attempted');
      }
    };
    
    // Run once after initial loading completes
    if (!isLoading) {
      checkForBrokenAuthState();
    }
  }, [isLoading, currentUser, recoverUserSession]);

  // Wrap logout to add toast notifications and handle errors better
  const handleLogout = async (): Promise<void> => {
    try {
      // Clear any React Query caches
      queryClient.clear();
      
      // Remove auth recovery attempt flag
      sessionStorage.removeItem('auth_recovery_attempted');
      
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
    recoverUserSession
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
