
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
      console.log('User found, redirecting based on role:', currentUser.role);
      
      // If user is a service provider, redirect to LAB-R8
      if (currentUser.role === 'SERVICE_PROVIDER') {
        if (!currentUser.profile_complete) {
          navigate("/labr8/setup", { replace: true });
        } else {
          navigate("/labr8/inbox", { replace: true });
        }
        return;
      }
      
      // If user is an organizer, redirect to Modul8
      if (currentUser.role === 'ORGANIZER') {
        navigate("/modul8", { replace: true });
        return;
      }
      
      // For other users, check if profile is complete before redirecting
      if (!currentUser.profile_complete) {
        navigate("/profile/setup", { replace: true });
      } else {
        // Default redirect to welcome dashboard for other roles
        navigate("/welcome", { replace: true });
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
