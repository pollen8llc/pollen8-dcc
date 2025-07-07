
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Shell } from "@/components/layout/Shell";
import LandingPage from "./LandingPage";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Index = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && currentUser) {
      console.log('🔍 Index.tsx - Current user:', {
        role: currentUser.role,
        profileComplete: currentUser.profile_complete,
        userId: currentUser.id
      });
      
      // If user is a service provider, redirect to LAB-R8
      if (currentUser.role === 'SERVICE_PROVIDER') {
        console.log('🚀 Redirecting SERVICE_PROVIDER to LAB-R8');
        if (!currentUser.profile_complete) {
          navigate("/labr8/setup", { replace: true });
        } else {
          navigate("/labr8/dashboard", { replace: true });
        }
        return;
      }
      
      // If user is an organizer, redirect to /organizer
      if (currentUser.role === 'ORGANIZER') {
        console.log('🚀 Redirecting ORGANIZER to /organizer');
        if (!currentUser.profile_complete) {
          navigate("/profile/setup", { replace: true });
        } else {
          navigate("/organizer", { replace: true });
        }
        return;
      }
      
      // For other users, check if profile is complete before redirecting
      if (!currentUser.profile_complete) {
        console.log('🚀 Redirecting to profile setup - incomplete profile');
        navigate("/profile/setup", { replace: true });
      } else {
        // If user is logged in and profile is complete, redirect to knowledge resources
        console.log('🚀 Redirecting to knowledge resources - default fallback');
        navigate("/knowledge/resources", { replace: true });
      }
    }
  }, [currentUser, isLoading, navigate]);
  
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
