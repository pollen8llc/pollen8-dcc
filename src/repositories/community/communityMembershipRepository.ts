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
    
    // Update the community's member count using a direct update query
    const { error: updateError } = await supabase
      .from('communities')
      .update({ 
        updated_at: new Date().toISOString() 
      })
      .eq('id', communityId);
    
    if (updateError) {
      console.warn('Error updating community:', updateError);
    }
    
    // Use a separate query with raw SQL to increment the member count
    const { error: incrementError } = await supabase
      .rpc('increment_member_count', {
        p_community_id: communityId
      });
    
    if (incrementError) {
      console.warn('Error incrementing member count:', incrementError);
      // Don't throw here, just log the warning
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
    
    // Update the community's timestamp
    const { error: updateError } = await supabase
      .from('communities')
      .update({ 
        updated_at: new Date().toISOString() 
      })
      .eq('id', communityId);
    
    if (updateError) {
      console.warn('Error updating community:', updateError);
    }
    
    // Use a separate query with raw SQL to decrement the member count
    const { error: decrementError } = await supabase
      .rpc('decrement_member_count', {
        p_community_id: communityId
      });
    
    if (decrementError) {
      console.warn('Error decrementing member count:', decrementError);
      // Don't throw here, just log the warning
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
      
      // Update the community timestamp
      const { error: updateError } = await supabase
        .from('communities')
        .update({ 
          updated_at: new Date().toISOString() 
        })
        .eq('id', communityId);
      
      if (updateError) {
        console.warn('Error updating community:', updateError);
      }
      
      // Use a separate query to increment the member count
      const { error: incrementError } = await supabase
        .rpc('increment_member_count', {
          p_community_id: communityId
        });
      
      if (incrementError) {
        console.warn('Error incrementing member count:', incrementError);
        // Don't throw here, just log the warning
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
