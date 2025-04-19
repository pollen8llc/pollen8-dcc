
import { supabase } from "@/integrations/supabase/client";
import * as communityService from "@/services/communityService";

const setupCommunity = async () => {
  try {
    // First, get the user ID for the email
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'neechbrands@gmail.com')
      .single();

    if (userError) {
      console.error('Error finding user:', userError);
      return;
    }
    
    console.log('Found user:', user);

    // Create the community
    const newCommunity = await communityService.createCommunity({
      name: "Neech Community",
      description: "A community for Neech members to connect and share ideas",
      imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
      location: "Global",
      isPublic: true,
      memberCount: 1,
      organizerIds: [user.id],
      memberIds: [],
      tags: ["Community", "Connection", "Ideas"],
      website: ""
    });

    console.log('Community created successfully:', newCommunity);

    // Add the user as an admin of the community
    const { error: memberError } = await supabase
      .from('community_members')
      .insert({
        community_id: newCommunity.id,
        user_id: user.id,
        role: 'admin'
      });

    if (memberError) {
      console.error('Error adding user as admin:', memberError);
      return;
    }

    console.log('User added as admin successfully');
    
    // Create an organizer profile for the new community
    try {
      const organizerProfile = {
        community_id: newCommunity.id,
        founder_name: "Neech Organizer",
        role_title: "Founder",
        personal_background: "Background in community building",
        size_demographics: "New growing community",
        community_structure: "Open and collaborative",
        team_structure: "Flat hierarchy",
        tech_stack: "Modern web technologies",
        event_formats: "Virtual and in-person meetups",
        business_model: "Community-driven",
        community_values: "Connection, Collaboration, Growth",
        challenges: "Building engagement",
        vision: "Creating a thriving global community",
        special_notes: ""
      };
      
      await communityService.createOrganizerProfile(organizerProfile);
      console.log('Organizer profile created successfully');
    } catch (profileError) {
      console.error('Error creating organizer profile:', profileError);
    }
    
    // Update the user's roles to ensure they're an organizer if not already
    const { error: roleError } = await supabase
      .rpc('update_user_role', { 
        p_user_id: user.id, 
        p_role_name: 'ORGANIZER',
        p_assigner_id: user.id
      });
      
    if (roleError) {
      console.error('Error updating user role:', roleError);
    } else {
      console.log('User role updated to ORGANIZER successfully');
    }
    
  } catch (error) {
    console.error('Error in setupCommunity:', error);
  }
};

setupCommunity();
