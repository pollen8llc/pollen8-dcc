
import { User, UserRole } from "@/models/types";
import AccountButton from "./AccountButton";
import { usePermissions } from "@/hooks/usePermissions";

interface UserActionsProps {
  currentUser: User;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
}

const UserActions = ({ currentUser, isOrganizer, logout }: UserActionsProps) => {
  // Use the permissions hook to get accurate role information
  const { checkPermission } = usePermissions(currentUser);
  
  // Determine if the user is an admin based on their role
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  
  // Check if user is an organizer of any community
  const hasOrganizerRole = currentUser?.role === UserRole.ORGANIZER || 
    (currentUser?.managedCommunities && currentUser.managedCommunities.length > 0);

  // Add debug logging for user state to help troubleshoot
  console.log("UserActions rendering with:", {
    currentUser: currentUser?.id || "No user",
    role: currentUser?.role || "No role",
    isAdmin,
    hasOrganizerRole,
    managedCommunities: currentUser?.managedCommunities || []
  });

  return (
    <AccountButton 
      currentUser={currentUser} 
      isAdmin={isAdmin} 
      isOrganizer={hasOrganizerRole}
      logout={logout}
    />
  );
};

export default UserActions;
