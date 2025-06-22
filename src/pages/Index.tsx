
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Shell } from "@/components/layout/Shell";
import LandingPage from "./LandingPage";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Index = () => {
  console.log('Index: Component mounting');
  
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  
  console.log('Index: User state - loading:', isLoading, 'user:', currentUser?.id, 'role:', currentUser?.role);
  
  useEffect(() => {
    console.log('Index: useEffect triggered - loading:', isLoading, 'user:', !!currentUser);
    
    if (!isLoading && currentUser) {
      console.log('Index: User is authenticated, checking redirect logic');
      
      // If user is a service provider, redirect to LAB-R8
      if (currentUser.role === 'SERVICE_PROVIDER') {
        console.log('Index: Service provider detected, redirecting to LAB-R8');
        if (!currentUser.profile_complete) {
          console.log('Index: Profile incomplete, redirecting to setup');
          navigate("/labr8/setup", { replace: true });
        } else {
          console.log('Index: Profile complete, redirecting to inbox');
          navigate("/labr8/inbox", { replace: true });
        }
        return;
      }
      
      // For other users, check if profile is complete before redirecting
      if (!currentUser.profile_complete) {
        console.log('Index: Profile incomplete, redirecting to profile setup');
        navigate("/profile/setup", { replace: true });
      } else {
        console.log('Index: Profile complete, redirecting to knowledge resources');
        // If user is logged in and profile is complete, redirect to knowledge resources
        navigate("/knowledge/resources", { replace: true });
      }
    }
  }, [currentUser, isLoading, navigate]);
  
  if (isLoading) {
    console.log('Index: Showing loading spinner');
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // If not logged in, show the landing page
  if (!currentUser) {
    console.log('Index: No user, showing landing page');
    return (
      <Shell heroMode={true}>
        <LandingPage />
      </Shell>
    );
  }

  // Show loading while redirecting
  console.log('Index: User exists, showing redirect loading');
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner size="lg" text="Redirecting..." />
    </div>
  );
};

export default Index;
