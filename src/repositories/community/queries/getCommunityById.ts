
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";
import { mockCommunities } from "./getAllCommunities";
import { mapLegacyCommunity, mapDbCommunity } from "./getAllCommunities";

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

    // Use the standard mapping function that handles both database and backward compatibility fields
    return mapDbCommunity(data);
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
