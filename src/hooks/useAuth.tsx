
import { useState, useEffect } from "react";
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

  // Log auth state for debugging
  useEffect(() => {
    console.log("Auth state:", { 
      hasSession: !!session, 
      sessionLoading, 
      hasUser: !!currentUser,
      profileLoading,
      userRole: currentUser?.role
    });
  }, [session, sessionLoading, currentUser, profileLoading]);

  // Handle auth errors
  useEffect(() => {
    if (!sessionLoading && !profileLoading && session && !currentUser) {
      console.error("Auth error: Session exists but profile could not be loaded");
    }
  }, [session, currentUser, sessionLoading, profileLoading]);

  return { 
    currentUser, 
    isLoading, 
    session, 
    refreshUser, 
    logout
  };
};
