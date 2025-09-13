
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface NonServiceProviderRouteProps {
  children: React.ReactNode;
}

const NonServiceProviderRoute = ({ children }: NonServiceProviderRouteProps) => {
  const { currentUser, isLoading } = useUser();
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // If user is a service provider, redirect to LAB-R8 dashboard
  if (currentUser?.role === 'SERVICE_PROVIDER') {
    console.log('🔍 NonServiceProviderRoute - Service provider setup status:', {
      labr8_setup_complete: currentUser.labr8_setup_complete,
      profile_complete: currentUser.profile_complete
    });
    if (!currentUser.labr8_setup_complete) {
      return <Navigate to="/labr8/setup" replace />;
    } else {
      return <Navigate to="/labr8/dashboard" replace />;
    }
  }

  // Allow access for all other users (including non-authenticated)
  return <>{children}</>;
};

export default NonServiceProviderRoute;
