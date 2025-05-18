
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
  
  // Show loading or redirect if user isn't authenticated
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check if user has it
  if (requiredRole && currentUser.role !== requiredRole) {
    // If the required role is ORGANIZER or ADMIN and user isn't authorized, redirect to home
    if ([UserRole.ORGANIZER, UserRole.ADMIN].includes(requiredRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
