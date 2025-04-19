import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";
import { communities as mockCommunities } from "@/data/communities";

/**
 * Maps a database community record to a Community model
 */
export const mapDbCommunity = (dbCommunity: any): Community => {
  return {
    id: dbCommunity.id || String(Date.now()),
    name: dbCommunity.name || "Unnamed Community",
    description: dbCommunity.description || "",
    location: dbCommunity.location || "Remote",
    imageUrl: dbCommunity.logo_url || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: dbCommunity.member_count || 0,
    organizerIds: dbCommunity.organizer_ids || [],
    memberIds: dbCommunity.member_ids || [],
    tags: dbCommunity.tags || [],
    isPublic: dbCommunity.is_public !== undefined ? dbCommunity.is_public : true,
    createdAt: dbCommunity.created_at || new Date().toISOString(),
    updatedAt: dbCommunity.updated_at || new Date().toISOString(),
    website: dbCommunity.website || "",
    founder_name: dbCommunity.founder_name || "",
    role_title: dbCommunity.role_title || "",
    personal_background: dbCommunity.personal_background || "",
    community_structure: dbCommunity.community_structure || "",
    vision: dbCommunity.vision || "",
    community_values: dbCommunity.community_values || "",
    size_demographics: dbCommunity.size_demographics || "",
    team_structure: dbCommunity.team_structure || "",
    tech_stack: dbCommunity.tech_stack || "",
    event_formats: dbCommunity.event_formats || "",
    business_model: dbCommunity.business_model || "",
    challenges: dbCommunity.challenges || "",
    special_notes: dbCommunity.special_notes || ""
  };
};

/**
 * Maps a Community from data/types to a Community from models/types
 * This ensures backward compatibility with older code that might use the data/types version
 */
export const mapLegacyCommunity = (community: any): Community => {
  return {
    id: community.id,
    name: community.name,
    description: community.description || "",
    location: community.location || "Remote",
    imageUrl: community.imageUrl,
    memberCount: community.memberCount || 0,
    organizerIds: community.organizerIds || [],
    memberIds: community.memberIds || [],
    tags: community.tags || [],
    isPublic: community.isPublic !== undefined ? community.isPublic : true,
    createdAt: community.createdAt || new Date().toISOString(),
    updatedAt: community.updatedAt || new Date().toISOString(),
    website: community.website || ""
  };
};

/**
 * Exports for use in repositories
 */
export { supabase, mockCommunities };
