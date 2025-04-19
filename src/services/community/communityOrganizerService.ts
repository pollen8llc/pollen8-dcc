
import { CommunityOrganizerProfile } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a new organizer profile
 */
export const createOrganizerProfile = async (profile: Omit<CommunityOrganizerProfile, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log("Service: Creating organizer profile with data:", profile);
    
    if (!profile.community_id) {
      throw new Error("Community ID is required for organizer profile");
    }
    
    const { data: existingProfile, error: checkError } = await supabase
      .from('community_organizer_profiles')
      .select('id')
      .eq('community_id', profile.community_id)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing profile:', checkError);
    }
    
    if (existingProfile?.id) {
      console.log('Organizer profile already exists, updating it:', existingProfile.id);
      const { data: updatedProfile, error: updateError } = await supabase
        .from('community_organizer_profiles')
        .update({
          founder_name: profile.founder_name,
          role_title: profile.role_title,
          personal_background: profile.personal_background,
          size_demographics: profile.size_demographics,
          community_structure: profile.community_structure,
          team_structure: profile.team_structure,
          tech_stack: profile.tech_stack,
          event_formats: profile.event_formats,
          business_model: profile.business_model,
          community_values: profile.community_values,
          challenges: profile.challenges,
          vision: profile.vision,
          special_notes: profile.special_notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating organizer profile:', updateError);
        throw updateError;
      }
      
      return updatedProfile;
    }
    
    const { data, error } = await supabase
      .from('community_organizer_profiles')
      .insert({
        community_id: profile.community_id,
        founder_name: profile.founder_name,
        role_title: profile.role_title,
        personal_background: profile.personal_background,
        size_demographics: profile.size_demographics,
        community_structure: profile.community_structure,
        team_structure: profile.team_structure,
        tech_stack: profile.tech_stack,
        event_formats: profile.event_formats,
        business_model: profile.business_model,
        community_values: profile.community_values,
        challenges: profile.challenges,
        vision: profile.vision,
        special_notes: profile.special_notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating organizer profile:', error);
      throw error;
    }

    console.log('Created new organizer profile:', data);
    return data;
  } catch (error) {
    console.error('Error in createOrganizerProfile service:', error);
    throw error;
  }
};

/**
 * Gets the organizer profile for a community
 */
export const getOrganizerProfile = async (communityId: string): Promise<CommunityOrganizerProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('community_organizer_profiles')
      .select('*')
      .eq('community_id', communityId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching organizer profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getOrganizerProfile service for communityId ${communityId}:`, error);
    return null;
  }
};
