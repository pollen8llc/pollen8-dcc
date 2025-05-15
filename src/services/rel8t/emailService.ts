
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EmailNotification {
  id: string;
  user_id: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  trigger_id?: string;
  scheduled_for?: string;
  sent_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmailStatistics {
  pending: number;
  sent: number;
  failed: number;
  total: number;
}

export const createEmailNotification = async (notification: Omit<EmailNotification, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'>): Promise<EmailNotification | null> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const emailToInsert = {
      ...notification,
      user_id: user.id,
      status: 'pending'
    };

    const { data, error } = await supabase
      .from('rms_email_notifications')
      .insert([emailToInsert])
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error("Error creating email notification:", error);
    toast({
      title: "Error creating email notification",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const getEmailNotifications = async (): Promise<EmailNotification[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('rms_email_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching email notifications:", error);
    toast({
      title: "Error fetching notifications",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const getEmailStatistics = async (): Promise<EmailStatistics> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Count pending emails
    const { count: pendingCount, error: pendingError } = await supabase
      .from('rms_email_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'pending');
    
    if (pendingError) throw pendingError;

    // Count sent emails
    const { count: sentCount, error: sentError } = await supabase
      .from('rms_email_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'sent');
    
    if (sentError) throw sentError;

    // Count failed emails
    const { count: failedCount, error: failedError } = await supabase
      .from('rms_email_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'failed');
    
    if (failedError) throw failedError;

    return {
      pending: pendingCount || 0,
      sent: sentCount || 0,
      failed: failedCount || 0,
      total: (pendingCount || 0) + (sentCount || 0) + (failedCount || 0)
    };
  } catch (error: any) {
    console.error("Error fetching email statistics:", error);
    return {
      pending: 0,
      sent: 0,
      failed: 0,
      total: 0
    };
  }
};

export const updateEmailNotificationStatus = async (id: string, status: 'pending' | 'sent' | 'failed'): Promise<boolean> => {
  try {
    const updates: any = { status };
    
    // If marking as sent, also record the sent timestamp
    if (status === 'sent') {
      updates.sent_at = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('rms_email_notifications')
      .update(updates)
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error(`Error updating email notification status:`, error);
    return false;
  }
};

export const deleteEmailNotification = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('rms_email_notifications')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error(`Error deleting email notification:`, error);
    return false;
  }
};
