
import { supabase } from '@/integrations/supabase/client';
import { Community } from '@/models/types';
import { processTargetAudience } from '@/utils/communityUtils';

/**
 * Create a new community in the database
 */
export const createCommunity = async (communityData: Partial<Community>): Promise<Community> => {
  console.log('Creating community:', communityData);
  
  // Process target audience using the utility function
  const processedTargetAudience = processTargetAudience(communityData.target_audience);
  
  // Get current timestamp
  const now = new Date().toISOString();
  
  // Prepare data with required fields
  const insertData = {
    name: communityData.name || "New Community", // Ensure name is provided (required field)
    description: communityData.description || "",
    logo_url: communityData.logo_url || communityData.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
    website: communityData.website || "",
    is_public: communityData.is_public !== undefined ? communityData.is_public : true,
    location: communityData.location || "Remote",
    member_count: communityData.member_count || communityData.communitySize || "0",
    target_audience: processedTargetAudience,
    community_type: communityData.type || null,
    format: communityData.format || null,
    social_media: communityData.social_media || {},
    communication_platforms: communityData.communication_platforms || {},
    newsletter_url: communityData.newsletter_url || communityData.newsletterUrl || null,
    role_title: communityData.role_title || null,
    community_structure: communityData.community_structure || null,
    vision: communityData.vision || null,
    created_at: now,
    updated_at: now
  };
  
  // Create the community with processed data
  const { data, error } = await supabase
    .from('communities')
    .insert(insertData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating community:', error);
    throw new Error(`Failed to create community: ${error.message}`);
  }
  
  // Transform the database response to match our Community type
  // Ensure proper type handling for social_media
  const socialMediaData = typeof data.social_media === 'object' ? 
    data.social_media as Record<string, string | { url?: string }> : 
    {};
  
  const community: Community = {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    imageUrl: data.logo_url,
    communitySize: data.member_count || "0",
    organizerIds: data.owner_id ? [data.owner_id] : [],
    memberIds: [],
    tags: data.target_audience || [],
    isPublic: data.is_public,
    type: data.community_type,
    format: data.format,
    social_media: socialMediaData,
    website: data.website,
    target_audience: data.target_audience,
    created_at: data.created_at,
    updated_at: data.updated_at,
    is_public: data.is_public
  };
  
  return community;
};

/**
 * Update an existing community in the database
 */
export const updateCommunity = async (communityId: string, communityData: Partial<Community>): Promise<Community> => {
  console.log('Updating community:', communityId, communityData);
  
  // Process target audience using the utility function
  const processedTargetAudience = processTargetAudience(communityData.target_audience);
  
  // Prepare update data with current timestamp
  const updateData = {
    ...communityData,
    target_audience: processedTargetAudience,
    updated_at: new Date().toISOString()
  };
  
  // Remove undefined values to avoid type errors
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });
  
  // Update the community with processed data
  const { data, error } = await supabase
    .from('communities')
    .update(updateData)
    .eq('id', communityId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating community:', error);
    throw new Error(`Failed to update community: ${error.message}`);
  }
  
  // Transform the database response to match our Community type
  // Ensure proper type handling for social_media
  const socialMediaData = typeof data.social_media === 'object' ? 
    data.social_media as Record<string, string | { url?: string }> : 
    {};
    
  const community: Community = {
    id: data.id,
    name: data.name,
    description: data.description,
    location: data.location,
    imageUrl: data.logo_url,
    communitySize: data.member_count || "0",
    organizerIds: data.owner_id ? [data.owner_id] : [],
    memberIds: [],
    tags: data.target_audience || [],
    isPublic: data.is_public,
    type: data.community_type,
    format: data.format,
    social_media: socialMediaData,
    website: data.website,
    target_audience: data.target_audience,
    created_at: data.created_at,
    updated_at: data.updated_at,
    is_public: data.is_public
  };
  
  return community;
};

/**
 * Deletes a community
 * @param communityId The community ID to delete
 * @returns A promise that resolves when the community is deleted
 */
export async function deleteCommunity(communityId: string) {
  try {
    if (!communityId) {
      throw new Error("Community ID is required to delete.");
    }

    // Use the safe_delete_community function instead of direct delete
    // This ensures proper ownership validation and auditing
    const { data, error } = await supabase.rpc('safe_delete_community', {
      community_id: communityId,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });
    
    if (error) {
      console.error("Error deleting community:", error);
      throw new Error(`Failed to delete community: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Failed to delete community - you may not be the owner");
    }
    
    console.log("Community deleted successfully:", communityId);
    return true;
  } catch (error: any) {
    console.error("Error in deleteCommunity:", error);
    throw error;
  }
}
