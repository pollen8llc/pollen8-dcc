
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface Trigger {
  id: string;
  name: string;
  description?: string;
  condition: string;
  action: string;
  is_active: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Time trigger types (for time-based automations)
export const TIME_TRIGGER_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
};

// Action types that triggers can perform
export const TRIGGER_ACTIONS = {
  SEND_EMAIL: 'send_email',
  CREATE_TASK: 'create_task',
  ADD_REMINDER: 'add_reminder',
  SEND_NOTIFICATION: 'send_notification',
};

/**
 * Create a new trigger
 */
export const createTrigger = async (
  triggerData: Omit<Trigger, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Trigger> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newTrigger = {
      ...triggerData,
      user_id: user.id,
      id: uuidv4(),
    };

    const { data, error } = await supabase
      .from('rms_triggers')
      .insert(newTrigger)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data as Trigger;
  } catch (error) {
    console.error('Error creating trigger:', error);
    throw error;
  }
};

/**
 * Get all triggers for the current user
 */
export const getTriggers = async (): Promise<Trigger[]> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('rms_triggers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Trigger[];
  } catch (error) {
    console.error('Error fetching triggers:', error);
    return [];
  }
};

/**
 * Get a trigger by ID
 */
export const getTriggerById = async (id: string): Promise<Trigger | null> => {
  try {
    const { data, error } = await supabase
      .from('rms_triggers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as Trigger;
  } catch (error) {
    console.error(`Error fetching trigger with ID ${id}:`, error);
    return null;
  }
};

/**
 * Update a trigger by ID
 */
export const updateTrigger = async (
  id: string,
  updates: Partial<Trigger>
): Promise<Trigger | null> => {
  try {
    const { data, error } = await supabase
      .from('rms_triggers')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data as Trigger;
  } catch (error) {
    console.error(`Error updating trigger with ID ${id}:`, error);
    return null;
  }
};

/**
 * Delete a trigger by ID
 */
export const deleteTrigger = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('rms_triggers')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting trigger with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get trigger statistics
 */
export const getTriggerStats = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Count active triggers
    const { count: activeCount, error: activeError } = await supabase
      .from('rms_triggers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (activeError) {
      throw activeError;
    }

    // Count pending email notifications
    const { count: pendingCount, error: pendingError } = await supabase
      .from('rms_email_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'pending');

    if (pendingError) {
      throw pendingError;
    }

    // Count sent email notifications
    const { count: sentCount, error: sentError } = await supabase
      .from('rms_email_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'sent');

    if (sentError) {
      throw sentError;
    }

    // Count failed email notifications
    const { count: failedCount, error: failedError } = await supabase
      .from('rms_email_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'failed');

    if (failedError) {
      throw failedError;
    }

    // Return counts
    return {
      active: activeCount || 0,
      pending: pendingCount || 0,
      sent: sentCount || 0,
      failed: failedCount || 0,
      total: (pendingCount || 0) + (sentCount || 0) + (failedCount || 0),
    };
  } catch (error) {
    console.error('Error getting trigger statistics:', error);
    return {
      active: 0,
      pending: 0,
      sent: 0,
      failed: 0,
      total: 0,
    };
  }
};

/**
 * Get trigger statistics by type
 */
export const getTriggerStatsByType = async () => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get all triggers
    const { data, error } = await supabase
      .from('rms_triggers')
      .select('condition')
      .eq('user_id', user.id);
      
    if (error) {
      throw error;
    }
    
    // Count by type manually instead of using group_by
    const countByType = data.reduce((acc: Record<string, number>, trigger) => {
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
      yearly: countByType[TIME_TRIGGER_TYPES.YEARLY] || 0,
    };
  } catch (error) {
    console.error('Error getting trigger statistics by type:', error);
    return {
      hourly: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      quarterly: 0,
      yearly: 0,
    };
  }
};
