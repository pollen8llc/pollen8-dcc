
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { User, UserRole } from "@/models/types";
import UserTableActions from "./UserTableActions";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserTableRowProps {
  user: User;
  onUpdateRole: (userId: string, role: UserRole) => Promise<void>;
  onViewUserDetails: (user: User) => void;
  onViewCommunities: (user: User) => void;
  canManageUsers: boolean;
}

const UserTableRow = ({
  user,
  onUpdateRole,
  onViewUserDetails,
  onViewCommunities,
  canManageUsers
}: UserTableRowProps) => {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case UserRole.ORGANIZER:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case UserRole.MEMBER:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  return (
    <TableRow key={user.id}>
      <TableCell>
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
            {UserRole[user.role]}
          </span>
          {user.role === UserRole.ADMIN && (
            <Shield className="h-4 w-4 text-red-500" />
          )}
        </div>
      </TableCell>
      <TableCell>
        {user.createdAt 
          ? format(new Date(user.createdAt), "MMM d, yyyy") 
          : "N/A"}
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onViewCommunities(user)}
        >
          <span className="mr-2">
            {user.communities?.length || 0}
          </span>
          {user.managedCommunities && user.managedCommunities.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({user.managedCommunities.length} managed)
            </span>
          )}
        </Button>
      </TableCell>
      <TableCell>
        <UserTableActions
          user={user}
          onUpdateRole={onUpdateRole}
          onViewUserDetails={onViewUserDetails}
          onViewCommunities={onViewCommunities}
          canManageUsers={canManageUsers}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
