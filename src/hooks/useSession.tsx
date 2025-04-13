
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
      (event, session) => {
        console.log("Auth state changed:", event, session ? "Has session" : "No session");
        setSession(session);
        setIsLoading(false);
      }
    );
    
    // THEN check for existing session
    const fetchInitialSession = async () => {
      try {
        console.log("Initializing auth state...");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session:", session ? "Session exists" : "No session");
        setSession(session);
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
      await supabase.auth.signOut();
      setSession(null);
      localStorage.removeItem('shouldRedirectToAdmin');
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return { session, isLoading, logout };
};
