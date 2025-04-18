
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

    // Create the community
    const newCommunity = await communityService.createUserCommunity({
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
    
  } catch (error) {
    console.error('Error in setupCommunity:', error);
  }
};

setupCommunity();
