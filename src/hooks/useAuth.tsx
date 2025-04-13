
import { useState } from "react";
import { User } from "@/models/types";
import { useSession } from "./useSession";
import { useProfile } from "./useProfile";

export const useAuth = () => {
  const { session, isLoading: sessionLoading, logout } = useSession();
  const { currentUser, isLoading: profileLoading, refreshUser } = useProfile(session);
  
  // Combined loading state
  const isLoading = sessionLoading || profileLoading;

  return { 
    currentUser, 
    isLoading, 
    session, 
    refreshUser, 
    logout
  };
};
