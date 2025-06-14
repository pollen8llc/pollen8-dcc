
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface ServiceProviderProtectedRouteProps {
  children: React.ReactNode;
}

const ServiceProviderProtectedRoute = ({ children }: ServiceProviderProtectedRouteProps) => {
  const { currentUser, isLoading } = useUser();
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00eada] mx-auto"></div>
        <h1 className="text-2xl font-bold mt-4">Loading...</h1>
      </div>
    );
  }

  // Redirect to LABR8 auth if not logged in
  if (!currentUser) {
    return <Navigate to="/labr8/auth" replace />;
  }

  // Redirect to LABR8 auth if not a service provider
  if (currentUser.role !== 'SERVICE_PROVIDER') {
    return <Navigate to="/labr8/auth" replace />;
  }

  // Check if profile is complete, redirect to setup if not
  if (!currentUser.profile_complete) {
    return <Navigate to="/labr8/setup" replace />;
  }

  return <>{children}</>;
};

export default ServiceProviderProtectedRoute;
