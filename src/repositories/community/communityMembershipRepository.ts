import { supabase } from "@/integrations/supabase/client";

/**
 * Makes a user own a community (replaces join community functionality)
 */
export const joinCommunity = async (userId: string, communityId: string, role: string = 'admin'): Promise<void> => {
  console.log(`Repository: Setting user ${userId} as owner of community ${communityId}`);
  
  try {
    // Check if the user is already the owner of this community
    const { data: existingOwnership, error: checkError } = await supabase.rpc('is_community_owner', {
      user_id: userId,
      community_id: communityId
    });
    
    if (checkError) {
      console.error('Error checking existing ownership:', checkError);
      throw checkError;
    }
    
    // If user is already the owner, no need to do anything
    if (existingOwnership) {
      console.log(`Repository: User ${userId} is already the owner of community ${communityId}`);
      return;
    }
    
    // Otherwise update the community's owner_id
    const { error: updateError } = await supabase
      .from('communities')
      .update({ owner_id: userId })
      .eq('id', communityId);
    
    if (updateError) {
      console.error('Error updating community ownership:', updateError);
      throw updateError;
    }
    
    console.log(`Repository: Updated ownership of community ${communityId} to user ${userId}`);
    
    // Call the edge function to increment the member count if needed
    try {
      const { data: incrementResponse, error: incrementError } = await supabase.functions.invoke('increment-community-count', {
        body: { communityId }
      });
      
      if (incrementError) {
        console.warn('Error incrementing community member count:', incrementError);
      } else {
        console.log('Member count updated:', incrementResponse);
      }
    } catch (edgeFuncError) {
      console.warn('Failed to call increment-community-count function:', edgeFuncError);
    }
  } catch (error) {
    console.error(`Error in joinCommunity for userId ${userId}, communityId ${communityId}:`, error);
    throw error;
  }
};

/**
 * Makes a user leave a community (now removes ownership)
 */
export const leaveCommunity = async (userId: string, communityId: string): Promise<void> => {
  try {
    // Check if user is the owner of this community
    const { data: isOwner, error: checkError } = await supabase.rpc('is_community_owner', {
      user_id: userId,
      community_id: communityId
    });
    
    if (checkError) {
      console.error('Error checking ownership:', checkError);
      throw checkError;
    }
    
    // If user is the owner, set the owner_id to null
    if (isOwner) {
      const { error: updateError } = await supabase
        .from('communities')
        .update({ owner_id: null })
        .eq('id', communityId);
      
      if (updateError) {
        console.error('Error removing community ownership:', updateError);
        throw updateError;
      }
      
      console.log(`Repository: Removed ownership of community ${communityId} from user ${userId}`);
    } else {
      console.log(`Repository: User ${userId} is not the owner of community ${communityId}, nothing to do`);
    }
    
    // Call the edge function to decrement the member count if needed
    try {
      const { data: decrementResponse, error: decrementError } = await supabase.functions.invoke('decrement-community-count', {
        body: { communityId }
      });
      
      if (decrementError) {
        console.warn('Error decrementing community member count:', decrementError);
      } else {
        console.log('Member count updated:', decrementResponse);
      }
    } catch (edgeFuncError) {
      console.warn('Failed to call decrement-community-count function:', edgeFuncError);
    }
  } catch (error) {
    console.error(`Error in leaveCommunity for userId ${userId}, communityId ${communityId}:`, error);
    throw error;
  }
};

/**
 * Makes a user an admin of a community (now transfers ownership)
 */
export const makeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  try {
    // In our new model, "admin" means "owner", so transfer ownership
    const { error: updateError } = await supabase
      .from('communities')
      .update({ owner_id: userId })
      .eq('id', communityId);
    
    if (updateError) {
      console.error('Error transferring community ownership:', updateError);
      throw updateError;
    }
    
    console.log(`Repository: Transferred ownership of community ${communityId} from user ${adminId} to user ${userId}`);
  } catch (error) {
    console.error(`Error in makeAdmin:`, error);
    throw error;
  }
};

/**
 * No-op function as we don't have multiple admin roles any more
 * Kept for API compatibility
 */
export const removeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  console.log("This operation is no longer supported in the new ownership model.");
  // No-op function since we only support a single owner now
};
