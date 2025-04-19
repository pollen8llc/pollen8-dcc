
import { Community } from "@/models/types";
import { supabase, mockCommunities, mapLegacyCommunity } from "../../base/baseRepository";

export const getCommunityById = async (id: string): Promise<Community | null> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select(`
        *,
        community_members (
          user_id,
          role
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching community:", error);
      const mockCommunity = mockCommunities.find(community => community.id === id);
      return mockCommunity ? mapLegacyCommunity(mockCommunity) : null;
    }
    
    if (!data) {
      console.log("No community found with id:", id);
      return null;
    }

    const organizers = data.community_members?.filter(member => member.role === 'admin')?.map(member => member.user_id) || [];
    const members = data.community_members?.filter(member => member.role === 'member')?.map(member => member.user_id) || [];

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || 'Remote',
      imageUrl: data.logo_url || '/placeholder.svg',
      memberCount: data.member_count || 0,
      organizerIds: organizers,
      memberIds: members,
      tags: [],
      isPublic: data.is_public,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString()
    };
  } catch (err) {
    console.error("Error in getCommunityById:", err);
    const mockCommunity = mockCommunities.find(community => community.id === id);
    return mockCommunity ? mapLegacyCommunity(mockCommunity) : null;
  }
};
