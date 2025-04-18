
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
        // Invalidate all user-related queries to ensure all UI shows updated roles
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
        
        // Invalidate any user-specific queries that may be cached
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
        
        toast({
          title: "Role updated",
          description: "User role has been updated successfully. User must log out and back in to see changes.",
        });
      } else {
        toast({
          title: "Error updating role",
          description: "Failed to update user role. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Role update mutation error:", error);
      toast({
        title: "Error updating role",
        description: "There was a problem updating the role. Please try again.",
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
