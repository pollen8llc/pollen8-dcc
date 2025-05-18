
import { supabase } from "@/integrations/supabase/client";
import { CommunityFormData } from "@/schemas/communitySchema";

// Error types
export class CommunityError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "CommunityError";
  }
}

export class PermissionError extends CommunityError {
  constructor(message = "You don't have permission to perform this action") {
    super(message, "permission_denied");
    this.name = "PermissionError";
  }
}

// Get all communities (with optional filters)
export const getAllCommunities = async (options: { 
  page?: number; 
  limit?: number;
  isPublic?: boolean; 
}) => {
  try {
    const { page = 1, limit = 10, isPublic } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('communities')
      .select('*')
      .range(from, to);

    if (isPublic !== undefined) {
      query = query.eq('is_public', isPublic);
    }

    const { data, error, count } = await query.order('created_at', { ascending: false });

    if (error) throw new CommunityError(error.message, error.code);
    return { data, count };

  } catch (error) {
    console.error("Error in getAllCommunities:", error);
    throw error instanceof CommunityError 
      ? error 
      : new CommunityError("Failed to fetch communities");
  }
};

// Get community by ID
export const getCommunityById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new CommunityError(error.message, error.code);
    if (!data) throw new CommunityError("Community not found", "not_found");
    return data;

  } catch (error) {
    console.error("Error in getCommunityById:", error);
    throw error instanceof CommunityError 
      ? error 
      : new CommunityError("Failed to fetch community");
  }
};

// Create community
export const createCommunity = async (communityData: CommunityFormData) => {
  try {
    console.log("Creating community with data:", communityData);

    // Prepare social media data
    const socialMedia = communityData.social_media || {};

    // Prepare target audience array
    const targetAudience = communityData.target_audience || [];

    // Insert directly into communities table
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: communityData.name,
        description: communityData.description,
        type: communityData.type,
        format: communityData.format,
        location: communityData.location || "Remote",
        target_audience: targetAudience,
        website: communityData.website || null,
        social_media: socialMedia,
        is_public: communityData.is_public !== undefined ? communityData.is_public : true,
        newsletter_url: communityData.newsletter_url || null,
        founder_name: communityData.founder_name || null,
        role_title: communityData.role_title || null,
        vision: communityData.vision || null,
        community_values: communityData.community_values || null,
        community_structure: communityData.community_structure || null,
        member_count: communityData.community_size || "1"
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating community:", error);
      
      if (error.code === '42501' || error.message.includes('permission')) {
        throw new PermissionError("You don't have permission to create communities. Please ensure you have the ORGANIZER role.");
      }
      
      throw new CommunityError(error.message, error.code);
    }

    console.log("Community created successfully:", data);
    return data;

  } catch (error) {
    console.error("Error in createCommunity:", error);
    throw error instanceof CommunityError 
      ? error 
      : new CommunityError("Failed to create community");
  }
};

// Update community
export const updateCommunity = async (id: string, communityData: Partial<CommunityFormData>) => {
  try {
    // Check permissions first
    const { data: community, error: fetchError } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) throw new CommunityError(fetchError.message, fetchError.code);
    if (!community) throw new CommunityError("Community not found", "not_found");

    // Proceed with update
    const { data, error } = await supabase
      .from('communities')
      .update({
        name: communityData.name,
        description: communityData.description,
        type: communityData.type,
        format: communityData.format,
        location: communityData.location,
        target_audience: communityData.target_audience,
        website: communityData.website,
        social_media: communityData.social_media,
        is_public: communityData.is_public,
        newsletter_url: communityData.newsletter_url,
        founder_name: communityData.founder_name,
        role_title: communityData.role_title,
        vision: communityData.vision,
        community_values: communityData.community_values,
        community_structure: communityData.community_structure,
        member_count: communityData.community_size
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating community:", error);
      
      if (error.code === '42501' || error.message.includes('permission')) {
        throw new PermissionError("You don't have permission to update this community.");
      }
      
      throw new CommunityError(error.message, error.code);
    }

    return data;

  } catch (error) {
    console.error("Error in updateCommunity:", error);
    throw error instanceof CommunityError 
      ? error 
      : new CommunityError("Failed to update community");
  }
};

// Delete community
export const deleteCommunity = async (id: string) => {
  try {
    // Use the safe_delete_community function to ensure proper access control
    const { data, error } = await supabase.rpc('safe_delete_community', {
      community_id: id,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });

    if (error) {
      console.error("Error deleting community:", error);
      
      if (error.code === '42501' || error.message.includes('permission')) {
        throw new PermissionError("You don't have permission to delete this community.");
      }
      
      throw new CommunityError(error.message, error.code);
    }

    if (!data) {
      throw new PermissionError("Failed to delete community - you may not be the owner");
    }

    return { success: true };

  } catch (error) {
    console.error("Error in deleteCommunity:", error);
    throw error instanceof CommunityError 
      ? error 
      : new CommunityError("Failed to delete community");
  }
};

// Get communities managed by user
export const getManagedCommunities = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new CommunityError(error.message, error.code);
    return data || [];

  } catch (error) {
    console.error("Error in getManagedCommunities:", error);
    throw error instanceof CommunityError 
      ? error 
      : new CommunityError("Failed to fetch managed communities");
  }
};

// Search for communities
export const searchCommunities = async (query: string, options: { page?: number; limit?: number } = {}) => {
  try {
    const { page = 1, limit = 10 } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    // Search in name, description, and tags
    const { data, error, count } = await supabase
      .from('communities')
      .select('*', { count: 'exact' })
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw new CommunityError(error.message, error.code);
    return { data: data || [], count };

  } catch (error) {
    console.error("Error in searchCommunities:", error);
    throw error instanceof CommunityError 
      ? error 
      : new CommunityError("Failed to search communities");
  }
};
