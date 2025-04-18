
import { useMutation } from '@tanstack/react-query';
import { User, UserRole } from '@/models/types';
import { inviteUser, resetUserPassword } from '@/services/userInvitationService';
import { deactivateUser } from '@/services/userAccountService';
import { useToast } from '@/hooks/use-toast';

export function useUserActions(onAddUserSuccess?: () => void) {
  const { toast } = useToast();

  const addUserMutation = useMutation({
    mutationFn: (userData: { email: string; firstName: string; lastName: string; role: UserRole }) =>
      inviteUser(userData.email, userData.firstName, userData.lastName, userData.role),
    onSuccess: (success) => {
      if (success) {
        onAddUserSuccess?.();
        toast({
          title: "User invited",
          description: "Invitation has been sent to the user",
        });
      }
    }
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (userId: string) => deactivateUser(userId),
    onSuccess: (success) => {
      if (success) {
        toast({
          title: "User deactivated",
          description: "User account has been deactivated",
        });
      }
    }
  });

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

  return {
    handleAddUser: addUserMutation.mutateAsync,
    handleDeactivateUser: deactivateUserMutation.mutateAsync,
    handleResetPassword: resetPasswordMutation.mutateAsync,
  };
}
