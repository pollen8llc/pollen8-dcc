import { Community } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

// Mock data for when database is not available
export const mockCommunities = [
  {
    id: "1",
    name: "React Developers",
    description: "A community for React developers to share knowledge and collaborate.",
    location: "Global",
    imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1470&auto=format&fit=crop",
    memberCount: 1250,
    organizerIds: ["38a18dd6-4742-419b-b2c1-70dec5c51729"],
    memberIds: [],
    tags: ["React", "JavaScript", "Web Development"],
    isPublic: true
  },
  {
    id: "2",
    name: "AI Enthusiasts",
    description: "A group for people passionate about artificial intelligence and machine learning.",
    location: "San Francisco",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47a04ca0ecd8?q=80&w=1470&auto=format&fit=crop",
    memberCount: 890,
    organizerIds: ["38a18dd6-4742-419b-b2c1-70dec5c51729"],
    memberIds: [],
    tags: ["AI", "Machine Learning", "Data Science"],
    isPublic: true
  },
  {
    id: "3",
    name: "Sustainable Living",
    description: "Connecting individuals committed to eco-friendly practices and sustainable lifestyles.",
    location: "Remote",
    imageUrl: "https://images.unsplash.com/photo-1484186390093-4091c65f0aee?q=80&w=1470&auto=format&fit=crop",
    memberCount: 620,
    organizerIds: ["38a18dd6-4742-419b-b2c1-70dec5c51729"],
    memberIds: [],
    tags: ["Sustainability", "Eco-Friendly", "Green Living"],
    isPublic: false
  }
];

/**
 * Maps a database community record to our application's Community model.
 * This handles the rename from member_count to communitySize.
 */
export const mapDbCommunity = (dbCommunity: any): Community => {
  return {
    ...dbCommunity,
    communitySize: dbCommunity.member_count || 0, // Map database field to new property name
    imageUrl: dbCommunity.logo_url || '/placeholder.svg',
    // Make sure other required properties exist
    organizerIds: dbCommunity.organizerIds || [],
    memberIds: dbCommunity.memberIds || [],
    tags: dbCommunity.tags || [],
    createdAt: dbCommunity.created_at || new Date().toISOString(),
    updatedAt: dbCommunity.updated_at || new Date().toISOString(),
  };
};

/**
 * Maps a legacy community object to our updated Community model
 */
export const mapLegacyCommunity = (legacyCommunity: any): Community => {
  return {
    ...legacyCommunity,
    communitySize: legacyCommunity.memberCount || 0, // Convert old memberCount to new communitySize
    createdAt: legacyCommunity.createdAt || new Date().toISOString(),
    updatedAt: legacyCommunity.updatedAt || new Date().toISOString(),
  };
};

// Export supabase client for repositories to use
export { supabase };
