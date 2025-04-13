
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for existing session on mount and subscribe to auth changes
  useEffect(() => {
    let mounted = true;
    
    const fetchInitialSession = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing auth state...");
        
        // Get the current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          console.log("Initial session:", currentSession ? "Session exists" : "No session");
          setSession(currentSession);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        if (mounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    // Set up the auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession ? "Has session" : "No session");
        
        if (mounted) {
          setSession(newSession);
          setIsLoading(false);
        }
      }
    );

    // Then fetch the initial session
    fetchInitialSession();

    // Cleanup subscription and mounted flag on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Logout user with error handling
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      localStorage.removeItem('shouldRedirectToAdmin');
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error during logout",
        description: "Could not complete the logout process. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { session, isLoading, logout };
};
