
import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/models/types";
import { useSession } from "./useSession";
import { useProfile } from "./useProfile";
import { useToast } from "@/hooks/use-toast";

export const useAuth = () => {
  const { session, isLoading: sessionLoading, logout } = useSession();
  const { currentUser, isLoading: profileLoading, refreshUser, createProfileIfNotExists } = useProfile(session);
  const { toast } = useToast();
  
  // Combined loading state
  const isLoading = sessionLoading || profileLoading;
  
  // Use a ref to track initialization and prevent excessive logging
  const initialized = useRef(false);
  const profileCreationAttempted = useRef(false);
  
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

  // Auto-create profile if session exists but profile doesn't
  useEffect(() => {
    const checkAndCreateProfile = async () => {
      // Only run if we have a session but no profile, and haven't tried to create one yet
      if (!sessionLoading && !profileLoading && session && !currentUser && !profileCreationAttempted.current) {
        console.log("Auth error: Session exists but profile could not be loaded, attempting to create profile");
        profileCreationAttempted.current = true;
        
        try {
          const created = await createProfileIfNotExists();
          if (created) {
            console.log("Profile created successfully");
            await refreshUser();
          } else {
            console.error("Failed to create profile automatically");
          }
        } catch (error) {
          console.error("Error creating profile:", error);
        }
      }
    };
    
    checkAndCreateProfile();
  }, [session, currentUser, sessionLoading, profileLoading, createProfileIfNotExists, refreshUser]);

  // Handle auth errors
  useEffect(() => {
    if (!sessionLoading && !profileLoading && session && !currentUser && profileCreationAttempted.current) {
      console.error("Auth error: Session exists but profile could not be loaded even after creation attempt");
      
      // Show toast only once
      toast({
        title: "Authentication Error",
        description: "There was a problem loading your profile. Please try logging out and back in.",
        variant: "destructive",
      });
    }
  }, [session, currentUser, sessionLoading, profileLoading, toast]);

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
