
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: keyof typeof UserRole;
  communityId?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = "MEMBER", 
  communityId 
}: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    // Show loading state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-aquamarine mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser) {
    // Redirect to login page
    return <Navigate to="/auth" replace />;
  }

  // Check if user has required role
  const roleEnum = UserRole[requiredRole as keyof typeof UserRole];
  
  // For admin routes specifically, only allow ADMIN role
  if (roleEnum === UserRole.ADMIN && currentUser.role !== UserRole.ADMIN) {
    console.log("Access denied: User is not admin");
    return <Navigate to="/" replace />;
  }
  
  // For organizer routes, allow ADMIN or ORGANIZER with management permissions
  if (roleEnum === UserRole.ORGANIZER) {
    const hasAccess = 
      currentUser.role === UserRole.ADMIN || 
      currentUser.role === UserRole.ORGANIZER ||
      (communityId !== undefined && currentUser.managedCommunities?.includes(communityId));
      
    if (!hasAccess) {
      console.log("Access denied: User is not organizer for this community");
      return <Navigate to="/" replace />;
    }
  }
  
  // For member routes, allow ADMIN, ORGANIZER, or MEMBER
  if (roleEnum === UserRole.MEMBER) {
    const hasAccess = 
      currentUser.role === UserRole.ADMIN || 
      currentUser.role === UserRole.ORGANIZER || 
      currentUser.role === UserRole.MEMBER;
      
    if (!hasAccess) {
      console.log("Access denied: User is not a member");
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
