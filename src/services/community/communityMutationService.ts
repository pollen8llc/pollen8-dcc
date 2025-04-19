
import { supabase } from "@/integrations/supabase/client";
import * as communityRepository from "@/repositories/community";
import * as auditService from "@/services/auditService";
import { Community } from "@/models/types";

export const updateCommunity = async (community: Community): Promise<Community> => {
  try {
    return await communityRepository.updateCommunity(community);
  } catch (error) {
    console.error("Error in updateCommunity service:", error);
    throw error;
  }
};

export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user?.id) {
      throw new Error('Authentication required to create a community');
    }
    
    return await communityRepository.createCommunity({
      ...community,
      owner_id: sessionData.session.user.id
    });
  } catch (error) {
    console.error("Error in createCommunity service:", error);
    throw error;
  }
};

export const deleteCommunity = async (communityId: string): Promise<void> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    
    if (!userId) {
      throw new Error('Authentication required to delete a community');
    }
    
    const { data, error } = await supabase.rpc('safe_delete_community', {
      community_id: communityId,
      user_id: userId
    });
    
    if (error) {
      console.error('Error deleting community:', error);
      throw new Error(error.message || 'Failed to delete community');
    }
    
    // Log audit action for successful deletion
    await auditService.logAuditAction({
      action: 'community_deleted',
      details: {
        community_id: communityId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error(`Error in deleteCommunity service for communityId ${communityId}:`, error);
    throw error;
  }
};
