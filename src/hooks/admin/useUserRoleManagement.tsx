
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRole } from '@/models/types';
import { updateUserRole } from '@/services/roleService';
import { useToast } from '@/hooks/use-toast';

export function useUserRoleManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateUserRole(userId, role),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
        toast({
          title: "Role updated",
          description: "User role has been updated successfully",
        });
      }
    }
  });

  const handleUpdateRole = async (userId: string, role: UserRole) => {
    console.log("Updating role for user", userId, "to", role);
    await updateRoleMutation.mutateAsync({ userId, role });
  };

  return { handleUpdateRole };
}
