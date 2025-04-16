
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, UserRole } from '@/models/types';
import { useToast } from '@/hooks/use-toast';
import { getAllUsers } from '@/services/userQueryService';
import { updateUserRole } from '@/services/roleService';
import { inviteUser, resetUserPassword } from '@/services/userInvitationService';
import { deactivateUser, getUserCommunities } from '@/services/userAccountService';

export function useUserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isCommunityListOpen, setIsCommunityListOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all users
  const { 
    data: users = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers
  });

  // Calculate user stats
  const userStats = {
    total: users.length,
    admins: users.filter(user => user.role === UserRole.ADMIN).length,
    organizers: users.filter(user => user.role === UserRole.ORGANIZER).length,
    members: users.filter(user => user.role === UserRole.MEMBER).length,
  };

  // Mutation for updating user roles
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateUserRole(userId, role),
    onSuccess: (success) => {
      if (success) {
        // Invalidate the users query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        toast({
          title: "Role updated",
          description: "User role has been updated successfully",
        });
      }
    }
  });

  // Mutation for adding a new user
  const addUserMutation = useMutation({
    mutationFn: (userData: { email: string; firstName: string; lastName: string; role: UserRole }) =>
      inviteUser(
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.role
      ),
    onSuccess: (success) => {
      if (success) {
        // Close the modal and refetch users
        setIsAddUserOpen(false);
        refetch();
        toast({
          title: "User invited",
          description: "Invitation has been sent to the user",
        });
      }
    }
  });

  // Mutation for deactivating a user
  const deactivateUserMutation = useMutation({
    mutationFn: (userId: string) => deactivateUser(userId),
    onSuccess: (success) => {
      if (success) {
        // Refetch users to update the list
        refetch();
        toast({
          title: "User deactivated",
          description: "User account has been deactivated",
        });
      }
    }
  });

  // Mutation for resetting a user's password
  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => resetUserPassword(email),
    onSuccess: (success) => {
      if (success) {
        toast({
          title: "Password reset initiated",
          description: "A password reset link has been sent to the user's email",
        });
      }
    }
  });

  // Fetch communities for a specific user
  const { data: userCommunities = [], isLoading: loadingCommunities } = useQuery({
    queryKey: ['user-communities', selectedUser?.id],
    queryFn: () => getUserCommunities(selectedUser?.id || ''),
    enabled: !!selectedUser?.id && isCommunityListOpen
  });

  // Handler functions
  const handleUpdateRole = async (userId: string, role: UserRole) => {
    await updateRoleMutation.mutateAsync({ userId, role });
  };

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleAddUser = async (userData: { email: string; firstName: string; lastName: string; role: UserRole }) => {
    await addUserMutation.mutateAsync(userData);
  };

  const handleViewCommunities = (user: User) => {
    setSelectedUser(user);
    setIsCommunityListOpen(true);
  };

  const handleDeactivateUser = async (userId: string) => {
    await deactivateUserMutation.mutateAsync(userId);
  };

  const handleResetPassword = async (email: string) => {
    await resetPasswordMutation.mutateAsync(email);
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
