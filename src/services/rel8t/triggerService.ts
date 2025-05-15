
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
}

// Time-based trigger types
export const TIME_TRIGGER_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

// Action types
export const TRIGGER_ACTIONS = {
  SEND_EMAIL: 'send_email',
  CREATE_TASK: 'create_task',
  ADD_REMINDER: 'add_reminder',
  SEND_NOTIFICATION: 'send_notification'
};

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
      description: "Time-based automation trigger has been successfully created.",
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

// Get trigger statistics by time frequency
export const getTriggerStatsByFrequency = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from("rms_triggers")
      .select("condition")
      .eq("is_active", true);

    if (error) throw error;

    // Count by frequency type
    const stats = {
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      quarterly: 0,
      yearly: 0,
      other: 0
    };
    
    data?.forEach(trigger => {
      if (trigger.condition === TIME_TRIGGER_TYPES.HOURLY) stats.hourly++;
      else if (trigger.condition === TIME_TRIGGER_TYPES.DAILY) stats.daily++;
      else if (trigger.condition === TIME_TRIGGER_TYPES.WEEKLY) stats.weekly++;
      else if (trigger.condition === TIME_TRIGGER_TYPES.MONTHLY) stats.monthly++;
      else if (trigger.condition === TIME_TRIGGER_TYPES.QUARTERLY) stats.quarterly++;
      else if (trigger.condition === TIME_TRIGGER_TYPES.YEARLY) stats.yearly++;
      else stats.other++;
    });
    
    return stats;
  } catch (error) {
    console.error("Error fetching trigger statistics by frequency:", error);
    return { hourly: 0, daily: 0, weekly: 0, monthly: 0, quarterly: 0, yearly: 0, other: 0 };
  }
};
