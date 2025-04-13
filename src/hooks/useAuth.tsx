
import { useState, useCallback } from "react";
import { User } from "@/models/types";
import { useSession } from "./useSession";
import { useProfile } from "./useProfile";
import { useMockUsers } from "./useMockUsers";

export const useAuth = () => {
  // Core authentication with session management
  const { session, isLoading: sessionLoading, logout } = useSession();
  
  // Profile management with role determination
  const { 
    currentUser, 
    isLoading: profileLoading, 
    refreshUser 
  } = useProfile(session);
  
  // Mock user functionality for development/testing
  const [overrideUser, setOverrideUser] = useState<User | null>(null);
  const { setMockUser, setAdminUser } = useMockUsers(user => setOverrideUser(user));
  
  // The actual user is either the override user (if set) or the user from the profile
  const actualUser = overrideUser || currentUser;
  
  // Combined loading state
  const isLoading = sessionLoading || profileLoading;

  // Clear override user when logging out
  const handleLogout = useCallback(async () => {
    setOverrideUser(null);
    await logout();
  }, [logout]);

  return { 
    currentUser: actualUser, 
    isLoading, 
    session, 
    refreshUser, 
    logout: handleLogout, 
    setMockUser, 
    setAdminUser 
  };
};
