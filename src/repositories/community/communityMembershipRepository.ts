import { supabase } from "@/integrations/supabase/client";

/**
 * Makes a user join a community
 */
export const joinCommunity = async (userId: string, communityId: string, role: string = 'member'): Promise<void> => {
  console.log(`Repository: User ${userId} joining community ${communityId} with role ${role}`);
  
  try {
    // Check if the membership already exists
    const { data: existingMembership, error: checkError } = await supabase
      .from('community_members')
      .select('id, role')
      .eq('user_id', userId)
      .eq('community_id', communityId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing membership:', checkError);
      throw checkError;
    }
    
    // If membership exists, update the role if needed
    if (existingMembership) {
      console.log(`Repository: Membership already exists with role ${existingMembership.role}`);
      
      // If existing role isn't admin but requested role is admin, upgrade to admin
      if (existingMembership.role !== 'admin' && role === 'admin') {
        const { error: updateError } = await supabase
          .from('community_members')
          .update({ role: 'admin' })
          .eq('id', existingMembership.id);
        
        if (updateError) {
          console.error('Error updating membership role:', updateError);
          throw updateError;
        }
        
        console.log(`Repository: Updated membership role to admin`);
      }
      
      return;
    }
    
    // Otherwise create new membership
    const { error: insertError } = await supabase
      .from('community_members')
      .insert({
        user_id: userId,
        community_id: communityId,
        role: role
      });
    
    if (insertError) {
      console.error('Error creating community membership:', insertError);
      throw insertError;
    }
    
    console.log(`Repository: Created new membership with role ${role}`);
    
    // Get the current member count first
    const { data: communityData, error: getError } = await supabase
      .from('communities')
      .select('member_count')
      .eq('id', communityId)
      .single();
    
    if (getError) {
      console.warn('Error getting community member count:', getError);
    } else {
      // Update the community's member count and timestamp
      const currentCount = communityData.member_count || 0;
      const { error: updateError } = await supabase
        .from('communities')
        .update({ 
          updated_at: new Date().toISOString(),
          member_count: currentCount + 1
        })
        .eq('id', communityId);
      
      if (updateError) {
        console.warn('Error updating community member count:', updateError);
      }
    }
  } catch (error) {
    console.error(`Error in joinCommunity for userId ${userId}, communityId ${communityId}:`, error);
    throw error;
  }
};

/**
 * Makes a user leave a community
 */
export const leaveCommunity = async (userId: string, communityId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('user_id', userId)
      .eq('community_id', communityId);
    
    if (error) {
      console.error('Error removing community membership:', error);
      throw error;
    }
    
    // Get the current member count first
    const { data: communityData, error: getError } = await supabase
      .from('communities')
      .select('member_count')
      .eq('id', communityId)
      .single();
    
    if (getError) {
      console.warn('Error getting community member count:', getError);
    } else {
      // Update the community's member count and timestamp, ensuring it never goes below 0
      const currentCount = communityData.member_count || 0;
      const newCount = Math.max(currentCount - 1, 0);
      
      const { error: updateError } = await supabase
        .from('communities')
        .update({ 
          updated_at: new Date().toISOString(),
          member_count: newCount
        })
        .eq('id', communityId);
      
      if (updateError) {
        console.warn('Error updating community member count:', updateError);
      }
    }
  } catch (error) {
    console.error(`Error in leaveCommunity for userId ${userId}, communityId ${communityId}:`, error);
    throw error;
  }
};

/**
 * Makes a user an admin of a community
 */
export const makeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  try {
    // Check if the user is already a member of the community
    const { data: existingMembership, error: checkError } = await supabase
      .from('community_members')
      .select('id')
      .eq('user_id', userId)
      .eq('community_id', communityId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing membership:', checkError);
      throw checkError;
    }
    
    if (existingMembership) {
      // Update the role to admin
      const { error: updateError } = await supabase
        .from('community_members')
        .update({ role: 'admin' })
        .eq('id', existingMembership.id);
      
      if (updateError) {
        console.error('Error updating to admin role:', updateError);
        throw updateError;
      }
    } else {
      // Create a new membership with admin role
      const { error: insertError } = await supabase
        .from('community_members')
        .insert({
          user_id: userId,
          community_id: communityId,
          role: 'admin'
        });
      
      if (insertError) {
        console.error('Error creating admin membership:', insertError);
        throw insertError;
      }
      
      // Get the current member count first
      const { data: communityData, error: getError } = await supabase
        .from('communities')
        .select('member_count')
        .eq('id', communityId)
        .single();
      
      if (getError) {
        console.warn('Error getting community member count:', getError);
      } else {
        // Update the community's member count and timestamp
        const currentCount = communityData.member_count || 0;
        const { error: updateError } = await supabase
          .from('communities')
          .update({ 
            updated_at: new Date().toISOString(),
            member_count: currentCount + 1
          })
          .eq('id', communityId);
        
        if (updateError) {
          console.warn('Error updating community member count:', updateError);
        }
      }
    }
  } catch (error) {
    console.error(`Error in makeAdmin:`, error);
    throw error;
  }
};

/**
 * Removes admin role from a user
 */
export const removeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('community_members')
      .update({ role: 'member' })
      .eq('user_id', userId)
      .eq('community_id', communityId)
      .eq('role', 'admin');
    
    if (error) {
      console.error('Error removing admin role:', error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in removeAdmin:`, error);
    throw error;
  }
};
