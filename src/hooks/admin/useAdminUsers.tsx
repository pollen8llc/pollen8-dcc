
import { useQuery } from '@tanstack/react-query';
import { User } from '@/models/types';
import { getAllUsers, getUserCounts } from '@/services/userQueryService';

export function useAdminUsers() {
  const { 
    data: users = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getAllUsers(),
    staleTime: 60000,
    refetchOnWindowFocus: false
  });

  const { data: userStats = { total: 0, admins: 0, organizers: 0, members: 0 } } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: () => getUserCounts(),
    enabled: users.length > 0,
    staleTime: 60000
  });

  return {
    users,
    userStats,
    isLoading,
    error,
    refetch
  };
}
