
import { useState } from "react";
import { User } from "@/models/types";
import { useSession } from "./useSession";
import { useProfile } from "./useProfile";
import { useMockUsers } from "./useMockUsers";

export const useAuth = () => {
  const { session, isLoading: sessionLoading, logout } = useSession();
  const { currentUser, isLoading: profileLoading, refreshUser } = useProfile(session);
  const { setMockUser, setAdminUser } = useMockUsers(user => setOverrideUser(user));
  
  // This state allows us to override the current user (for mock users)
  const [overrideUser, setOverrideUser] = useState<User | null>(null);
  
  // The actual user is either the override user (if set) or the user from the profile
  const actualUser = overrideUser || currentUser;
  
  // Combined loading state
  const isLoading = sessionLoading || profileLoading;

  return { 
    currentUser: actualUser, 
    isLoading, 
    session, 
    refreshUser, 
    logout, 
    setMockUser, 
    setAdminUser 
  };
};
