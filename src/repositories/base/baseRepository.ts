
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";
import { communities as mockCommunities } from "@/data/communities";

/**
 * Maps database community object to model Community type
 */
export const mapDbCommunity = (dbCommunity: any): Community => {
  return {
    id: dbCommunity.id,
    name: dbCommunity.name,
    description: dbCommunity.description || "",
    location: dbCommunity.location || "Remote",
    imageUrl: dbCommunity.logo_url,
    memberCount: dbCommunity.member_count || 0,
    organizerIds: [], // Will be populated by community_members queries
    memberIds: [], // Will be populated by community_members queries
    tags: [], // Will be populated later
    isPublic: true,
    createdAt: dbCommunity.created_at,
    updatedAt: dbCommunity.updated_at,
    website: dbCommunity.website
  };
};

/**
 * Exports for use in repositories
 */
export { supabase, mockCommunities };
