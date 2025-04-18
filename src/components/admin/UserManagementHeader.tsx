
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, UserPlus } from "lucide-react";

interface UserManagementHeaderProps {
  onRefresh: () => void;
  onAddUser: () => void;
  isLoading: boolean;
  canManageUsers: boolean;
}

const UserManagementHeader = ({
  onRefresh,
  onAddUser,
  isLoading,
  canManageUsers
}: UserManagementHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold">User Management</h2>
        <p className="text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>
      <div className="flex items-center space-x-2 mt-4 sm:mt-0">
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button 
          onClick={onAddUser}
          disabled={!canManageUsers}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
    </div>
  );
};

export default UserManagementHeader;
