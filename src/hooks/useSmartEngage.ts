
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
    console.log('🚀 Smart Engage clicked for provider:', serviceProviderId);
    
    if (!session?.user?.id) {
      console.log('❌ No user session found');
      toast({
        title: "Authentication Required",
        description: "Please log in to engage with service providers",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      console.log('📋 Loading organizer data for user:', session.user.id);

      // Get the current user's organizer profile
      const organizer = await getUserOrganizer(session.user.id);
      console.log('👤 Organizer data:', organizer);
      
      if (!organizer) {
        console.log('❌ No organizer profile found, redirecting to setup');
        toast({
          title: "Profile Required",
          description: "Please complete your organizer profile first",
          variant: "destructive"
        });
        navigate('/modul8/setup/organizer');
        return;
      }

      // Check if there's an existing service request between this organizer and provider
      console.log('🔍 Checking for existing requests...');
      const allRequests = await getServiceRequests();
      console.log('📋 All requests:', allRequests.length);
      
      const existingRequest = allRequests.find(r => 
        r.organizer_id === organizer.id && 
        r.service_provider_id === serviceProviderId
      );
      console.log('🔍 Existing request found:', existingRequest);

      if (existingRequest) {
        const targetUrl = `/modul8/provider/${serviceProviderId}/${existingRequest.id}/status`;
        console.log('✅ Navigating to existing request status:', targetUrl);
        navigate(targetUrl);
      } else {
        const targetUrl = `/modul8/provider/${serviceProviderId}/request`;
        console.log('✅ Navigating to new request form:', targetUrl);
        navigate(targetUrl);
      }

    } catch (error) {
      console.error('💥 Error in smart engage:', error);
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
