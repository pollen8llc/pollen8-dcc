
import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/models/types";
import { useSession } from "./useSession";
import { useProfile } from "./useProfile";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
  const { session, isLoading: sessionLoading, logout } = useSession();
  const { currentUser, isLoading: profileLoading, refreshUser } = useProfile(session);
  const { toast } = useToast();
  
  // Combined loading state
  const isLoading = sessionLoading || profileLoading;
  
  // Use a ref to track initialization and prevent excessive logging
  const initialized = useRef(false);
  
  // Log auth state for debugging, but only when it changes
  useEffect(() => {
    if (!initialized.current) {
      console.log("Auth state initialized:", { 
        hasSession: !!session, 
        sessionLoading, 
        hasUser: !!currentUser,
        profileLoading,
        userRole: currentUser?.role
      });
      initialized.current = true;
    }
  }, [session, sessionLoading, currentUser, profileLoading]);

  // Handle auth errors
  useEffect(() => {
    if (!sessionLoading && !profileLoading && session && !currentUser) {
      console.error("Auth error: Session exists but profile could not be loaded");
    }
  }, [session, currentUser, sessionLoading, profileLoading]);

  // Wrap refreshUser to prevent excessive re-renders
  const memoizedRefreshUser = useCallback(async () => {
    return await refreshUser();
  }, [refreshUser]);

  return { 
    currentUser, 
    isLoading, 
    session, 
    refreshUser: memoizedRefreshUser, 
    logout
  };
};
