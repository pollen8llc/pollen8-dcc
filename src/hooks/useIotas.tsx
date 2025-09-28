import { useCallback } from 'react';
import { IotasService } from '@/services/iotasService';
import { SolarSystemAvatarService } from '@/services/solarSystemAvatarService';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

/**
 * Hook for managing user iotas (network metrics)
 */
export function useIotas() {
  const { currentUser } = useUser();

  const incrementRel8Contacts = useCallback(async (count: number = 1) => {
    if (!currentUser?.id) return false;

    try {
      const success = await IotasService.incrementRel8Contacts(currentUser.id, count);
      if (success) {
        // Clear solar system cache to update avatar
        SolarSystemAvatarService.clearUserCache(currentUser.id);
        toast.success(`Added ${count} Rel8 contact${count > 1 ? 's' : ''}!`);
      }
      return success;
    } catch (error) {
      console.error('Error incrementing Rel8 contacts:', error);
      return false;
    }
  }, [currentUser?.id]);

  const incrementCultiv8Posts = useCallback(async (count: number = 1) => {
    if (!currentUser?.id) return false;

    try {
      const success = await IotasService.incrementCultiv8Posts(currentUser.id, count);
      if (success) {
        // Clear solar system cache to update avatar
        SolarSystemAvatarService.clearUserCache(currentUser.id);
        toast.success(`Added ${count} Cultiv8 post${count > 1 ? 's' : ''}!`);
      }
      return success;
    } catch (error) {
      console.error('Error incrementing Cultiv8 posts:', error);
      return false;
    }
  }, [currentUser?.id]);

  const incrementEco8Communities = useCallback(async (count: number = 1) => {
    if (!currentUser?.id) return false;

    try {
      const success = await IotasService.incrementEco8Communities(currentUser.id, count);
      if (success) {
        // Clear solar system cache to update avatar
        SolarSystemAvatarService.clearUserCache(currentUser.id);
        toast.success(`Added ${count} Eco8 communit${count > 1 ? 'ies' : 'y'}!`);
      }
      return success;
    } catch (error) {
      console.error('Error incrementing Eco8 communities:', error);
      return false;
    }
  }, [currentUser?.id]);

  const getUserIotas = useCallback(async () => {
    if (!currentUser?.id) return null;

    try {
      return await IotasService.getUserIotas(currentUser.id);
    } catch (error) {
      console.error('Error getting user iotas:', error);
      return null;
    }
  }, [currentUser?.id]);

  return {
    incrementRel8Contacts,
    incrementCultiv8Posts,
    incrementEco8Communities,
    getUserIotas,
  };
}