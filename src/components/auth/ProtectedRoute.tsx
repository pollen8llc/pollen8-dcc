
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";

export interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
  roleEnum?: UserRole; // Keep for backward compatibility
}

const ProtectedRoute = ({ 
  children, 
  role,
  roleEnum 
}: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useUser();
  
  // Support both role and roleEnum props for backward compatibility
  const requiredRole = role || roleEnum;
  
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

  // If a specific role is required, check if user has it
  if (requiredRole) {
    // For ADMIN role, strictly check for ADMIN
    if (requiredRole === UserRole.ADMIN && currentUser.role !== UserRole.ADMIN) {
      return <Navigate to="/" replace />;
    }
    
    // For ORGANIZER role, check for either ORGANIZER or ADMIN
    if (requiredRole === UserRole.ORGANIZER && 
        currentUser.role !== UserRole.ORGANIZER && 
        currentUser.role !== UserRole.ADMIN) {
      return <Navigate to="/" replace />;
    }
    
    // For MEMBER role, check for MEMBER, ORGANIZER or ADMIN
    if (requiredRole === UserRole.MEMBER && 
        currentUser.role !== UserRole.MEMBER &&
        currentUser.role !== UserRole.ORGANIZER && 
        currentUser.role !== UserRole.ADMIN) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
