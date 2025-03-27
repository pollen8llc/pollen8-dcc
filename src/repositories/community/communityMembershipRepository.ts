
import { supabase } from "../base/baseRepository";

/**
 * Joins a community
 */
export const joinCommunity = async (userId: string, communityId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: userId,
        role: 'member'
      });
    
    if (error) {
      console.error("Error joining community:", error);
    }
  } catch (err) {
    console.error("Error in joinCommunity:", err);
  }
};

/**
 * Leaves a community
 */
export const leaveCommunity = async (userId: string, communityId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error leaving community:", error);
    }
  } catch (err) {
    console.error("Error in leaveCommunity:", err);
  }
};

/**
 * Makes a user an admin of a community
 */
export const makeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  try {
    // Check if the requester is an admin
    const { data: adminCheck } = await supabase
      .from('community_members')
      .select('role')
      .eq('community_id', communityId)
      .eq('user_id', adminId)
      .eq('role', 'admin')
      .single();
    
    if (!adminCheck) {
      throw new Error("Only admins can assign admin roles");
    }

    const { error } = await supabase
      .from('community_members')
      .update({ role: 'admin' })
      .eq('community_id', communityId)
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error making admin:", error);
    }
  } catch (err) {
    console.error("Error in makeAdmin:", err);
  }
};

/**
 * Removes admin role from a user
 */
export const removeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  try {
    // Check if the requester is an admin
    const { data: adminCheck } = await supabase
      .from('community_members')
      .select('role')
      .eq('community_id', communityId)
      .eq('user_id', adminId)
      .eq('role', 'admin')
      .single();
    
    if (!adminCheck) {
      throw new Error("Only admins can remove admin roles");
    }

    const { error } = await supabase
      .from('community_members')
      .update({ role: 'member' })
      .eq('community_id', communityId)
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error removing admin:", error);
    }
  } catch (err) {
    console.error("Error in removeAdmin:", err);
  }
};
