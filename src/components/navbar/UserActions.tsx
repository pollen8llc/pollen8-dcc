
import { User } from "@/models/types";
import { UserRole } from "@/models/types";
import UserBadge from "./UserBadge";
import UserMenuDropdown from "./UserMenuDropdown";

interface UserActionsProps {
  currentUser: User;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
}

const UserActions = ({ currentUser, isOrganizer, logout }: UserActionsProps) => {
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  return (
    <div className="flex items-center gap-2">
      <UserBadge currentUser={currentUser} isAdmin={isAdmin} />
      <UserMenuDropdown 
        currentUser={currentUser} 
        isAdmin={isAdmin} 
        isOrganizer={isOrganizer} 
        logout={logout} 
      />
    </div>
  );
};

export default UserActions;
