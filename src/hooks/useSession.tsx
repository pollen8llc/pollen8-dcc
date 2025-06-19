
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

  // Check for existing session on mount and subscribe to auth changes
  useEffect(() => {
    // Prevent multiple initializations
    if (authStateInitialized.current) return;
    authStateInitialized.current = true;
    
    console.log("Initializing session management");
    setIsLoading(true);
    
    // Set up auth state listener FIRST
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
        
        // Set loading to false after initial check
        if (initialCheckComplete.current) {
          setIsLoading(false);
        }
      }
    );
    
    // THEN check for existing session
    const fetchInitialSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession ? "Session found" : "No session");
        
        setSession(initialSession);
        initialCheckComplete.current = true;
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching initial session:", error);
        setSession(null);
        setIsLoading(false);
      }
    };

    fetchInitialSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  // Function to manually refresh the session token
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log("Refreshing session token...");
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

  // Recovery function for manual use
  const recoverUserSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log("Attempting to recover user session");
      
      const refreshSuccess = await refreshSession();
      
      if (refreshSuccess) {
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
  }, [refreshSession, toast]);

  // Logout user with improved error handling
  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log("Logging out user...");
      
      // Clear all cached data first
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('app-cache-')) {
          localStorage.removeItem(key);
        }
      });
      
      localStorage.removeItem('shouldRedirectToAdmin');
      localStorage.removeItem('should_refresh_user_role');
      
      // Sign out with Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.warn("Warning during logout:", error.message);
      }
      
      // Clear local session state
      setSession(null);
      
      console.log("Logout completed");
    } catch (error) {
      console.error("Error in logout function:", error);
      // Still clear local state even on error
      setSession(null);
    }
  }, []);

  return { 
    session, 
    isLoading, 
    logout,
    refreshSession,
    recoverUserSession
  };
};
