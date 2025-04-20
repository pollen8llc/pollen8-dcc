
import { supabase } from "@/integrations/supabase/client";
import * as communityRepository from "@/repositories/community";
import * as auditService from "@/services/auditService";
import { Community } from "@/models/types";

export const updateCommunity = async (community: Community): Promise<Community> => {
  try {
    // Verify authentication before updating
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user?.id) {
      throw new Error('Authentication required to update a community');
    }
    
    return await communityRepository.updateCommunity(community);
  } catch (error) {
    console.error("Error in updateCommunity service:", error);
    throw error;
  }
};

export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    console.log("Creating community in service:", community);
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user?.id) {
      throw new Error('Authentication required to create a community');
    }
    
    // Create a new community with the current user as the first organizer
    const communityWithOrganizer: Partial<Community> = {
      ...community,
      organizerIds: [sessionData.session.user.id]
    };
    
    // Log for debugging
    console.log("Creating community with data:", communityWithOrganizer);

    // Create the community in the database
    const createdCommunity = await communityRepository.createCommunity(communityWithOrganizer);
    
    // Log audit action for successful creation
    await auditService.logAuditAction({
      action: 'community_created',
      details: {
        community_id: createdCommunity.id,
        community_name: createdCommunity.name,
        timestamp: new Date().toISOString()
      }
    });

    return createdCommunity;
  } catch (error) {
    console.error("Error in createCommunity service:", error);
    throw error;
  }
};

export const deleteCommunity = async (communityId: string): Promise<void> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user?.id) {
      throw new Error('Authentication required to delete a community');
    }
    
    await communityRepository.deleteCommunity(communityId);
    
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
