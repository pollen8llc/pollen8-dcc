
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for existing session on mount and subscribe to auth changes
  useEffect(() => {
    setIsLoading(true);
    
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession ? "Has session" : "No session");
        if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing session");
          setSession(null);
        } else {
          setSession(newSession);
        }
        setIsLoading(false);
      }
    );
    
    // THEN check for existing session
    const fetchInitialSession = async () => {
      try {
        console.log("Initializing auth state...");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session:", initialSession ? "Session exists" : "No session");
        setSession(initialSession);
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
      subscription.unsubscribe();
    };
  }, []);

  // Logout user
  const logout = async (): Promise<void> => {
    try {
      console.log("Logging out user...");
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      console.log("User logged out successfully");
      setSession(null);
      localStorage.removeItem('shouldRedirectToAdmin');
      
      // Clear any cached data in localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('app-cache-')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return { session, isLoading, logout };
};
