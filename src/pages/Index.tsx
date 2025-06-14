
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";
import { Shell } from "@/components/layout/Shell";
import LandingPage from "./LandingPage";

const Index = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      if (currentUser) {
        // If user is a service provider, redirect to LABR8
        if (currentUser.role === 'SERVICE_PROVIDER') {
          if (!currentUser.profile_complete) {
            navigate("/labr8/setup", { replace: true });
          } else {
            navigate("/labr8/dashboard", { replace: true });
          }
          return;
        }
        
        // For other users, check if profile is complete before redirecting
        if (!currentUser.profile_complete) {
          navigate("/profile/setup", { replace: true });
        } else {
          // If user is logged in and profile is complete, redirect to knowledge resources
          navigate("/knowledge/resources", { replace: true });
        }
      }
    }
  }, [currentUser, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
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
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default Index;
