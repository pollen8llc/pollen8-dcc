
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
  
  // Role validation based on hierarchy: ADMIN > ORGANIZER > MEMBER > GUEST
  let hasRequiredRole = false;
  
  switch (roleEnum) {
    case UserRole.ADMIN:
      hasRequiredRole = currentUser.role === UserRole.ADMIN;
      break;
    
    case UserRole.ORGANIZER:
      hasRequiredRole = 
        currentUser.role === UserRole.ADMIN || 
        currentUser.role === UserRole.ORGANIZER ||
        (communityId !== undefined && currentUser.managedCommunities?.includes(communityId));
      break;
    
    case UserRole.MEMBER:
      hasRequiredRole = 
        currentUser.role === UserRole.ADMIN || 
        currentUser.role === UserRole.ORGANIZER || 
        currentUser.role === UserRole.MEMBER;
      break;
    
    default:
      hasRequiredRole = true; // GUEST role - everyone has access
  }

  if (!hasRequiredRole) {
    // User does not have required permissions
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
