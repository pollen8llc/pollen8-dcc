
import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/hooks/useSession';
import {
  getServiceRequestWithNegotiationStatus,
  subscribeToCrossPlatformUpdates,
  handleProposalWithCrossPlatform,
  createCrossPlatformNotification,
  getCrossPlatformNotifications,
  markNotificationAsRead,
  NegotiationStatus,
  ActivityLogEntry,
  CrossPlatformNotification
} from '@/services/crossPlatformService';
import { ServiceRequest } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';

interface UseCrossPlatformNegotiationReturn {
  serviceRequest: ServiceRequest | null;
  negotiationStatus: NegotiationStatus | null;
  activityLog: ActivityLogEntry[];
  notifications: CrossPlatformNotification[];
  loading: boolean;
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
  handleProposal: (action: 'submit' | 'accept' | 'decline' | 'counter', details?: any) => Promise<void>;
  sendNotification: (recipientId: string, title: string, message: string, platform: 'modul8' | 'labr8') => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
}

export const useCrossPlatformNegotiation = (
  serviceRequestId: string
): UseCrossPlatformNegotiationReturn => {
  const { session } = useSession();
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null);
  const [negotiationStatus, setNegotiationStatus] = useState<NegotiationStatus | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [notifications, setNotifications] = useState<CrossPlatformNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    if (!serviceRequestId || !session?.user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const [requestData, userNotifications] = await Promise.all([
        getServiceRequestWithNegotiationStatus(serviceRequestId),
        getCrossPlatformNotifications(session.user.id)
      ]);

      setServiceRequest(requestData.serviceRequest);
      setNegotiationStatus(requestData.negotiationStatus);
      setActivityLog(requestData.activityLog);
      setNotifications(userNotifications.filter(n => n.service_request_id === serviceRequestId));
    } catch (err) {
      console.error('Error loading cross-platform data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      toast({
        title: "Error",
        description: "Failed to load negotiation data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [serviceRequestId, session?.user?.id]);

  const handleProposal = useCallback(async (
    action: 'submit' | 'accept' | 'decline' | 'counter',
    details?: any
  ) => {
    if (!session?.user?.id || !serviceRequestId) return;

    try {
      await handleProposalWithCrossPlatform(action, {
        service_request_id: serviceRequestId,
        user_id: session.user.id,
        details
      });

      toast({
        title: "Success",
        description: `Proposal ${action} completed successfully`,
      });

      await refreshData();
    } catch (err) {
      console.error(`Error handling proposal ${action}:`, err);
      toast({
        title: "Error",
        description: `Failed to ${action} proposal`,
        variant: "destructive"
      });
    }
  }, [session?.user?.id, serviceRequestId, refreshData]);

  const sendNotification = useCallback(async (
    recipientId: string,
    title: string,
    message: string,
    platform: 'modul8' | 'labr8'
  ) => {
    if (!session?.user?.id) return;

    try {
      await createCrossPlatformNotification({
        recipient_id: recipientId,
        sender_id: session.user.id,
        service_request_id: serviceRequestId,
        notification_type: 'message',
        title,
        message,
        platform_context: platform
      });

      toast({
        title: "Notification sent",
        description: "Your message has been delivered"
      });
    } catch (err) {
      console.error('Error sending notification:', err);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
    }
  }, [session?.user?.id, serviceRequestId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!serviceRequestId) return;

    const unsubscribe = subscribeToCrossPlatformUpdates(serviceRequestId, {
      onNegotiationStatusChange: (status) => {
        setNegotiationStatus(status);
        toast({
          title: "Status Updated",
          description: `Negotiation status changed to: ${status.current_status}`
        });
      },
      onActivityLog: (activity) => {
        setActivityLog(prev => [...prev, activity]);
      },
      onNotification: (notification) => {
        if (notification.recipient_id === session?.user?.id) {
          setNotifications(prev => [notification, ...prev]);
          toast({
            title: notification.title,
            description: notification.message
          });
        }
      }
    });

    return unsubscribe;
  }, [serviceRequestId, session?.user?.id]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    serviceRequest,
    negotiationStatus,
    activityLog,
    notifications,
    loading,
    error,
    refreshData,
    handleProposal,
    sendNotification,
    markAsRead
  };
};
