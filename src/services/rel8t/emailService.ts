
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type EmailStatus = "pending" | "sent" | "failed";

export interface EmailStatistics {
  pending: number;
  sent: number;
  failed: number;
  total: number;
}

export interface EmailNotification {
  id: string;
  user_id: string;
  trigger_id?: string;
  recipient_name?: string;
  recipient_email: string;
  subject: string;
  body: string;
  status: EmailStatus;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export const getEmailStatistics = async (): Promise<EmailStatistics> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Count pending emails
    const { count: pendingCount, error: pendingError } = await supabase
      .from("rms_email_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", 'pending');
    
    if (pendingError) throw pendingError;
    
    // Count sent emails
    const { count: sentCount, error: sentError } = await supabase
      .from("rms_email_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", 'sent');
    
    if (sentError) throw sentError;
    
    // Count failed emails
    const { count: failedCount, error: failedError } = await supabase
      .from("rms_email_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", 'failed');
    
    if (failedError) throw failedError;
    
    const total = (pendingCount || 0) + (sentCount || 0) + (failedCount || 0);
    
    return {
      pending: pendingCount || 0,
      sent: sentCount || 0,
      failed: failedCount || 0,
      total
    };
  } catch (error: any) {
    console.error("Error fetching email statistics:", error);
    toast({
      title: "Error fetching email statistics",
      description: error.message,
      variant: "destructive",
    });
    
    return {
      pending: 0,
      sent: 0,
      failed: 0,
      total: 0
    };
  }
};

export const getEmailNotifications = async (): Promise<EmailNotification[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from("rms_email_notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(notification => ({
      ...notification,
      recipient_email: '',
      metadata: notification.metadata as any
    })) as EmailNotification[];
  } catch (error: any) {
    console.error("Error fetching email notifications:", error);
    toast({
      title: "Error fetching email notifications",
      description: error.message,
      variant: "destructive",
    });
    
    return [];
  }
};
