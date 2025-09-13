
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
      
      // Service providers go to LAB-R8, others go to initi8
      if (currentUser.role === 'SERVICE_PROVIDER') {
        console.log('🚀 Index.tsx - Redirecting SERVICE_PROVIDER to LAB-R8');
        console.log('🔍 Index.tsx - LAB-R8 setup status:', {
          labr8_setup_complete: currentUser.labr8_setup_complete,
          profile_complete: currentUser.profile_complete
        });
        const destination = currentUser.labr8_setup_complete ? "/labr8/dashboard" : "/labr8/setup";
        navigate(destination, { replace: true });
      } else {
        console.log('🚀 Index.tsx - Redirecting authenticated user to initi8 dashboard');
        navigate("/initi8", { replace: true });
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
