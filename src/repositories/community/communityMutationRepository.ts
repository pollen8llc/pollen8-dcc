
import { Community } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbCommunity } from "../base/baseRepository";

export const updateCommunity = async (community: Community): Promise<Community> => {
  try {
    console.log("Updating community:", community.id);
    
    // Prepare social media data to ensure it's in the correct format
    const socialMedia = community.social_media || {};
    
    // Prepare target audience to ensure it's in array format
    let targetAudience: string[] = [];
    if (Array.isArray(community.target_audience)) {
      targetAudience = community.target_audience;
    } else if (typeof community.target_audience === 'string') {
      targetAudience = community.target_audience.split(',').map(tag => tag.trim()).filter(Boolean);
    }
    
    const { data, error } = await supabase
      .from('communities')
      .update({
        name: community.name,
        description: community.description,
        logo_url: community.logo_url || community.imageUrl,
        website: community.website,
        is_public: community.is_public,
        location: community.location,
        member_count: community.communitySize || "0", // Store as string
        target_audience: targetAudience,
        type: community.type,
        format: community.format,
        social_media: socialMedia,
        founder_name: community.founder_name,
        role_title: community.role_title,
        vision: community.vision,
        community_values: community.community_values,
        community_structure: community.community_structure,
        newsletter_url: community.newsletter_url || community.newsletterUrl
      })
      .eq('id', community.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating community:", error);
      throw error;
    }
    
    console.log("Community updated successfully:", data.id);
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in updateCommunity:", err);
    throw err;
  }
};

export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    // Log the community data for debugging
    console.log("Creating community in repository with data:", JSON.stringify(community, null, 2));

    // Make sure we have the auth session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      throw new Error("Authentication required to create a community");
    }

    // Get owner_id from session if not provided
    const owner_id = community.organizerIds?.[0] || sessionData.session.user.id;

    // Process tags/target_audience consistently
    let target_audience: string[] = [];
    
    if (Array.isArray(community.tags)) {
      target_audience = community.tags;
    } else if (Array.isArray(community.target_audience)) {
      target_audience = community.target_audience;
    } else if (typeof community.tags === 'string' && community.tags) {
      // Explicitly cast community.tags as string to ensure TypeScript knows it's a string
      const tagsStr: string = community.tags;
      target_audience = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    } else if (typeof community.target_audience === 'string' && community.target_audience) {
      // Explicitly cast community.target_audience as string to ensure TypeScript knows it's a string
      const audienceStr: string = community.target_audience;
      target_audience = audienceStr.split(',').map(t => t.trim()).filter(Boolean);
    }

    // Extract social media values if they exist
    const socialMedia = community.social_media || community.socialMedia || {};
    
    // Use communitySize as string for database storage
    const memberCount = community.communitySize || "1"; // Default to 1 if not provided
    
    // Ensure format is one of the allowed values
    const format = community.format;
    if (format && !["online", "IRL", "hybrid"].includes(format)) {
      throw new Error(`Invalid format: ${format}. Must be one of: online, IRL, hybrid`);
    }
    
    // Log the final data being sent to the database
    console.log("Inserting into database with data:", {
      name: community.name,
      owner_id,
      target_audience,
      member_count: memberCount,
      format
    });

    // Build the database record with explicit owner_id
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: community.name || "New Community",
        description: community.description || "",
        logo_url: community.logo_url || community.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        website: community.website || "",
        is_public: community.is_public !== undefined ? community.is_public : true,
        location: community.location || "Remote",
        member_count: memberCount,
        owner_id: owner_id,
        target_audience: target_audience,
        community_type: community.type || null,
        format: format || null,
        role_title: community.role_title || null,
        community_structure: community.community_structure || null,
        vision: community.vision || null,
        social_media: socialMedia,
        communication_platforms: community.communication_platforms || {},
        newsletter_url: community.newsletter_url || community.newsletterUrl || null
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating community:", error);
      throw error;
    }
    
    console.log("Community created successfully:", data);
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in createCommunity:", err);
    throw err;
  }
};

export const deleteCommunity = async (communityId: string): Promise<void> => {
  try {
    console.log("Deleting community:", communityId);
    
    // Use the safe_delete_community function instead of direct delete
    // This ensures proper ownership validation and auditing
    const { data, error } = await supabase.rpc('safe_delete_community', {
      community_id: communityId,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });
    
    if (error) {
      console.error("Error deleting community:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("Failed to delete community - you may not be the owner");
    }
    
    console.log("Community deleted successfully:", communityId);
  } catch (err) {
    console.error("Error in deleteCommunity:", err);
    throw err;
  }
};
