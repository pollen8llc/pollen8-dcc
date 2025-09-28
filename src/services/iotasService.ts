import { supabase } from "@/integrations/supabase/client";

export interface IotasData {
  id: string;
  user_id: string;
  rel8_contacts: number;
  cultiv8_posts: number;
  eco8_communities: number;
  total_network_value: number;
  created_at: string;
  updated_at: string;
}

/**
 * Service for managing user iotas (network metrics)
 */
export class IotasService {
  
  /**
   * Get or create iotas record for a user
   */
  static async getOrCreateIotas(userId: string): Promise<IotasData | null> {
    try {
      const { data, error } = await supabase.rpc('get_or_create_iotas', {
        p_user_id: userId
      });

      if (error) {
        console.error("Error getting/creating iotas:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Exception in getOrCreateIotas:", error);
      return null;
    }
  }

  /**
   * Increment a specific metric for a user
   */
  static async incrementMetric(
    userId: string, 
    metricType: 'rel8_contacts' | 'cultiv8_posts' | 'eco8_communities',
    increment: number = 1
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('increment_iota_metric', {
        p_user_id: userId,
        p_metric_type: metricType,
        p_increment: increment
      });

      if (error) {
        console.error(`Error incrementing ${metricType}:`, error);
        return false;
      }

      return data;
    } catch (error) {
      console.error(`Exception incrementing ${metricType}:`, error);
      return false;
    }
  }

  /**
   * Get user's current iotas data
   */
  static async getUserIotas(userId: string): Promise<IotasData | null> {
    try {
      const { data, error } = await supabase
        .from('iotas')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching user iotas:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Exception in getUserIotas:", error);
      return null;
    }
  }

  /**
   * Update network value in profiles table
   */
  static async updateNetworkValue(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('update_network_value', {
        p_user_id: userId
      });

      if (error) {
        console.error("Error updating network value:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exception in updateNetworkValue:", error);
      return false;
    }
  }

  /**
   * Increment rel8 contacts
   */
  static async incrementRel8Contacts(userId: string, count: number = 1): Promise<boolean> {
    return this.incrementMetric(userId, 'rel8_contacts', count);
  }

  /**
   * Increment cultiv8 posts
   */
  static async incrementCultiv8Posts(userId: string, count: number = 1): Promise<boolean> {
    return this.incrementMetric(userId, 'cultiv8_posts', count);
  }

  /**
   * Increment eco8 communities
   */
  static async incrementEco8Communities(userId: string, count: number = 1): Promise<boolean> {
    return this.incrementMetric(userId, 'eco8_communities', count);
  }
}