
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
  
  // Use refs to prevent infinite loops
  const profileCreationAttempted = useRef(false);
  const profileCompletionChecked = useRef(false);
  const maxRetries = useRef(2);
  const retryCount = useRef(0);
  
  console.log("Auth state:", { 
    hasSession: !!session, 
    sessionLoading, 
    hasUser: !!currentUser,
    profileLoading,
    userRole: currentUser?.role
  });

  // Reset flags when session changes
  useEffect(() => {
    if (session?.access_token) {
      retryCount.current = 0;
      profileCreationAttempted.current = false;
      profileCompletionChecked.current = false;
    }
  }, [session?.access_token]);

  // Auto-create profile if needed - simplified approach
  useEffect(() => {
    const createProfileIfNeeded = async () => {
      // Only attempt if we have session but no user and haven't tried yet
      if (!sessionLoading && !profileLoading && session && !currentUser && !profileCreationAttempted.current) {
        if (retryCount.current >= maxRetries.current) {
          console.warn("Max profile creation attempts reached");
          return;
        }
        
        profileCreationAttempted.current = true;
        retryCount.current += 1;
        
        console.log("Attempting to create profile, attempt:", retryCount.current);
        
        try {
          const created = await createProfileIfNotExists();
          if (created) {
            console.log("Profile created successfully");
            await refreshUser();
            toast({
              title: "Profile setup complete",
              description: "Your profile has been initialized",
            });
          }
        } catch (error) {
          console.error("Error creating profile:", error);
          if (retryCount.current >= maxRetries.current) {
            toast({
              title: "Profile Setup Issue",
              description: "Please try refreshing the page or logging out and back in.",
              variant: "destructive",
            });
          }
        }
      }
    };
    
    createProfileIfNeeded();
  }, [session, currentUser, sessionLoading, profileLoading, createProfileIfNotExists, refreshUser, toast]);

  // Profile completion check - simplified
  useEffect(() => {
    if (sessionLoading || profileLoading || !currentUser || profileCompletionChecked.current) return;
    
    // Skip if we're already on the setup page
    if (window.location.pathname === "/profile/setup") {
      return;
    }
    
    profileCompletionChecked.current = true;
    
    const checkProfileCompletion = async () => {
      try {
        console.log("Checking profile completion for user:", currentUser.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('profile_complete, first_name, last_name')
          .eq('id', currentUser.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error checking profile completion:", error);
          return;
        }
        
        console.log("Profile completion data:", data);
        
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
        }
      } catch (err) {
        console.error("Error in profile completion check:", err);
      }
    };
    
    checkProfileCompletion();
  }, [currentUser, sessionLoading, profileLoading, navigate, toast]);
  
  // Recovery function for manual use
  const recoverUserSession = useCallback(async () => {
    try {
      console.log("Attempting to recover user session");
      
      // Reset all flags
      profileCreationAttempted.current = false;
      profileCompletionChecked.current = false;
      retryCount.current = 0;
      
      const refreshSuccess = await refreshSession();
      
      if (refreshSuccess) {
        await refreshUser();
        toast({
          title: "Session recovered",
          description: "Your session has been successfully restored",
        });
        return true;
      } else {
        throw new Error("Failed to refresh session");
      }
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
    refreshUser, 
    logout,
    recoverUserSession
  };
};
