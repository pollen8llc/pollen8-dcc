
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
      } else {
        toast({
          title: "Error updating role",
          description: "There was a problem updating the role",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Role update mutation error:", error);
      toast({
        title: "Error updating role",
        description: "There was a problem updating the role",
        variant: "destructive",
      });
    }
  });

  const handleUpdateRole = async (userId: string, role: UserRole) => {
    console.log("Updating role for user", userId, "to", role);
    try {
      await updateRoleMutation.mutateAsync({ userId, role });
    } catch (error) {
      console.error("Error in handleUpdateRole:", error);
    }
  };

  return { handleUpdateRole };
}
