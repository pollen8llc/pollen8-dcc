
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const initialCheckComplete = useRef(false);
  const authStateInitialized = useRef(false);
  const refreshAttempts = useRef(0);

  // Check for existing session on mount and subscribe to auth changes
  useEffect(() => {
    // Prevent multiple initializations
    if (authStateInitialized.current) return;
    authStateInitialized.current = true;
    
    console.log("Setting up auth state listener");
    setIsLoading(true);
    
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log(`Auth event: ${event}`, newSession ? "Session exists" : "No session");
        
        if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing session");
          setSession(null);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log(`Auth event: ${event}`);
          setSession(newSession);
        }
        
        // Don't set isLoading=false until we've completed the initial check
        if (initialCheckComplete.current) {
          setIsLoading(false);
        }
      }
    );
    
    // THEN check for existing session
    const fetchInitialSession = async () => {
      try {
        console.log("Initializing auth state...");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession ? "Session exists" : "No session");
        
        setSession(initialSession);
        initialCheckComplete.current = true;
      } catch (error) {
        console.error("Error fetching session:", error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialSession();

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  // Function to manually refresh the session token
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log("Manually refreshing session token...");
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        return false;
      }
      
      if (data.session) {
        console.log("Session refreshed successfully");
        setSession(data.session);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Exception in refreshSession:", error);
      return false;
    }
  }, []);

  // Logout user with improved error handling
  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log("Logging out user...");
      refreshAttempts.current = 0;
      
      // Clear all cached data first
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('app-cache-')) {
          localStorage.removeItem(key);
        }
      });
      
      localStorage.removeItem('shouldRedirectToAdmin');
      localStorage.removeItem('should_refresh_user_role');
      
      // Attempt to sign out with Supabase
      const { error } = await supabase.auth.signOut();
      
      // Even if there's an error, we'll still clear the local state
      if (error) {
        console.warn("Warning during logout:", error.message);
        // We'll continue with local cleanup even if there was an error with Supabase
      }
      
      // Always clear local session state
      setSession(null);
      
      console.log("Local user state cleared successfully");
      return Promise.resolve();
    } catch (error) {
      console.error("Error in logout function:", error);
      // We'll still resolve the promise even on error to avoid blocking the UI
      return Promise.resolve();
    }
  }, []);

  return { 
    session, 
    isLoading, 
    logout,
    refreshSession
  };
};
