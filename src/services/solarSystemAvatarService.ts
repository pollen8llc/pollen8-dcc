import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/models/types";

export interface UserNetworkData {
  userId: string;
  role: UserRole;
  networkValue: number;
  rel8Contacts: number;
  cultiv8Posts: number;
  eco8Communities: number;
}

/**
 * Service for determining which solar system avatar a user should have
 * based on their role and network value
 */
export class SolarSystemAvatarService {
  
  /**
   * Get user's network data from profiles and iotas tables
   */
  static async getUserNetworkData(userId: string): Promise<UserNetworkData | null> {
    try {
      // Get user profile with role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, role, network_value')
        .eq('user_id', userId)
        .single();

      if (profileError || !profile) {
        console.error("Error fetching user profile:", profileError);
        return null;
      }

      // Get detailed iotas data
      const { data: iotas, error: iotasError } = await supabase
        .from('iotas')
        .select('rel8_contacts, cultiv8_posts, eco8_communities, total_network_value')
        .eq('user_id', userId)
        .single();

      // If no iotas record exists, create default values
      const networkData = iotas || {
        rel8_contacts: 0,
        cultiv8_posts: 0,
        eco8_communities: 0,
        total_network_value: 0
      };

      return {
        userId,
        role: (profile.role as UserRole) || UserRole.MEMBER,
        networkValue: profile.network_value || networkData.total_network_value || 0,
        rel8Contacts: networkData.rel8_contacts || 0,
        cultiv8Posts: networkData.cultiv8_posts || 0,
        eco8Communities: networkData.eco8_communities || 0,
      };
    } catch (error) {
      console.error("Exception in getUserNetworkData:", error);
      return null;
    }
  }

  /**
   * Determine which solar system ID a user should have based on their role and network value
   */
  static async getSolarSystemId(userId: string): Promise<string> {
    const networkData = await this.getUserNetworkData(userId);
    
    if (!networkData) {
      return "UXI8018"; // Default member system (Copper Harmony)
    }

    // Admin users get the psychedelic system
    if (networkData.role === UserRole.ADMIN) {
      return "UXI9000";
    }

    // Service Provider users get the Jade Triple system
    if (networkData.role === UserRole.SERVICE_PROVIDER) {
      return "UXI8035"; // Jade Triple
    }

    // Network value based assignment
    if (networkData.networkValue < 1000) {
      // Members get UXI8018, other roles get UXI8001
      if (networkData.role === UserRole.MEMBER || !networkData.role) {
        return "UXI8018"; // Copper Harmony
      }
      return "UXI8001"; // Aquamarine Single
    }

    // Higher network values get progressively better systems
    // Create tiers based on network value
    const networkTiers = [
      { threshold: 5000, systemId: "UXI8040" }, // Scarlet Storm
      { threshold: 4000, systemId: "UXI8038" }, // Forest Triple  
      { threshold: 3000, systemId: "UXI8031" }, // Emerald Ring
      { threshold: 2500, systemId: "UXI8026" }, // Turquoise Dense
      { threshold: 2000, systemId: "UXI8020" }, // Mint Cluster
      { threshold: 1800, systemId: "UXI8016" }, // Silver Cascade
      { threshold: 1600, systemId: "UXI8013" }, // Lime Spiral
      { threshold: 1400, systemId: "UXI8010" }, // Amber Trinity
      { threshold: 1200, systemId: "UXI8006" }, // Emerald Cluster
      { threshold: 1000, systemId: "UXI8005" }, // Golden Binary
    ];

    // Find the appropriate tier
    for (const tier of networkTiers) {
      if (networkData.networkValue >= tier.threshold) {
        return tier.systemId;
      }
    }

    // Default to basic member system
    // Members get UXI8018, other roles get UXI8000
    if (networkData.role === UserRole.MEMBER || !networkData.role) {
      return "UXI8018"; // Copper Harmony
    }
    return "UXI8000"; // Teal Base
  }

  /**
   * Cache solar system assignments to avoid repeated database calls
   */
  private static cache = new Map<string, { systemId: string; timestamp: number }>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async getCachedSolarSystemId(userId: string): Promise<string> {
    const now = Date.now();
    const cached = this.cache.get(userId);
    
    // Return cached result if it's still valid
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.systemId;
    }

    // Get fresh data and cache it
    const systemId = await this.getSolarSystemId(userId);
    this.cache.set(userId, { systemId, timestamp: now });
    
    return systemId;
  }

  /**
   * Clear cache for a specific user (useful after network value updates)
   */
  static clearUserCache(userId: string): void {
    this.cache.delete(userId);
  }

  /**
   * Clear all cache
   */
  static clearAllCache(): void {
    this.cache.clear();
  }
}