
// Since this is a read-only file, I'm assuming we need to create a separate mapping function.
// Let's create a utility function in a new file that we can import where needed:

import { Community } from "@/models/types";

/**
 * Maps a database community record to our application's Community model.
 * This handles the rename from member_count to communitySize.
 */
export const mapCommunityWithSize = (dbCommunity: any): Community => {
  return {
    ...dbCommunity,
    communitySize: dbCommunity.member_count || 0, // Map database field to new property name
    // Make sure other required properties exist
    organizerIds: dbCommunity.organizerIds || [],
    memberIds: dbCommunity.memberIds || [],
    tags: dbCommunity.tags || [],
    createdAt: dbCommunity.created_at || new Date().toISOString(),
    updatedAt: dbCommunity.updated_at || new Date().toISOString(),
  };
};
