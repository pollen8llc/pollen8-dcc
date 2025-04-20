
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";

export const getCommunityOrganizerProfile = async (communityId: string) => {
  try {
    const { data: community, error } = await supabase
      .from('communities')
      .select(`
        id,
        name,
        founder_name,
        role_title,
        personal_background,
        community_structure,
        vision,
        community_values
      `)
      .eq('id', communityId)
      .single();

    if (error) throw error;
    return community;
  } catch (error) {
    console.error("Error fetching community organizer profile:", error);
    throw error;
  }
};

export const updateCommunityOrganizerProfile = async (communityId: string, profileData: Partial<Community>) => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .update({
        founder_name: profileData.founder_name,
        role_title: profileData.role_title,
        personal_background: profileData.personal_background,
        community_structure: profileData.community_structure,
        vision: profileData.vision,
        community_values: profileData.community_values
      })
      .eq('id', communityId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating community organizer profile:", error);
    throw error;
  }
};
