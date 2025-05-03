
import { User, UserRole } from "@/models/types";
import AccountButton from "./AccountButton";

interface UserActionsProps {
  currentUser: User;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
}

const UserActions = ({ currentUser, isOrganizer, logout }: UserActionsProps) => {
  // Use the actual role from currentUser
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Add debug logging for user state to help troubleshoot
  console.log("UserActions rendering with:", {
    currentUser: currentUser?.id || "No user",
    role: currentUser?.role || "No role",
    isAdmin
  });

  return (
    <AccountButton 
      currentUser={currentUser} 
      isAdmin={isAdmin} 
      logout={logout}
    />
  );
};

export default UserActions;
