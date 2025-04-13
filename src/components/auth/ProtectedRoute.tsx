
import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: keyof typeof UserRole;
  communityId?: string;
  fallback?: React.ReactNode;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = "MEMBER", 
  communityId,
  fallback 
}: ProtectedRouteProps) => {
  const { currentUser, isLoading, hasPermission, isOrganizer } = useUser();

  // Show custom loading state or default loading indicator
  if (isLoading) {
    if (fallback) return <>{fallback}</>;
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
          <p className="text-center text-sm text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!currentUser) {
    // Store the intended location for post-login redirect
    // Could be enhanced with React Router's location state
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    
    // Redirect to login page
    return <Navigate to="/auth" replace />;
  }

  // Check if user has required role
  const roleEnum = UserRole[requiredRole as keyof typeof UserRole];
  
  const hasRequiredPermission = 
    currentUser.role === UserRole.ADMIN || // Admins can access everything
    currentUser.role === roleEnum ||
    (roleEnum === UserRole.ORGANIZER && 
     communityId && 
     isOrganizer(communityId));

  if (!hasRequiredPermission) {
    // User does not have required permissions
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
