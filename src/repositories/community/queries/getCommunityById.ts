
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";
import { mockCommunities } from "./getAllCommunities";
import { mapLegacyCommunity } from "./getAllCommunities";

export const getCommunityById = async (id: string): Promise<Community | null> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select(`
        id,
        name,
        description,
        location,
        logo_url,
        website,
        communication_platforms,
        community_structure,
        community_type,
        community_values,
        created_at,
        event_frequency,
        format,
        founder_name,
        id,
        is_public,
        location,
        member_count,
        newsletter_url,
        owner_id,
        personal_background,
        role_title,
        social_media,
        target_audience,
        type,
        updated_at,
        vision,
        tags
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found in database, try mock data
        const mockCommunity = mockCommunities.find(c => c.id === id);
        if (mockCommunity) {
          return mapLegacyCommunity(mockCommunity);
        }
        return null;
      }
      throw error;
    }

    if (!data) {
      // Try mock data if no data from database
      const mockCommunity = mockCommunities.find(c => c.id === id);
      if (mockCommunity) {
        return mapLegacyCommunity(mockCommunity);
      }
      return null;
    }

    // Create safe defaults for JSON fields
    const communicationPlatforms = 
      typeof data.communication_platforms === 'object' && data.communication_platforms !== null
        ? data.communication_platforms
        : {};
        
    const socialMedia = 
      typeof data.social_media === 'object' && data.social_media !== null
        ? data.social_media
        : {};

    // Convert any social media values that are numbers to strings
    const typeSafeSocialMedia: Record<string, string | { url?: string }> = {};
    
    if (typeof socialMedia === 'object' && socialMedia !== null) {
      Object.keys(socialMedia).forEach(key => {
        const value = socialMedia[key];
        if (typeof value === 'number') {
          typeSafeSocialMedia[key] = value.toString();
        } else if (typeof value === 'object' && value !== null) {
          typeSafeSocialMedia[key] = value;
        } else if (typeof value === 'string') {
          typeSafeSocialMedia[key] = value;
        } else {
          typeSafeSocialMedia[key] = '';
        }
      });
    }

    // Extract platform keys safely
    const platformKeys = 
      typeof communicationPlatforms === 'object' && communicationPlatforms !== null
        ? Object.keys(communicationPlatforms)
        : [];

    // Transform the data to match our Community model
    const community: Community = {
      id: data.id,
      name: data.name,
      description: data.description,
      location: data.location || 'Remote',
      imageUrl: data.logo_url || '',
      communitySize: (data.member_count?.toString() || "0"),
      organizerIds: [data.owner_id],
      memberIds: [],
      tags: data.tags || [],
      isPublic: data.is_public,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      website: data.website,
      communityType: data.type || data.community_type,
      format: data.format,
      targetAudience: data.target_audience || [],
      tone: '',
      newsletterUrl: data.newsletter_url,
      socialMedia: typeSafeSocialMedia,
      primaryPlatforms: platformKeys,
      communication_platforms: communicationPlatforms as Record<string, string | { url?: string; details?: string }>,
      founder_name: data.founder_name,
      role_title: data.role_title,
      personal_background: data.personal_background,
      community_structure: data.community_structure,
      vision: data.vision,
      community_values: data.community_values,
      eventFrequency: data.event_frequency,
    };

    return community;
  } catch (error) {
    console.error(`Error in getCommunityById(${id}):`, error);
    
    // Fallback to mock data in case of any error
    const mockCommunity = mockCommunities.find(c => c.id === id);
    if (mockCommunity) {
      return mapLegacyCommunity(mockCommunity);
    }
    
    throw error;
  }
};
