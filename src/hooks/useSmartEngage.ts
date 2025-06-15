
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, getServiceRequests } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';

export const useSmartEngage = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEngage = async (serviceProviderId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to engage with service providers",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Get the current user's organizer profile
      const organizer = await getUserOrganizer(session.user.id);
      
      if (!organizer) {
        toast({
          title: "Profile Required",
          description: "Please complete your organizer profile first",
          variant: "destructive"
        });
        navigate('/modul8/setup/organizer');
        return;
      }

      // Check if there's an existing service request between this organizer and provider
      const allRequests = await getServiceRequests();
      const existingRequest = allRequests.find(r => 
        r.organizer_id === organizer.id && 
        r.service_provider_id === serviceProviderId
      );

      if (existingRequest) {
        // Route to status page if request exists
        navigate(`/modul8/provider/${serviceProviderId}/${existingRequest.id}/status`);
      } else {
        // Route to new request page if no existing request
        navigate(`/modul8/provider/${serviceProviderId}/request`);
      }

    } catch (error) {
      console.error('Error in smart engage:', error);
      toast({
        title: "Error",
        description: "Failed to process engagement request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleEngage,
    loading
  };
};
