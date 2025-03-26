
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
    // Redirect to login page when implemented
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  const roleEnum = UserRole[requiredRole as keyof typeof UserRole];
  const hasRequiredRole = 
    currentUser.role === UserRole.ADMIN || // Admins can access everything
    currentUser.role === roleEnum ||
    (roleEnum === UserRole.ORGANIZER && 
     communityId && 
     currentUser.managedCommunities?.includes(communityId));

  if (!hasRequiredRole) {
    // User does not have required permissions
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
