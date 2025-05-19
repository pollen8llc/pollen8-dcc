
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Time trigger types (for time-based automations)
export const TIME_TRIGGER_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
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

export interface RecurrencePattern {
  type: string;
  startDate: string;
  endDate?: string;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
  frequency?: number;
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
  next_execution?: string;
  last_executed_at?: string;
  recurrence_pattern?: RecurrencePattern | null;
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
    return data || [];
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
    return data;
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

export const createTrigger = async (trigger: Omit<Trigger, "id" | "user_id" | "created_at" | "updated_at">): Promise<Trigger | null> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("User not authenticated");

    const triggerToInsert = {
      ...trigger,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from("rms_triggers")
      .insert([triggerToInsert])
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Trigger created",
      description: "Automation trigger has been successfully created.",
    });
    
    return data;
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
    const { data, error } = await supabase
      .from("rms_triggers")
      .update(trigger)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    toast({
      title: "Trigger updated",
      description: "Automation trigger has been successfully updated.",
    });
    
    return data;
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
    const countByType = data.reduce((acc, trigger) => {
      const condition = trigger.condition;
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {});
    
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
