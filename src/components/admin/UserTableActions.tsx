
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, UserRole } from "@/models/types";
import UserRoleSelector from "./UserRoleSelector";
import { Eye, MoreHorizontal, Mail, Users, Key, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserActionDialogs from "./UserActionDialogs";

interface UserTableActionsProps {
  user: User;
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
  onViewUserDetails: (user: User) => void;
  onViewCommunities: (user: User) => void;
  canManageUsers: boolean;
}

const UserTableActions = ({
  user,
  onUpdateRole,
  onViewUserDetails,
  onViewCommunities,
  canManageUsers
}: UserTableActionsProps) => {
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);
  const { toast } = useToast();

  const handleDeactivateConfirm = () => {
    if (userToDeactivate) {
      toast({
        title: "Feature not implemented",
        description: "User deactivation will be available in a future update",
      });
      setUserToDeactivate(null);
    }
  };

  const handleResetPasswordConfirm = () => {
    if (userToResetPassword) {
      toast({
        title: "Feature not implemented",
        description: "Password reset will be available in a future update",
      });
      setUserToResetPassword(null);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onViewUserDetails(user)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <UserRoleSelector
        userId={user.id}
        currentRole={user.role}
        onUpdateRole={onUpdateRole}
        disabled={!canManageUsers}
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onViewUserDetails(user)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open(`mailto:${user.email}`)}
            className="cursor-pointer"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact User
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onViewCommunities(user)}
            className="cursor-pointer"
          >
            <Users className="mr-2 h-4 w-4" />
            View Communities
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setUserToResetPassword(user)}
            className="cursor-pointer"
            disabled={!canManageUsers}
          >
            <Key className="mr-2 h-4 w-4" />
            Reset Password
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setUserToDeactivate(user)}
            className="cursor-pointer text-destructive focus:text-destructive"
            disabled={!canManageUsers || user.role === UserRole.ADMIN}
          >
            <UserX className="mr-2 h-4 w-4" />
            Deactivate Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserActionDialogs
        userToDeactivate={userToDeactivate}
        userToResetPassword={userToResetPassword}
        onDeactivateConfirm={handleDeactivateConfirm}
        onResetPasswordConfirm={handleResetPasswordConfirm}
        setUserToDeactivate={setUserToDeactivate}
        setUserToResetPassword={setUserToResetPassword}
      />
    </div>
  );
};

export default UserTableActions;
