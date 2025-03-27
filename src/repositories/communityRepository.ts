
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";
import { communities as mockCommunities } from "@/data/communities";

/**
 * Gets all communities
 */
export const getAllCommunities = async (): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*');
    
    if (error) {
      console.error("Error fetching communities:", error);
      return mockCommunities as unknown as Community[];
    }
    
    return data.map(mapDbCommunity) as Community[];
  } catch (err) {
    console.error("Error in getAllCommunities:", err);
    return mockCommunities as unknown as Community[];
  }
};

/**
 * Gets a community by its ID
 */
export const getCommunityById = async (id: string): Promise<Community | null> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select(`
        *,
        community_members!inner(user_id)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching community:", error);
      const community = mockCommunities.find(community => community.id === id);
      return community ? (community as unknown as Community) : null;
    }
    
    return mapDbCommunity(data) as Community;
  } catch (err) {
    console.error("Error in getCommunityById:", err);
    const community = mockCommunities.find(community => community.id === id);
    return community ? (community as unknown as Community) : null;
  }
};

/**
 * Searches communities by a query string
 */
export const searchCommunities = async (query: string): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name');
    
    if (error) {
      console.error("Error searching communities:", error);
      const lowercaseQuery = query.toLowerCase();
      return mockCommunities.filter(community => 
        community.name.toLowerCase().includes(lowercaseQuery) ||
        community.description.toLowerCase().includes(lowercaseQuery) ||
        community.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      ) as unknown as Community[];
    }
    
    return data.map(mapDbCommunity) as Community[];
  } catch (err) {
    console.error("Error in searchCommunities:", err);
    const lowercaseQuery = query.toLowerCase();
    return mockCommunities.filter(community => 
      community.name.toLowerCase().includes(lowercaseQuery) ||
      community.description.toLowerCase().includes(lowercaseQuery) ||
      community.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    ) as unknown as Community[];
  }
};

/**
 * Gets communities managed by a specific user
 */
export const getManagedCommunities = async (userId: string): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        community_id,
        communities:community_id(*)
      `)
      .eq('user_id', userId)
      .eq('role', 'admin');
    
    if (error) {
      console.error("Error fetching managed communities:", error);
      return mockCommunities.filter(community => 
        community.organizerIds.includes(userId)
      ) as unknown as Community[];
    }
    
    return data.map(item => mapDbCommunity(item.communities)) as Community[];
  } catch (err) {
    console.error("Error in getManagedCommunities:", err);
    return mockCommunities.filter(community => 
      community.organizerIds.includes(userId)
    ) as unknown as Community[];
  }
};

/**
 * Updates a community
 */
export const updateCommunity = async (community: Community): Promise<Community> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .update({
        name: community.name,
        description: community.description,
        logo_url: community.imageUrl,
        website: community.website
      })
      .eq('id', community.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating community:", error);
      return community;
    }
    
    return mapDbCommunity(data) as Community;
  } catch (err) {
    console.error("Error in updateCommunity:", err);
    return community;
  }
};

/**
 * Creates a new community
 */
export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: community.name || "New Community",
        description: community.description || "",
        logo_url: community.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        website: community.website || ""
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating community:", error);
      return {
        id: String(Date.now()),
        name: community.name || "New Community",
        description: community.description || "",
        location: community.location || "Remote",
        imageUrl: community.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        memberCount: 1,
        organizerIds: community.organizerIds || ["25"],
        memberIds: community.memberIds || [],
        tags: community.tags || [],
        isPublic: community.isPublic !== undefined ? community.isPublic : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        website: community.website || ""
      };
    }
    
    // Add current user as admin
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (userId) {
      await supabase
        .from('community_members')
        .insert({
          community_id: data.id,
          user_id: userId,
          role: 'admin'
        });
    }
    
    return mapDbCommunity(data) as Community;
  } catch (err) {
    console.error("Error in createCommunity:", err);
    return {
      id: String(Date.now()),
      name: community.name || "New Community",
      description: community.description || "",
      location: community.location || "Remote",
      imageUrl: community.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
      memberCount: 1,
      organizerIds: community.organizerIds || ["25"],
      memberIds: community.memberIds || [],
      tags: community.tags || [],
      isPublic: community.isPublic !== undefined ? community.isPublic : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      website: community.website || ""
    };
  }
};

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

/**
 * Maps database community object to model Community type
 */
const mapDbCommunity = (dbCommunity: any): Community => {
  return {
    id: dbCommunity.id,
    name: dbCommunity.name,
    description: dbCommunity.description || "",
    location: dbCommunity.location || "Remote",
    imageUrl: dbCommunity.logo_url,
    memberCount: dbCommunity.member_count || 0,
    organizerIds: [], // Will be populated by community_members queries
    memberIds: [], // Will be populated by community_members queries
    tags: [], // Will be populated later
    isPublic: true,
    createdAt: dbCommunity.created_at,
    updatedAt: dbCommunity.updated_at,
    website: dbCommunity.website
  };
};
