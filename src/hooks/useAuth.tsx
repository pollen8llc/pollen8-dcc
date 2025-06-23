
import { useState, useEffect, useCallback, useRef } from "react";
import { User } from "@/models/types";
import { useSession } from "./useSession";
import { useProfile } from "./useProfile";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const { session, isLoading: sessionLoading, logout, refreshSession, recoverUserSession } = useSession();
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
            console.log("Profile created successfully - this was a new profile");
            await refreshUser();
            // Only show toast for actually new profiles, not existing ones
            toast({
              title: "Profile setup complete",
              description: "Your profile has been initialized",
            });
          } else {
            console.log("Profile already existed, no creation needed");
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

  // Profile completion check and service provider redirection
  useEffect(() => {
    if (sessionLoading || profileLoading || !currentUser || profileCompletionChecked.current) return;
    
    // Skip profile completion check if we're already on setup or auth pages
    const currentPath = window.location.pathname;
    if (currentPath === "/profile/setup" || currentPath === "/auth" || currentPath.startsWith("/labr8")) {
      return;
    }
    
    profileCompletionChecked.current = true;
    
    const checkProfileAndRedirect = async () => {
      try {
        console.log("Checking profile completion for user:", currentUser.id);
        
        // If user is a service provider, redirect to LABR8
        if (currentUser.role === 'SERVICE_PROVIDER') {
          const { data, error } = await supabase
            .from('profiles')
            .select('profile_complete')
            .eq('id', currentUser.id)
            .maybeSingle();
            
          if (error) {
            console.error("Error checking service provider profile:", error);
            return;
          }
          
          if (!data || data.profile_complete === false) {
            console.log("Service provider profile incomplete, redirecting to LAB-R8 setup");
            navigate("/labr8/setup");
          } else {
            console.log("Service provider profile complete, redirecting to LAB-R8 dashboard");
            navigate("/labr8/dashboard");
          }
          return;
        }
        
        // For non-service providers, check profile completion
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
    
    checkProfileAndRedirect();
  }, [currentUser, sessionLoading, profileLoading, navigate, toast]);

  return { 
    currentUser, 
    isLoading, 
    session, 
    refreshUser, 
    logout,
    recoverUserSession
  };
};
