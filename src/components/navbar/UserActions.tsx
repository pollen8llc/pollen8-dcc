
import { User } from "@/models/types";
import { UserRole } from "@/models/types";
import UserBadge from "./UserBadge";

interface UserActionsProps {
  currentUser: User;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
}

const UserActions = ({ currentUser }: UserActionsProps) => {
  // Use the actual role from currentUser
  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <div className="flex items-center">
      <UserBadge currentUser={currentUser} isAdmin={isAdmin} />
    </div>
  );
};

export default UserActions;
