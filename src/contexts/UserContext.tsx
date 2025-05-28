
import React, { createContext, useContext, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import { useProfile } from '@/hooks/useProfile';
import { User } from '@/models/types';
import { usePermissions } from '@/hooks/usePermissions';

interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  recoverUserSession: () => Promise<boolean>;
  isAdmin: () => boolean;
  isOrganizer: (communityId?: string) => boolean;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  isLoading: true,
  logout: async () => {},
  refreshUser: async () => {},
  recoverUserSession: async () => false,
  isAdmin: () => false,
  isOrganizer: () => false
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading: sessionLoading, logout, recoverUserSession } = useSession();
  const { 
    currentUser, 
    isLoading: profileLoading, 
    refreshUser, 
    createProfileIfNotExists 
  } = useProfile(session);

  const { isAdmin, isOrganizer } = usePermissions(currentUser);

  // Create profile if it doesn't exist yet
  React.useEffect(() => {
    if (session && !profileLoading && !currentUser) {
      console.log("Session exists but no profile found, attempting to create");
      createProfileIfNotExists().catch(error => {
        console.error("Failed to create profile:", error);
      });
    }
  }, [session, currentUser, profileLoading, createProfileIfNotExists]);

  // Listen for role change events via localStorage
  React.useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'should_refresh_user_role' && e.newValue === 'true' && currentUser) {
        console.log("Role change detected via localStorage, refreshing user data");
        refreshUser().catch(error => {
          console.error("Failed to refresh user:", error);
        });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentUser, refreshUser]);

  const isLoading = sessionLoading || profileLoading;

  return (
    <UserContext.Provider value={{ 
      currentUser, 
      isLoading,
      logout,
      refreshUser,
      recoverUserSession,
      isAdmin,
      isOrganizer
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
