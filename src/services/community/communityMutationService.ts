
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
    
    // Get the current user ID
    const userId = sessionData.session.user.id;
    
    // Check if user can manage this community using our DB function
    const { data: canManage, error: permissionError } = await supabase.rpc(
      'can_manage_community', 
      { 
        user_id: userId,
        community_id: community.id
      }
    );
    
    if (permissionError) {
      console.error("Permission check error:", permissionError);
      throw new Error(`Permission check failed: ${permissionError.message}`);
    }
    
    if (!canManage) {
      throw new Error('Permission denied: You do not have permission to update this community');
    }
    
    // Log the update attempt for debugging
    console.log("Updating community with data:", JSON.stringify({
      id: community.id,
      name: community.name,
      fields: Object.keys(community)
    }));
    
    // Attempt to update the community
    const updatedCommunity = await communityRepository.updateCommunity(community);
    
    // Log audit action for successful update
    await auditService.logAuditAction({
      action: 'community_updated',
      details: {
        community_id: updatedCommunity.id,
        community_name: updatedCommunity.name,
        timestamp: new Date().toISOString()
      }
    });
    
    return updatedCommunity;
  } catch (error: any) {
    // Detailed error logging for debugging
    console.error("Error in updateCommunity service:", error);
    
    // Format error message for better user experience
    let errorMessage = error?.message || "Unknown error occurred";
    
    if (errorMessage.includes("permission denied") || errorMessage.includes("Permission denied")) {
      errorMessage = "Permission denied: You don't have permission to update this community.";
    } else if (errorMessage.includes("not found")) {
      errorMessage = "Community not found or has been deleted.";
    }
    
    throw new Error(`Failed to update community: ${errorMessage}`);
  }
};

export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    console.log("Creating community in service with data:", JSON.stringify(community, null, 2));
    
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user?.id) {
      console.error("Authentication error:", sessionError);
      throw new Error('Authentication required to create a community');
    }
    
    // Create a new community with the current user as the first organizer
    const communityWithOrganizer: Partial<Community> = {
      ...community,
      organizerIds: [sessionData.session.user.id]
    };
    
    console.log("Submitting to repository with data:", JSON.stringify(communityWithOrganizer, null, 2));

    // Create the community in the database
    const createdCommunity = await communityRepository.createCommunity(communityWithOrganizer);
    
    console.log("Community created in database:", createdCommunity);
    
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
