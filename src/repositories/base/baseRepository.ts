import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";
import { communities as mockCommunities } from "@/data/communities";

/**
 * Maps a database community record to a Community model
 */
export const mapDbCommunity = (dbCommunity: any): Community => {
  // Map the database record to our Community model
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
    website: dbCommunity.website || ""
  };
};

/**
 * Exports for use in repositories
 */
export { supabase, mockCommunities };
