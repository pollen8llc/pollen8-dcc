
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, UserRole } from '@/models/types';
import { useToast } from '@/hooks/use-toast';
import { getAllUsers, getUserCounts } from '@/services/userQueryService';
import { updateUserRole } from '@/services/roleService';
import { inviteUser, resetUserPassword } from '@/services/userInvitationService';
import { deactivateUser, getUserCommunities } from '@/services/userAccountService';

export function useUserManagement() {
  console.log("useUserManagement hook initializing");
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isCommunityListOpen, setIsCommunityListOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all users with proper caching
  const { 
    data: users = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => {
      console.log("Executing admin-users queryFn");
      return getAllUsers();
    },
    staleTime: 60000, // Cache for 1 minute
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      console.log("admin-users query succeeded with", data.length, "users");
    },
    onError: (err) => {
      console.error("admin-users query failed:", err);
    }
  });

  // Fetch user stats with proper caching
  const { data: userStats = { total: 0, admins: 0, organizers: 0, members: 0 } } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: () => {
      console.log("Executing admin-user-stats queryFn");
      return getUserCounts();
    },
    enabled: users.length > 0,
    staleTime: 60000,
    onSuccess: (data) => {
      console.log("admin-user-stats query succeeded:", data);
    },
    onError: (err) => {
      console.error("admin-user-stats query failed:", err);
    }
  });

  // Log whenever users data changes
  useEffect(() => {
    console.log("Users data in useUserManagement updated:", users.length, "users");
  }, [users]);

  // Mutation for updating user roles
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateUserRole(userId, role),
    onSuccess: (success) => {
      if (success) {
        // Invalidate both users and stats queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
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

  // Fetch communities for a specific user with proper caching
  const { data: userCommunities = [], isLoading: loadingCommunities } = useQuery({
    queryKey: ['user-communities', selectedUser?.id],
    queryFn: () => {
      console.log("Fetching communities for user:", selectedUser?.id);
      return getUserCommunities(selectedUser?.id || '');
    },
    enabled: !!selectedUser?.id && isCommunityListOpen,
    staleTime: 60000,
    onSuccess: (data) => {
      console.log("user-communities query succeeded:", data);
    },
    onError: (err) => {
      console.error("user-communities query failed:", err);
    }
  });

  // Handler functions
  const handleUpdateRole = async (userId: string, role: UserRole) => {
    console.log("Updating role for user", userId, "to", role);
    await updateRoleMutation.mutateAsync({ userId, role });
  };

  const handleViewUserDetails = (user: User) => {
    console.log("Viewing details for user:", user.id, user.name);
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleAddUser = async (userData: { email: string; firstName: string; lastName: string; role: UserRole }) => {
    console.log("Adding new user:", userData);
    await addUserMutation.mutateAsync(userData);
  };

  const handleViewCommunities = (user: User) => {
    console.log("Viewing communities for user:", user.id, user.name);
    setSelectedUser(user);
    setIsCommunityListOpen(true);
  };

  const handleDeactivateUser = async (userId: string) => {
    console.log("Deactivating user:", userId);
    await deactivateUserMutation.mutateAsync(userId);
  };

  const handleResetPassword = async (email: string) => {
    console.log("Resetting password for:", email);
    await resetPasswordMutation.mutateAsync(email);
  };

  // Log cache status
  useEffect(() => {
    const cacheState = queryClient.getQueryCache().getAll().map(query => ({
      key: query.queryKey,
      state: query.state
    }));
    console.log("Query cache state:", cacheState);
  }, [queryClient]);

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
