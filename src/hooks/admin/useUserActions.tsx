
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
      } else {
        // Handle the case where the function returns false
        toast({
          title: "Invitation failed",
          description: "Failed to send invitation. User may already exist.",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      console.error("Error inviting user:", error);
      toast({
        title: "Error inviting user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
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
      } else {
        toast({
          title: "Deactivation failed",
          description: "Cannot deactivate this user. They may be the last administrator.",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      console.error("Error deactivating user:", error);
      toast({
        title: "Error deactivating user",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
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
      } else {
        toast({
          title: "Password reset failed",
          description: "Failed to initiate password reset",
          variant: "destructive"
        });
      }
    },
    onError: (error: any) => {
      console.error("Error resetting password:", error);
      toast({
        title: "Error resetting password",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  });

  return {
    handleAddUser: addUserMutation.mutateAsync,
    handleDeactivateUser: deactivateUserMutation.mutateAsync,
    handleResetPassword: resetPasswordMutation.mutateAsync,
  };
}
