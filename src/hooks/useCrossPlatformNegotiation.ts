import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  getServiceRequestWithNegotiationStatus,
  subscribeToCrossPlatformUpdates,
  handleProposalWithCrossPlatform,
  createCrossPlatformNotification,
  type NegotiationStatus,
  type ActivityLogEntry,
  type CrossPlatformNotification
} from '@/services/crossPlatformService';

export const useCrossPlatformNegotiation = (serviceRequestId: string) => {
  const [negotiationStatus, setNegotiationStatus] = useState<NegotiationStatus | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [notifications, setNotifications] = useState<CrossPlatformNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!serviceRequestId) return;

    try {
      setLoading(true);
      const data = await getServiceRequestWithNegotiationStatus(serviceRequestId);
      setNegotiationStatus(data.negotiationStatus);
      setActivityLog(data.activityLog);
    } catch (error) {
      console.error('Error loading negotiation data:', error);
    } finally {
      setLoading(false);
    }
  }, [serviceRequestId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!serviceRequestId) return;

    const unsubscribe = subscribeToCrossPlatformUpdates(serviceRequestId, {
      onNegotiationStatusChange: (status) => {
        setNegotiationStatus(status);
      },
      onActivityLog: (activity) => {
        setActivityLog(prev => [...prev, activity]);
      },
      onNotification: (notification) => {
        setNotifications(prev => [...prev, notification]);
      }
    });

    return unsubscribe;
  }, [serviceRequestId]);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  const handleProposal = useCallback(async (
    action: 'submit' | 'accept' | 'decline' | 'counter',
    data: { proposal_id?: string; user_id: string; details?: any }
  ) => {
    try {
      await handleProposalWithCrossPlatform(action, {
        service_request_id: serviceRequestId,
        proposal_id: data.proposal_id,
        user_id: data.user_id,
        details: data.details
      });
      await refreshData();
    } catch (error) {
      console.error('Error handling proposal:', error);
      throw error;
    }
  }, [serviceRequestId, refreshData]);

  const sendNotification = useCallback(async (
    recipientId: string,
    title: string,
    message: string,
    platform: 'modul8' | 'labr8' | 'both'
  ) => {
    try {
      await createCrossPlatformNotification({
        recipient_id: recipientId,
        service_request_id: serviceRequestId,
        notification_type: 'proposal_update',
        title,
        message,
        platform_context: platform,
        data: { service_request_id: serviceRequestId }
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }, [serviceRequestId]);

  return {
    negotiationStatus,
    activityLog,
    notifications,
    loading,
    refreshData,
    handleProposal,
    sendNotification
  };
};
