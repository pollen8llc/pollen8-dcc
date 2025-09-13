
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { UserRole } from "@/models/types";
import { useUserManagement } from "@/hooks/useUserManagement";
import UserManagementTable from "./UserManagementTable";
import UserManagementHeader from "./UserManagementHeader";
// Removed UserStatsCards import - moved to metrics page
import UserDetailsDialog from "./UserDetailsDialog";
import UserCommunitiesDialog from "./UserCommunitiesDialog";
import AddUserForm from "./AddUserForm";

const UserManagementTab = () => {
  const { currentUser } = useUser();
  const {
    users,
    isLoading,
    userStats,
    selectedUser,
    isUserDetailsOpen,
    setIsUserDetailsOpen,
    isAddUserOpen,
    setIsAddUserOpen,
    isCommunityListOpen,
    setIsCommunityListOpen,
    userCommunities,
    loadingCommunities,
    refetch,
    handleUpdateRole,
    handleViewUserDetails,
    handleAddUser,
    handleViewCommunities,
  } = useUserManagement();

  const canManageUsers = currentUser?.role === UserRole.ADMIN;

  console.log('UserManagementTab: Permission check', {
    currentUser: currentUser?.id,
    role: currentUser?.role,
    canManageUsers,
    userRoleEnum: UserRole.ADMIN
  });

  return (
    <div className="space-y-8">
      <UserManagementHeader
        onRefresh={refetch}
        onAddUser={() => setIsAddUserOpen(true)}
        isLoading={isLoading}
        canManageUsers={canManageUsers}
      />

      {/* User stats moved to dedicated metrics page */}

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            View and manage all user accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable
            users={users}
            isLoading={isLoading}
            onUpdateRole={handleUpdateRole}
            onViewUserDetails={handleViewUserDetails}
            onViewCommunities={handleViewCommunities}
            canManageUsers={canManageUsers}
          />
        </CardContent>
      </Card>

      <UserDetailsDialog
        user={selectedUser}
        isOpen={isUserDetailsOpen}
        onOpenChange={setIsUserDetailsOpen}
        onViewCommunities={() => selectedUser && handleViewCommunities(selectedUser)}
      />

      <AddUserForm
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSubmit={async (values) => {
          await handleAddUser({
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            role: UserRole[values.role as keyof typeof UserRole]
          });
        }}
      />

      {/* Update props to match UserCommunitiesDialog interface */}
      <UserCommunitiesDialog
        user={selectedUser}
        open={isCommunityListOpen}
        onOpenChange={setIsCommunityListOpen}
        communities={userCommunities}
        isLoading={loadingCommunities}
      />
    </div>
  );
};

export default UserManagementTab;
