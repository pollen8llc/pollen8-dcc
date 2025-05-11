
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmailNotification {
  id: string;
  user_id: string;
  recipient_email: string;
  recipient_name?: string;
  subject: string;
  body: string;
  status: "pending" | "sent" | "failed";
  sent_at?: string;
  scheduled_for?: string;
  trigger_id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get email templates
 */
export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from("rms_email_templates")
      .select("*")
      .order("name") as { data: EmailTemplate[], error: any };

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching email templates:", error);
    toast({
      title: "Error fetching email templates",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Create email template
 */
export const createEmailTemplate = async (
  template: Omit<EmailTemplate, "id" | "created_at" | "updated_at">
): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_email_templates")
      .insert([template])
      .select()
      .single() as { data: EmailTemplate, error: any };

    if (error) throw error;

    toast({
      title: "Template created",
      description: "Email template has been successfully created.",
    });

    return data;
  } catch (error: any) {
    console.error("Error creating email template:", error);
    toast({
      title: "Error creating template",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Update email template
 */
export const updateEmailTemplate = async (
  id: string,
  template: Partial<EmailTemplate>
): Promise<EmailTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_email_templates")
      .update(template)
      .eq("id", id)
      .select()
      .single() as { data: EmailTemplate, error: any };

    if (error) throw error;

    toast({
      title: "Template updated",
      description: "Email template has been successfully updated.",
    });

    return data;
  } catch (error: any) {
    console.error(`Error updating email template ${id}:`, error);
    toast({
      title: "Error updating template",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Delete email template
 */
export const deleteEmailTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("rms_email_templates")
      .delete()
      .eq("id", id);

    if (error) throw error;

    toast({
      title: "Template deleted",
      description: "Email template has been successfully removed.",
    });

    return true;
  } catch (error: any) {
    console.error(`Error deleting email template ${id}:`, error);
    toast({
      title: "Error deleting template",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Schedule an email notification
 */
export const scheduleEmailNotification = async (
  notification: Omit<EmailNotification, "id" | "status" | "created_at" | "updated_at">
): Promise<EmailNotification | null> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const notificationToInsert = {
      ...notification,
      user_id: user.id,
      status: "pending" as const
    };

    const { data, error } = await supabase
      .from("rms_email_notifications")
      .insert([notificationToInsert])
      .select()
      .single() as { data: EmailNotification, error: any };

    if (error) throw error;

    toast({
      title: "Email scheduled",
      description: "Your email notification has been scheduled.",
    });

    return data;
  } catch (error: any) {
    console.error("Error scheduling email notification:", error);
    toast({
      title: "Error scheduling email",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Get email notifications
 */
export const getEmailNotifications = async (status?: string): Promise<EmailNotification[]> => {
  try {
    let query = supabase
      .from("rms_email_notifications")
      .select("*");
    
    if (status) {
      query = query.eq("status", status);
    }
    
    query = query.order("created_at", { ascending: false });
    
    const { data, error } = await query as { data: EmailNotification[], error: any };

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching email notifications:", error);
    toast({
      title: "Error fetching emails",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Get email notification statistics
 */
export const getEmailStatistics = async (): Promise<{ 
  pending: number; 
  sent: number; 
  failed: number; 
  total: number;
}> => {
  try {
    const { data, error } = await supabase
      .from("rms_email_notifications")
      .select("status") as { data: { status: string }[], error: any };

    if (error) throw error;

    const stats = {
      pending: 0,
      sent: 0,
      failed: 0,
      total: data.length
    };

    data.forEach((notification) => {
      if (notification.status === "pending") stats.pending++;
      if (notification.status === "sent") stats.sent++;
      if (notification.status === "failed") stats.failed++;
    });

    return stats;
  } catch (error) {
    console.error("Error fetching email statistics:", error);
    return { pending: 0, sent: 0, failed: 0, total: 0 };
  }
};

/**
 * Process a trigger to send email
 * This would typically be called by a cron job or scheduled function
 */
export const processTriggerEmail = async (triggerId: string): Promise<boolean> => {
  try {
    // This function would be implemented in a Supabase Edge Function 
    // that would handle the actual email sending based on triggers
    // For now, let's just mark the email as sent in our database
    
    const { data, error } = await supabase
      .from("rms_email_notifications")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("trigger_id", triggerId)
      .eq("status", "pending");
      
    if (error) throw error;
    
    // In a real implementation, this would invoke an Edge Function to send the email
    // supabase.functions.invoke('send-trigger-email', { body: { triggerId } });
    
    return true;
  } catch (error: any) {
    console.error(`Error processing trigger email for trigger ${triggerId}:`, error);
    return false;
  }
};
