
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { usePermissions } from "@/hooks/usePermissions";

interface Rel8ProtectedRouteProps {
  children: React.ReactNode;
}

const Rel8ProtectedRoute = ({ children }: Rel8ProtectedRouteProps) => {
  const { currentUser, isLoading } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <h1 className="text-2xl font-bold mt-4">Loading...</h1>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has organizer permissions
  if (!isAdmin && !isOrganizer()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default Rel8ProtectedRoute;
