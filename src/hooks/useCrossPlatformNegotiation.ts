import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NegotiationStatus {
  id: string;
  request_id: string;
  current_status: string;
  previous_status?: string;
  updated_at: string;
  updated_by: string;
}

interface ActivityLog {
  id: string;
  request_id: string;
  activity_type: string;
  description?: string;
  created_at: string;
  created_by: string;
}

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const useCrossPlatformNegotiation = (requestId: string) => {
  const [negotiationStatus, setNegotiationStatus] = useState<NegotiationStatus | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    if (!requestId) return;
    
    setIsLoading(true);
    try {
      // Fetch negotiation status
      const { data: statusData } = await supabase
        .from('negotiation_status')
        .select('*')
        .eq('request_id', requestId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      
      if (statusData) {
        setNegotiationStatus(statusData);
      }

      // Fetch activity log
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('*')
        .eq('request_id', requestId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (activityData) {
        setActivityLog(activityData);
      }

      // Fetch notifications for current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: notificationData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('read', false)
          .order('created_at', { ascending: false });
        
        if (notificationData) {
          setNotifications(notificationData);
        }
      }
    } catch (error) {
      console.error('Error refreshing negotiation data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProposal = async (proposalData: any) => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .insert(proposalData)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase
        .from('activity_log')
        .insert({
          request_id: requestId,
          activity_type: 'proposal_submitted',
          description: 'New proposal submitted',
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      await refreshData();
      return data;
    } catch (error) {
      console.error('Error handling proposal:', error);
      throw error;
    }
  };

  const sendNotification = async (userId: string, title: string, message: string) => {
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          read: false
        });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, [requestId]);

  return {
    negotiationStatus,
    activityLog,
    notifications,
    isLoading,
    refreshData,
    handleProposal,
    sendNotification
  };
};
