
import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/models/types";
import { useSession } from "./useSession";
import { useProfile } from "./useProfile";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const { session, isLoading: sessionLoading, logout, refreshSession } = useSession();
  const { currentUser, isLoading: profileLoading, refreshUser, createProfileIfNotExists } = useProfile(session);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Combined loading state
  const isLoading = sessionLoading || profileLoading;
  
  // Use a ref to track initialization and prevent excessive logging
  const initialized = useRef(false);
  const profileCreationAttempted = useRef(false);
  const profileCompletionChecked = useRef(false);
  const authErrorShown = useRef(false);
  const recoveryAttempted = useRef(false);
  
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

  // Auto-create profile if session exists but profile doesn't with improved error handling
  useEffect(() => {
    const checkAndCreateProfile = async () => {
      // Only run if we have a session but no profile, and haven't tried to create one yet
      if (!sessionLoading && !profileLoading && session && !currentUser && !profileCreationAttempted.current) {
        console.log("Auth error: Session exists but profile could not be loaded, attempting to create profile");
        profileCreationAttempted.current = true;
        
        try {
          // Try to create profile with multiple retries if needed
          const created = await createProfileIfNotExists();
          if (created) {
            console.log("Profile created successfully");
            await refreshUser();
            
            // Reset auth error flag since we succeeded
            authErrorShown.current = false;
            
            // Show success toast
            toast({
              title: "Profile created",
              description: "Your profile has been set up successfully",
            });
          } else {
            console.error("Failed to create profile automatically");
            
            if (!authErrorShown.current) {
              authErrorShown.current = true;
              toast({
                title: "Profile Setup Issue",
                description: "We couldn't set up your profile automatically. Please try logging out and back in.",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Error creating profile:", error);
          
          if (!authErrorShown.current) {
            authErrorShown.current = true;
            toast({
              title: "Authentication Error",
              description: "There was a problem setting up your profile. Please try logging out and back in.",
              variant: "destructive",
            });
          }
        }
      }
    };
    
    checkAndCreateProfile();
  }, [session, currentUser, sessionLoading, profileLoading, createProfileIfNotExists, refreshUser, toast]);

  // Add recovery mechanism for session/auth issues
  useEffect(() => {
    // If we have a session but can't load the user after multiple attempts, try recovery
    if (!sessionLoading && session && !currentUser && profileCreationAttempted.current && 
        !recoveryAttempted.current && !authErrorShown.current) {
      recoveryAttempted.current = true;
      
      // Auto-attempt recovery of session
      const attemptRecovery = async () => {
        console.log("Attempting automatic session recovery...");
        
        try {
          // Try refreshing the session first
          const refreshSuccess = await refreshSession();
          
          if (refreshSuccess) {
            console.log("Session refreshed successfully, attempting to reload user");
            // Wait a moment for refresh to complete
            setTimeout(async () => {
              await refreshUser();
            }, 500);
          } else {
            console.warn("Session refresh failed, recovery unsuccessful");
            authErrorShown.current = true;
            toast({
              title: "Session issue detected",
              description: "We're having trouble loading your profile. Try refreshing the page or logging out and back in.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error during automatic recovery:", error);
        }
      };
      
      // Wait a bit before trying recovery to avoid race conditions
      setTimeout(attemptRecovery, 1000);
    }
  }, [session, currentUser, sessionLoading, profileLoading, toast, refreshUser, refreshSession]);

  // Check if profile needs setup and redirect if necessary with improved error handling
  useEffect(() => {
    if (sessionLoading || profileLoading) return;
    
    // If there's a session but no user, we've already tried to create a profile and failed
    if (session && !currentUser && profileCreationAttempted.current) {
      console.error("Auth error: Session exists but profile could not be loaded even after creation attempt");
      
      if (!authErrorShown.current) {
        authErrorShown.current = true;
        toast({
          title: "Authentication Error",
          description: "There was a problem loading your profile. Please try logging out and back in.",
          variant: "destructive",
        });
      }
      return;
    }
    
    // Skip profile completion check if we're already on the setup page
    if (window.location.pathname === "/profile/setup") {
      return;
    }
    
    // If we have a user, check if their profile needs setup
    if (currentUser && !profileCompletionChecked.current) {
      const checkProfileCompletion = async () => {
        try {
          console.log("Checking profile completion status for user:", currentUser.id);
          
          // Fetch directly from profiles table with better error handling
          const { data, error } = await supabase
            .from('profiles')
            .select('profile_complete, first_name, last_name')
            .eq('id', currentUser.id)
            .maybeSingle();
            
          profileCompletionChecked.current = true;
          
          if (error) {
            console.error("Error checking profile completion:", error);
            return;
          }
          
          console.log("Profile completion data:", data);
          
          // If profile is not complete, or missing required fields, redirect to setup
          const needsSetup = 
            !data || 
            data.profile_complete === false || 
            !data.first_name ||
            !data.last_name;
            
          if (needsSetup) {
            console.log("Profile setup incomplete, redirecting to setup wizard");
            toast({
              title: "Complete your profile",
              description: "Please complete your profile setup to continue",
            });
            navigate("/profile/setup");
          } else {
            console.log("Profile is complete, no redirection needed");
          }
        } catch (err) {
          console.error("Error in profile completion check:", err);
          // Don't show an error toast here to avoid overwhelming the user
        }
      };
      
      checkProfileCompletion();
    }
  }, [currentUser, sessionLoading, profileLoading, navigate, toast, session]);
  
  // Wrap refreshUser to prevent excessive re-renders
  const memoizedRefreshUser = useCallback(async () => {
    return await refreshUser();
  }, [refreshUser]);
  
  // Add a recovery function for authentication errors
  const recoverUserSession = useCallback(async () => {
    try {
      console.log("Attempting to recover user session");
      
      // Clear flags to allow retrying profile creation and checks
      profileCreationAttempted.current = false;
      profileCompletionChecked.current = false;
      authErrorShown.current = false;
      recoveryAttempted.current = false;
      
      // Refresh the session
      const refreshSuccess = await refreshSession();
      
      if (!refreshSuccess) {
        console.error("Error refreshing session during recovery");
        throw new Error("Failed to refresh session");
      }
      
      // Reset user state
      await refreshUser();
      
      toast({
        title: "Session recovered",
        description: "Your session has been successfully restored",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to recover session:", error);
      
      toast({
        title: "Recovery failed",
        description: "Please try logging out and back in to resolve the issue",
        variant: "destructive",
      });
      
      return false;
    }
  }, [refreshUser, refreshSession, toast]);

  return { 
    currentUser, 
    isLoading, 
    session, 
    refreshUser: memoizedRefreshUser, 
    logout,
    recoverUserSession
  };
};
