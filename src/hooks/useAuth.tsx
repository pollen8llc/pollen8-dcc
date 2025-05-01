
import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/models/types";
import { useSession } from "./useSession";
import { useProfile } from "./useProfile";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const { session, isLoading: sessionLoading, logout } = useSession();
  const { currentUser, isLoading: profileLoading, refreshUser, createProfileIfNotExists } = useProfile(session);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Combined loading state
  const isLoading = sessionLoading || profileLoading;
  
  // Use a ref to track initialization and prevent excessive logging
  const initialized = useRef(false);
  const profileCreationAttempted = useRef(false);
  const profileCompletionChecked = useRef(false);
  
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

  // Check if profile needs setup and redirect if necessary
  useEffect(() => {
    if (!sessionLoading && 
        !profileLoading && 
        currentUser && 
        !profileCompletionChecked.current && 
        window.location.pathname !== "/profile/setup") {
      
      // Get profile data to check completion status
      const checkProfileCompletion = async () => {
        try {
          // Check profile completion status from Supabase
          const { data, error } = await supabase
            .from('profiles')
            .select('profile_complete')
            .eq('id', currentUser.id)
            .single();
            
          profileCompletionChecked.current = true;
          
          if (error) {
            console.error("Error checking profile completion:", error);
            return;
          }
          
          // If profile is not complete, redirect to setup
          if (data && data.profile_complete === false) {
            console.log("Profile setup incomplete, redirecting to setup wizard");
            toast({
              title: "Complete your profile",
              description: "Please complete your profile setup to continue",
            });
            navigate("/profile/setup");
          }
        } catch (err) {
          console.error("Error in profile completion check:", err);
        }
      };
      
      checkProfileCompletion();
    }
  }, [currentUser, sessionLoading, profileLoading, navigate, toast]);
  
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
