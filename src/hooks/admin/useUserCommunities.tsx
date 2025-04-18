
import { useQuery } from '@tanstack/react-query';
import { User } from '@/models/types';
import { getUserCommunities } from '@/services/userAccountService';

export function useUserCommunities(selectedUser: User | null, isOpen: boolean) {
  const { data: userCommunities = [], isLoading: loadingCommunities } = useQuery({
    queryKey: ['user-communities', selectedUser?.id],
    queryFn: () => getUserCommunities(selectedUser?.id || ''),
    enabled: !!selectedUser?.id && isOpen,
    staleTime: 60000
  });

  return { userCommunities, loadingCommunities };
}
