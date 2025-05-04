
import { User } from "@/models/types";
import AccountButton from "./AccountButton";

interface UserActionsProps {
  currentUser: User;
  logout: () => Promise<void>;
}

const UserActions = ({ currentUser, logout }: UserActionsProps) => {
  // Add debug logging for user state to help troubleshoot
  console.log("UserActions rendering with:", {
    currentUser: currentUser?.id || "No user",
    role: currentUser?.role || "No role",
    managedCommunities: currentUser?.managedCommunities || []
  });

  return (
    <AccountButton 
      currentUser={currentUser} 
      logout={logout}
    />
  );
};

export default UserActions;
