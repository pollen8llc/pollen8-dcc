
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NegotiationStatus {
  id: string;
  service_request_id: string;
  current_status: string;
  previous_status?: string;
  updated_at: string;
  updated_by: string;
  status_data?: any;
}

interface ActivityLog {
  id: string;
  service_request_id: string;
  activity_type: string;
  platform: string;
  user_id: string;
  activity_data?: any;
  created_at: string;
}

interface CrossPlatformNotification {
  id: string;
  service_request_id: string;
  notification_type: string;
  title: string;
  message: string;
  recipient_id: string;
  sender_id?: string;
  platform_context: string;
  data?: any;
  read_at?: string;
  created_at: string;
}

export const useCrossPlatformNegotiation = (serviceRequestId: string) => {
  const [negotiationStatus, setNegotiationStatus] = useState<NegotiationStatus | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<CrossPlatformNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNegotiationData = useCallback(async () => {
    if (!serviceRequestId) return;

    try {
      setLoading(true);

      // Load negotiation status
      const { data: statusData, error: statusError } = await supabase
        .from('modul8_negotiation_status')
        .select('*')
        .eq('service_request_id', serviceRequestId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (statusError) {
        console.error('Error loading negotiation status:', statusError);
      } else {
        setNegotiationStatus(statusData);
      }

      // Load activity log
      const { data: activityData, error: activityError } = await supabase
        .from('cross_platform_activity_log')
        .select('*')
        .eq('service_request_id', serviceRequestId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (activityError) {
        console.error('Error loading activity log:', activityError);
      } else {
        setActivityLog(activityData || []);
      }

      // Load notifications
      const { data: notificationData, error: notificationError } = await supabase
        .from('cross_platform_notifications')
        .select('*')
        .eq('service_request_id', serviceRequestId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (notificationError) {
        console.error('Error loading notifications:', notificationError);
      } else {
        setNotifications(notificationData || []);
      }

    } catch (error) {
      console.error('Error in loadNegotiationData:', error);
    } finally {
      setLoading(false);
    }
  }, [serviceRequestId]);

  const refreshData = useCallback(() => {
    loadNegotiationData();
  }, [loadNegotiationData]);

  const logActivity = useCallback(async (
    activityType: string,
    platform: string,
    userId: string,
    activityData?: any
  ) => {
    try {
      const { error } = await supabase
        .from('cross_platform_activity_log')
        .insert({
          service_request_id: serviceRequestId,
          activity_type: activityType,
          platform: platform,
          user_id: userId,
          activity_data: activityData || {}
        });

      if (error) {
        console.error('Error logging activity:', error);
      } else {
        // Refresh activity log
        refreshData();
      }
    } catch (error) {
      console.error('Error in logActivity:', error);
    }
  }, [serviceRequestId, refreshData]);

  const sendNotification = useCallback(async (
    notificationType: string,
    title: string,
    message: string,
    recipientId: string,
    senderId?: string,
    platformContext: string = 'cross_platform',
    data?: any
  ) => {
    try {
      const { error } = await supabase
        .from('cross_platform_notifications')
        .insert({
          service_request_id: serviceRequestId,
          notification_type: notificationType,
          title: title,
          message: message,
          recipient_id: recipientId,
          sender_id: senderId,
          platform_context: platformContext,
          data: data || {}
        });

      if (error) {
        console.error('Error sending notification:', error);
      } else {
        // Refresh notifications
        refreshData();
      }
    } catch (error) {
      console.error('Error in sendNotification:', error);
    }
  }, [serviceRequestId, refreshData]);

  const updateNegotiationStatus = useCallback(async (
    newStatus: string,
    userId: string,
    statusData?: any
  ) => {
    try {
      const currentStatus = negotiationStatus?.current_status;

      const { error } = await supabase
        .from('modul8_negotiation_status')
        .upsert({
          service_request_id: serviceRequestId,
          current_status: newStatus,
          previous_status: currentStatus,
          updated_by: userId,
          status_data: statusData || {},
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'service_request_id'
        });

      if (error) {
        console.error('Error updating negotiation status:', error);
      } else {
        // Log the status change activity
        await logActivity('status_change', 'cross_platform', userId, {
          from_status: currentStatus,
          to_status: newStatus,
          status_data: statusData
        });
        
        // Refresh data
        refreshData();
      }
    } catch (error) {
      console.error('Error in updateNegotiationStatus:', error);
    }
  }, [serviceRequestId, negotiationStatus, logActivity, refreshData]);

  const handleProposal = useCallback(async (
    action: 'submit' | 'accept' | 'decline' | 'counter',
    userId: string,
    proposalData?: any
  ) => {
    try {
      // Log the proposal activity
      await logActivity(`proposal_${action}`, 'cross_platform', userId, proposalData);

      // Update negotiation status based on action
      let newStatus = negotiationStatus?.current_status || 'pending';
      switch (action) {
        case 'submit':
          newStatus = 'negotiating';
          break;
        case 'accept':
          newStatus = 'agreed';
          break;
        case 'decline':
          newStatus = 'declined';
          break;
        case 'counter':
          newStatus = 'negotiating';
          break;
      }

      await updateNegotiationStatus(newStatus, userId, { proposal_action: action, ...proposalData });

    } catch (error) {
      console.error('Error in handleProposal:', error);
    }
  }, [negotiationStatus, logActivity, updateNegotiationStatus]);

  useEffect(() => {
    loadNegotiationData();
  }, [loadNegotiationData]);

  return {
    negotiationStatus,
    activityLog,
    notifications,
    loading,
    refreshData,
    logActivity,
    sendNotification,
    updateNegotiationStatus,
    handleProposal
  };
};
