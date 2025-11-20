
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Shell } from "@/components/layout/Shell";
import LandingPage from "./LandingPage";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && currentUser) {
      console.log('🔍 Index.tsx - Current user:', {
        role: currentUser.role,
        profileComplete: currentUser.profile_complete,
        userId: currentUser.id,
        modul8_setup_complete: currentUser.modul8_setup_complete,
        labr8_setup_complete: currentUser.labr8_setup_complete
      });
      
      // Check if there's a return URL from authentication
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo');
      
      if (returnTo) {
        console.log('🔄 Index.tsx - Redirecting to return URL:', returnTo);
        navigate(returnTo, { replace: true });
        return;
      }
      
      // Redirect all authenticated users to REL8 connect page
      console.log('🚀 Index.tsx - Redirecting authenticated user to REL8 connect page');
      navigate("/rel8/connect", { replace: true });
    }
  }, [currentUser, isLoading, navigate]);

  // Additional effect to handle session recovery scenarios
  useEffect(() => {
    // If we're not loading, have no currentUser, but are on the root path
    // and there might be auth state issues, try to recover
    if (!isLoading && !currentUser && window.location.pathname === '/') {
      console.log('🔍 Index.tsx - No current user on root path, checking for session recovery');
      
      // Small delay to allow auth state to settle
      const timeoutId = setTimeout(async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && !currentUser) {
            console.log('🔄 Index.tsx - Found session but no currentUser, triggering refresh');
            window.location.reload();
          }
        } catch (error) {
          console.error('❌ Index.tsx - Error checking session:', error);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentUser, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // If not logged in, show the landing page
  if (!currentUser) {
    return (
      <Shell heroMode={true}>
        <LandingPage />
      </Shell>
    );
  }

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner size="lg" text="Redirecting..." />
    </div>
  );
};

export default Index;
