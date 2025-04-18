
import { useState } from 'react';
import { User } from '@/models/types';
import { useAdminUsers } from './admin/useAdminUsers';
import { useUserRoleManagement } from './admin/useUserRoleManagement';
import { useUserCommunities } from './admin/useUserCommunities';
import { useUserActions } from './admin/useUserActions';

export function useUserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isCommunityListOpen, setIsCommunityListOpen] = useState(false);

  const { users, userStats, isLoading, error, refetch } = useAdminUsers();
  const { handleUpdateRole } = useUserRoleManagement();
  const { userCommunities, loadingCommunities } = useUserCommunities(selectedUser, isCommunityListOpen);
  const { handleAddUser, handleDeactivateUser, handleResetPassword } = useUserActions(() => {
    setIsAddUserOpen(false);
    refetch();
  });

  const handleViewUserDetails = (user: User) => {
    console.log("Viewing details for user:", user.id, user.name);
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleViewCommunities = (user: User) => {
    console.log("Viewing communities for user:", user.id, user.name);
    setSelectedUser(user);
    setIsCommunityListOpen(true);
  };

  return {
    users,
    isLoading,
    error,
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
    handleDeactivateUser,
    handleResetPassword,
  };
}
