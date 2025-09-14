
import { supabase } from "@/integrations/supabase/client";
import { ServiceRequest, ServiceProvider, Organizer } from "@/types/modul8";

// Cross-platform types
export interface NegotiationStatus {
  id: string;
  service_request_id: string;
  organizer_id: string;
  service_provider_id?: string;
  current_status: string;
  previous_status?: string;
  status_data: any;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CrossPlatformNotification {
  id: string;
  recipient_id: string;
  sender_id?: string;
  service_request_id?: string;
  notification_type: string;
  title: string;
  message: string;
  platform_context: 'modul8' | 'labr8' | 'both';
  data: any;
  read_at?: string;
  created_at: string;
}

export interface ActivityLogEntry {
  id: string;
  service_request_id: string;
  user_id: string;
  platform: 'modul8' | 'labr8';
  activity_type: string;
  activity_data: any;
  created_at: string;
}

// Helper function to transform database service request to our type
const transformServiceRequest = (dbRequest: any): ServiceRequest => {
  return {
    ...dbRequest,
    budget_range: typeof dbRequest.budget_range === 'object' && dbRequest.budget_range !== null 
      ? dbRequest.budget_range as { min?: number; max?: number; currency: string }
      : { currency: 'USD' },
    milestones: [], // Milestones will be fetched separately from modul8_project_milestones
    status: dbRequest.status as ServiceRequest['status'],
    engagement_status: dbRequest.engagement_status as ServiceRequest['engagement_status']
  };
};

// Helper function to transform database notification to our type
const transformNotification = (dbNotification: any): CrossPlatformNotification => {
  return {
    ...dbNotification,
    platform_context: dbNotification.platform_context as 'modul8' | 'labr8' | 'both',
    data: typeof dbNotification.data === 'object' && dbNotification.data !== null 
      ? dbNotification.data 
      : {}
  };
};

// Helper function to transform database activity log to our type
const transformActivityLog = (dbActivity: any): ActivityLogEntry => {
  return {
    ...dbActivity,
    platform: dbActivity.platform as 'modul8' | 'labr8',
    activity_data: typeof dbActivity.activity_data === 'object' && dbActivity.activity_data !== null 
      ? dbActivity.activity_data 
      : {}
  };
};

// Negotiation Status Management
export const createNegotiationStatus = async (data: {
  service_request_id: string;
  organizer_id: string;
  service_provider_id?: string;
  current_status: string;
  status_data?: any;
  updated_by: string;
}): Promise<NegotiationStatus> => {
  const { data: result, error } = await supabase
    .from('modul8_negotiation_status')
    .insert({
      service_request_id: data.service_request_id,
      organizer_id: data.organizer_id,
      service_provider_id: data.service_provider_id,
      current_status: data.current_status,
      status_data: data.status_data || {},
      updated_by: data.updated_by
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const updateNegotiationStatus = async (
  statusId: string,
  updates: {
    current_status?: string;
    service_provider_id?: string;
    status_data?: any;
    updated_by: string;
  }
): Promise<NegotiationStatus> => {
  const { data: result, error } = await supabase
    .from('modul8_negotiation_status')
    .update({
      previous_status: updates.current_status ? 
        (await supabase.from('modul8_negotiation_status').select('current_status').eq('id', statusId).single()).data?.current_status 
        : undefined,
      ...updates
    })
    .eq('id', statusId)
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getNegotiationStatus = async (serviceRequestId: string): Promise<NegotiationStatus | null> => {
  const { data, error } = await supabase
    .from('modul8_negotiation_status')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
};

// Cross-platform notifications
export const createCrossPlatformNotification = async (data: {
  recipient_id: string;
  sender_id?: string;
  service_request_id?: string;
  notification_type: string;
  title: string;
  message: string;
  platform_context: 'modul8' | 'labr8' | 'both';
  data?: any;
}): Promise<CrossPlatformNotification> => {
  const { data: result, error } = await (supabase as any)
    .from('cross_platform_notifications')
    .insert({
      user_id: data.recipient_id,
      notification_type: data.notification_type,
      title: data.title,
      message: data.message,
      metadata: {
        sender_id: data.sender_id,
        service_request_id: data.service_request_id,
        platform_context: data.platform_context,
        ...data.data
      }
    })
    .select()
    .single();

  if (error) throw error;
  return transformNotification(result);
};

export const getCrossPlatformNotifications = async (userId: string, platform?: 'modul8' | 'labr8'): Promise<CrossPlatformNotification[]> => {
  let query = (supabase as any)
    .from('cross_platform_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (platform) {
    query = query.in('platform_context', [platform, 'both']);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(transformNotification);
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const { error } = await (supabase as any)
    .from('cross_platform_notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

// Activity logging
export const logCrossPlatformActivity = async (data: {
  service_request_id: string;
  user_id: string;
  platform: 'modul8' | 'labr8';
  activity_type: string;
  activity_data?: any;
}): Promise<ActivityLogEntry> => {
  const { data: result, error } = await supabase
    .from('cross_platform_activity_log')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return transformActivityLog(result);
};

export const getActivityLog = async (serviceRequestId: string): Promise<ActivityLogEntry[]> => {
  const { data, error } = await (supabase as any)
    .from('cross_platform_activity_log')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(transformActivityLog);
};

// Enhanced service request operations with cross-platform integration
export const getServiceRequestWithNegotiationStatus = async (serviceRequestId: string) => {
  const [serviceRequest, negotiationStatus, activityLog, milestones] = await Promise.all([
    supabase
      .from('modul8_service_requests')
      .select(`
        *,
        service_provider:modul8_service_providers(*),
        organizer:modul8_organizers(*)
      `)
      .eq('id', serviceRequestId)
      .single(),
    getNegotiationStatus(serviceRequestId),
    getActivityLog(serviceRequestId),
    supabase
      .from('modul8_project_milestones')
      .select('title')
      .eq('service_request_id', serviceRequestId)
      .order('order_index', { ascending: true })
  ]);

  if (serviceRequest.error) throw serviceRequest.error;

  const transformedRequest = transformServiceRequest(serviceRequest.data);
  // Add milestones from separate table
  transformedRequest.milestones = milestones.data?.map(m => m.title) || [];

  return {
    serviceRequest: transformedRequest,
    negotiationStatus,
    activityLog
  };
};

// Cross-platform proposal management
export const handleProposalWithCrossPlatform = async (
  action: 'submit' | 'accept' | 'decline' | 'counter',
  data: {
    service_request_id: string;
    proposal_id?: string;
    user_id: string;
    details?: any;
  }
) => {
  // Log the activity
  await logCrossPlatformActivity({
    service_request_id: data.service_request_id,
    user_id: data.user_id,
    platform: 'modul8', // Assuming this is called from MODUL8
    activity_type: `proposal_${action}`,
    activity_data: data.details
  });

  // Update negotiation status based on action
  const statusMap = {
    submit: 'proposal_submitted',
    accept: 'proposal_accepted',
    decline: 'proposal_declined',
    counter: 'counter_proposal'
  };

  const negotiationStatus = await getNegotiationStatus(data.service_request_id);
  if (negotiationStatus) {
    await updateNegotiationStatus(negotiationStatus.id, {
      current_status: statusMap[action],
      status_data: data.details,
      updated_by: data.user_id
    });
  }

  return { success: true };
};

// Real-time subscription helpers
export const subscribeToCrossPlatformUpdates = (
  serviceRequestId: string,
  callbacks: {
    onNegotiationStatusChange?: (status: NegotiationStatus) => void;
    onActivityLog?: (activity: ActivityLogEntry) => void;
    onNotification?: (notification: CrossPlatformNotification) => void;
  }
) => {
  const channels: any[] = [];

  if (callbacks.onNegotiationStatusChange) {
    const statusChannel = supabase
      .channel(`negotiation-status-${serviceRequestId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'modul8_negotiation_status',
          filter: `service_request_id=eq.${serviceRequestId}`
        },
        (payload) => callbacks.onNegotiationStatusChange!(payload.new as NegotiationStatus)
      )
      .subscribe();
    channels.push(statusChannel);
  }

  if (callbacks.onActivityLog) {
    const activityChannel = supabase
      .channel(`activity-log-${serviceRequestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cross_platform_activity_log',
          filter: `service_request_id=eq.${serviceRequestId}`
        },
        (payload) => callbacks.onActivityLog!(transformActivityLog(payload.new))
      )
      .subscribe();
    channels.push(activityChannel);
  }

  if (callbacks.onNotification) {
    const notificationChannel = supabase
      .channel(`notifications-${serviceRequestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'cross_platform_notifications',
          filter: `service_request_id=eq.${serviceRequestId}`
        },
        (payload) => callbacks.onNotification!(transformNotification(payload.new))
      )
      .subscribe();
    channels.push(notificationChannel);
  }

  return () => {
    channels.forEach(channel => supabase.removeChannel(channel));
  };
};
