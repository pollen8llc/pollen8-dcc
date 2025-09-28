export class SolarSystemAvatarService {
  // Map user ID to solar system based on contact count
  static getSolarSystemId(userId?: string, contactCount: number = 0): string {
    // Default to UXI8000 for base system
    if (!userId || contactCount === 0) {
      return 'UXI8000';
    }

    // Determine tier based on contact count
    let tierStart: number;
    let tierEnd: number;

    if (contactCount >= 100) {
      // Tier 5: 100+ contacts - UXI8031-UXI8040
      tierStart = 31;
      tierEnd = 40;
    } else if (contactCount >= 50) {
      // Tier 4: 50+ contacts - UXI8021-UXI8030
      tierStart = 21;
      tierEnd = 30;
    } else if (contactCount >= 25) {
      // Tier 3: 25+ contacts - UXI8011-UXI8020
      tierStart = 11;
      tierEnd = 20;
    } else if (contactCount >= 10) {
      // Tier 2: 10+ contacts - UXI8001-UXI8010
      tierStart = 1;
      tierEnd = 10;
    } else {
      // Default: 0-9 contacts - UXI8000
      return 'UXI8000';
    }

    // Use consistent hashing to map user ID to a system within the tier
    const hash = this.hashUserId(userId);
    const tierSize = tierEnd - tierStart + 1;
    const systemIndex = (hash % tierSize) + tierStart;
    
    return `UXI8${systemIndex.toString().padStart(3, '0')}`;
  }

  // Simple hash function for consistent user ID mapping
  private static hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Get contact count for a user (placeholder - will be implemented later)
  static async getContactCount(userId?: string): Promise<number> {
    // TODO: Implement actual contact count logic when needed
    // For now, return 0 to use base system
    return 0;
  }

  // Get solar system ID for current user state
  static async getSolarSystemForUser(userId?: string): Promise<string> {
    if (!userId) {
      return 'UXI8000';
    }

    const contactCount = await this.getContactCount(userId);
    return this.getSolarSystemId(userId, contactCount);
  }
}