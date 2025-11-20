import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PostgrestResponse } from "@supabase/supabase-js";
import { generateSystemEmail } from "./systemEmailService";
import { generateICSFile, triggerToICSEventData } from "./icsGenerationService";

// Time trigger types (for time-based automations)
export const TIME_TRIGGER_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

// Action types that triggers can perform
export const TRIGGER_ACTIONS = {
  SEND_EMAIL: 'send_email',
  CREATE_TASK: 'create_task',
  ADD_REMINDER: 'add_reminder',
  SEND_NOTIFICATION: 'send_notification'
};

// Update the RecurrencePattern interface to include all potential properties
export interface RecurrencePattern {
  type: string;
  startDate: string;
  endDate?: string;
  frequency?: number;
  daysOfWeek?: number[]; // Added for weekly recurrence
  dayOfMonth?: number;   // Added for monthly recurrence
  monthOfYear?: number;  // For yearly recurrence
  [key: string]: any;    // Add index signature to match Json type
}

export interface Trigger {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  condition: string;
  action: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  execution_time?: string;
  next_execution_at?: string;
  last_executed_at?: string;
  recurrence_pattern?: RecurrencePattern | null;
  system_email?: string;
  calendar_event_uid?: string;
}

export interface TriggerStats {
  active: number;
  pending: number;
  sent: number;
  failed: number;
  total: number;
}

export const getTriggers = async (): Promise<Trigger[]> => {
  try {
    const { data, error } = await supabase
      .from("rms_triggers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    return ((data || []).map((trigger: any) => ({
      ...trigger,
      condition: JSON.stringify(trigger.condition || {}),
      recurrence_pattern: trigger.recurrence_pattern as RecurrencePattern
    })) as Trigger[]);
  } catch (error: any) {
    console.error("Error fetching triggers:", error);
    toast({
      title: "Error fetching triggers",
      description: error.message,
      variant: "destructive",
    });
    return [];
  }
};

export const getTrigger = async (id: string): Promise<Trigger | null> => {
  try {
    const { data, error } = await supabase
      .from("rms_triggers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    
    // Transform the recurrence_pattern
    if (data) {
    return {
      ...data,
      condition: JSON.stringify(data.condition || {}),
      recurrence_pattern: data.recurrence_pattern as RecurrencePattern
    } as Trigger;
    }
    
    return null;
  } catch (error: any) {
    console.error(`Error fetching trigger ${id}:`, error);
    toast({
      title: "Error fetching trigger",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const createTrigger = async (trigger: Omit<Trigger, "id" | "user_id" | "created_at" | "updated_at" | "system_email" | "calendar_event_uid">): Promise<{ trigger: Trigger; icsContent: string } | null> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    // Get user profile for email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", user.id)
      .single();

    if (!profile?.email) throw new Error("User email not found");

    // Step 1: Create the initial trigger
    const { data, error } = await supabase
      .from("rms_triggers")
      .insert([{
        user_id: user.id,
        name: trigger.name,
        description: trigger.description,
        trigger_type: trigger.action,
        action: trigger.action,
        condition: JSON.stringify(trigger.condition || {}),
        is_active: trigger.is_active,
        next_execution_at: trigger.next_execution_at,
        last_executed_at: trigger.last_executed_at,
        recurrence_pattern: trigger.recurrence_pattern
      }])
      .select()
      .single();

    if (error) throw error;

    // Step 2: Generate system email and calendar UID
    const systemEmail = generateSystemEmail(user.id, data.id);
    const calendarEventUID = `trigger-${data.id}@ecosystembuilder.app`;

    // Step 3: Update trigger with calendar integration fields
    const { data: updatedTrigger, error: updateError } = await supabase
      .from("rms_triggers")
      .update({
        system_email: systemEmail,
        calendar_event_uid: calendarEventUID
      })
      .eq("id", data.id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Step 4: Generate ICS file
    const icsEventData = triggerToICSEventData(
      { ...updatedTrigger, time_trigger_type: trigger.action },
      profile.email,
      profile.full_name
    );
    const icsContent = generateICSFile(icsEventData);

    // Step 5: Send creation notification with ICS attachment
    try {
      const emailSubject = `📅 New Trigger Created: ${trigger.name}`;
      const emailBody = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">✅ Trigger Created Successfully</h1>
              </div>
              <div class="content">
                <h2 style="color: #1f2937; margin-top: 0;">${trigger.name}</h2>
                <p style="color: #4b5563; line-height: 1.6;">
                  ${trigger.description || 'Your automated trigger has been created and added to your calendar.'}
                </p>
                <p style="color: #6b7280; font-size: 14px;">
                  📧 <strong>System Email:</strong> ${systemEmail}<br>
                  📆 <strong>Calendar Event:</strong> Added to your calendar (see attachment)
                </p>
                <a href="https://pollen8.app/rel8/triggers" class="button">View All Triggers</a>
              </div>
            </div>
          </body>
        </html>
      `;

      await supabase.functions.invoke('send-email', {
        body: {
          to: profile.email,
          subject: emailSubject,
          html: emailBody,
          toName: profile.full_name,
          icsAttachment: {
            filename: `${trigger.name.replace(/[^a-z0-9]/gi, '_')}.ics`,
            content: icsContent
          }
        }
      });

      // Step 6: Create email notification record
      await supabase
        .from("rms_email_notifications")
        .insert({
          trigger_id: data.id,
          user_id: user.id,
          recipient_email: profile.email,
          subject: emailSubject,
          body: emailBody,
          status: 'sent',
          sent_at: new Date().toISOString(),
          scheduled_at: new Date().toISOString(),
          notification_type: 'creation',
          has_ics_attachment: true,
          ics_data: icsContent
        });
    } catch (emailError) {
      console.error("Error sending creation email:", emailError);
      // Don't fail trigger creation if email fails
    }

    toast({
      title: "Trigger created",
      description: "Automation trigger has been successfully created and added to your calendar.",
    });
    
    return {
      trigger: {
        ...updatedTrigger,
        condition: JSON.stringify(updatedTrigger.condition || {}),
        recurrence_pattern: updatedTrigger.recurrence_pattern as RecurrencePattern
      } as Trigger,
      icsContent
    };
  } catch (error: any) {
    console.error("Error creating trigger:", error);
    toast({
      title: "Error creating trigger",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const updateTrigger = async (id: string, trigger: Partial<Trigger>): Promise<Trigger | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Prepare the update object with any type conversions needed
    const updateData = {
      ...trigger,
      // Ensure recurrence_pattern is handled properly
      recurrence_pattern: trigger.recurrence_pattern
    };

    const { data, error } = await supabase
      .from("rms_triggers")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If trigger has calendar integration, send update notification
    if (data.system_email && data.calendar_event_uid) {
      try {
        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("user_id", user.id)
          .single();

        if (profile?.email) {
          // Generate updated ICS with incremented sequence
          const icsEventData = triggerToICSEventData(
            { ...data, time_trigger_type: data.trigger_type },
            profile.email,
            profile.full_name
          );
          icsEventData.sequence = (icsEventData.sequence || 0) + 1;
          const icsContent = generateICSFile(icsEventData);

          // Send update notification to both user and system email
          const emailSubject = `📝 Trigger Updated: ${data.name}`;
          const emailBody = `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
                  .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0;">📝 Trigger Updated</h1>
                  </div>
                  <div class="content">
                    <h2 style="color: #1f2937; margin-top: 0;">${data.name}</h2>
                    <p style="color: #4b5563;">Your trigger has been updated. The calendar event has been updated accordingly.</p>
                  </div>
                </div>
              </body>
            </html>
          `;

          // Send to user
          await supabase.functions.invoke('send-email', {
            body: {
              to: profile.email,
              subject: emailSubject,
              html: emailBody,
              toName: profile.full_name,
              icsAttachment: {
                filename: `${data.name.replace(/[^a-z0-9]/gi, '_')}_updated.ics`,
                content: icsContent
              }
            }
          });

          // Send to system email for tracking
          await supabase.functions.invoke('send-email', {
            body: {
              to: data.system_email,
              subject: emailSubject,
              html: emailBody,
              icsAttachment: {
                filename: `${data.name.replace(/[^a-z0-9]/gi, '_')}_updated.ics`,
                content: icsContent
              }
            }
          });

          // Create notification record
          await supabase
            .from("rms_email_notifications")
            .insert({
              trigger_id: id,
              user_id: user.id,
              recipient_email: profile.email,
              subject: emailSubject,
              body: emailBody,
              status: 'sent',
              sent_at: new Date().toISOString(),
              scheduled_at: new Date().toISOString(),
              notification_type: 'update',
              has_ics_attachment: true,
              ics_data: icsContent
            });
        }
      } catch (emailError) {
        console.error("Error sending update notification:", emailError);
        // Don't fail the update if email fails
      }
    }
    
    toast({
      title: "Trigger updated",
      description: "Automation trigger has been successfully updated.",
    });
    
    // Transform the returned data
    if (data) {
    return {
      ...data,
      condition: JSON.stringify(data.condition || {}),
      recurrence_pattern: data.recurrence_pattern as RecurrencePattern
    } as Trigger;
    }
    
    return null;
  } catch (error: any) {
    console.error(`Error updating trigger ${id}:`, error);
    toast({
      title: "Error updating trigger",
      description: error.message,
      variant: "destructive",
    });
    return null;
  }
};

export const deleteTrigger = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("rms_triggers")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    toast({
      title: "Trigger deleted",
      description: "Automation trigger has been successfully removed.",
    });
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting trigger ${id}:`, error);
    toast({
      title: "Error deleting trigger",
      description: error.message,
      variant: "destructive",
    });
    return false;
  }
};

export const getActiveTriggerCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from("rms_triggers")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching active trigger count:", error);
    return 0;
  }
};

export const getTriggerStats = async (): Promise<TriggerStats> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Count active triggers
    const { count: activeCount, error: activeError } = await supabase
      .from("rms_triggers")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true);
      
    if (activeError) throw activeError;
    
    // Count pending email notifications
    const { count: pendingCount, error: pendingError } = await supabase
      .from("rms_email_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", 'pending');
      
    if (pendingError) throw pendingError;
    
    // Count sent email notifications
    const { count: sentCount, error: sentError } = await supabase
      .from("rms_email_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", 'sent');
      
    if (sentError) throw sentError;
    
    // Count failed email notifications
    const { count: failedCount, error: failedError } = await supabase
      .from("rms_email_notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", 'failed');
      
    if (failedError) throw failedError;
    
    return {
      active: activeCount || 0,
      pending: pendingCount || 0,
      sent: sentCount || 0,
      failed: failedCount || 0,
      total: (pendingCount || 0) + (sentCount || 0) + (failedCount || 0)
    };
  } catch (error) {
    console.error('Error getting trigger statistics:', error);
    return {
      active: 0,
      pending: 0,
      sent: 0,
      failed: 0,
      total: 0
    };
  }
};

export const getTriggerStatsByType = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get all triggers
    const { data, error } = await supabase
      .from("rms_triggers")
      .select("condition")
      .eq("user_id", user.id);
      
    if (error) throw error;
    
    // Count by type manually instead of using group_by
    const countByType = (data || []).reduce((acc: any, trigger: any) => {
      const condition = JSON.stringify(trigger.condition || 'unknown');
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      hourly: countByType[TIME_TRIGGER_TYPES.HOURLY] || 0,
      daily: countByType[TIME_TRIGGER_TYPES.DAILY] || 0,
      weekly: countByType[TIME_TRIGGER_TYPES.WEEKLY] || 0,
      monthly: countByType[TIME_TRIGGER_TYPES.MONTHLY] || 0,
      quarterly: countByType[TIME_TRIGGER_TYPES.QUARTERLY] || 0,
      yearly: countByType[TIME_TRIGGER_TYPES.YEARLY] || 0
    };
  } catch (error) {
    console.error('Error getting trigger statistics by type:', error);
    return {
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      quarterly: 0,
      yearly: 0
    };
  }
};
