
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";
import { usePermissions } from "@/hooks/usePermissions"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: keyof typeof UserRole;
  communityId?: string;
  requireCompleteProfile?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = "MEMBER", 
  communityId,
  requireCompleteProfile = true
}: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useUser();
  const { isAdmin, isOrganizer } = usePermissions(currentUser);
  const location = useLocation();

  // Add debugging to track protection flow
  console.log("ProtectedRoute - Path protection:", {
    path: location.pathname,
    requiredRole,
    currentUserRole: currentUser?.role,
    communityId,
    isLoading,
    hasUser: !!currentUser,
    isAdmin: isAdmin(),
    isOrganizer: isOrganizer(communityId),
    profile_complete: currentUser?.profile_complete,
    requireCompleteProfile,
    managedCommunities: currentUser?.managedCommunities || []
  });

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
    console.log("ProtectedRoute - No user, redirecting to auth");
    // Store the current location to return to after login
    const returnPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirectTo=${returnPath}`} replace />;
  }

  // Check if user has required role
  const roleEnum = UserRole[requiredRole as keyof typeof UserRole];
  
  // For admin routes specifically, only allow ADMIN role
  if (roleEnum === UserRole.ADMIN && !isAdmin()) {
    console.log("ProtectedRoute - Access denied: User is not admin");
    return <Navigate to="/" replace />;
  }
  
  // For organizer routes, allow ADMIN or ORGANIZER with management permissions
  if (roleEnum === UserRole.ORGANIZER) {
    const hasAccess = isAdmin() || isOrganizer(communityId);
      
    if (!hasAccess) {
      console.log("ProtectedRoute - Access denied: User is not organizer", {
        userRole: currentUser.role,
        communityId,
        managedCommunities: currentUser.managedCommunities
      });
      return <Navigate to="/" replace />;
    }
  }
  
  // For member routes, allow ADMIN, ORGANIZER, or MEMBER
  if (roleEnum === UserRole.MEMBER) {
    const hasAccess = 
      isAdmin() || 
      isOrganizer() || 
      currentUser.role === UserRole.MEMBER;
      
    if (!hasAccess) {
      console.log("ProtectedRoute - Access denied: User is not a member");
      return <Navigate to="/auth" replace />;
    }
    
    // Special case: Don't redirect from profile setup page to itself
    // This prevents infinite redirection loops
    if (
      requireCompleteProfile && 
      currentUser.profile_complete === false && 
      !location.pathname.includes('/profile/setup') &&
      !location.pathname.includes('/auth')
    ) {
      console.log("ProtectedRoute - Redirecting to profile setup");
      return <Navigate to="/profile/setup" replace />;
    }
  }

  console.log("ProtectedRoute - Access granted");
  // User is authenticated and has required role
  return <>{children}</>;
};

export default ProtectedRoute;
