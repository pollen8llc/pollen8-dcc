
import { useState, useEffect } from 'react';
import { User } from '@/models/types';

/**
 * @deprecated This hook is maintained for backward compatibility.
 * Community functionality has been removed from the platform.
 */
export function useUserCommunities(selectedUser: User | null, isOpen: boolean) {
  const [userCommunities, setUserCommunities] = useState<any[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState<boolean>(false);

  useEffect(() => {
    // No-op since community functionality has been removed
    console.log("useUserCommunities: Community functionality has been removed");
  }, [selectedUser, isOpen]);

  return {
    userCommunities,
    loadingCommunities
  };
}
