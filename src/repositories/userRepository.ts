
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { users as mockUsers } from "@/data/users";

/**
 * Converts a database user to models/types User format
 */
const mapDbUser = async (profile: any): Promise<User> => {
  // Get user's community memberships
  const { data: memberData } = await supabase
    .from('community_members')
    .select('community_id, role')
    .eq('user_id', profile.id);
  
  const communities = memberData?.map(m => m.community_id) || [];
  const managedCommunities = memberData
    ?.filter(m => m.role === 'admin')
    .map(m => m.community_id) || [];
  
  return {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
    role: managedCommunities.length > 0 ? UserRole.ORGANIZER : UserRole.MEMBER,
    imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    email: profile.email,
    bio: "",
    communities,
    managedCommunities
  };
};

/**
 * Retrieves a user by their ID from the data source.
 */
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching user:", error);
      const user = mockUsers.find(user => user.id === id);
      return user ? {
        ...user,
        role: user.role === "ORGANIZER" ? UserRole.ORGANIZER : UserRole.MEMBER
      } : null;
    }
    
    return await mapDbUser(profile);
  } catch (err) {
    console.error("Error in getUserById:", err);
    const user = mockUsers.find(user => user.id === id);
    return user ? {
      ...user,
      role: user.role === "ORGANIZER" ? UserRole.ORGANIZER : UserRole.MEMBER
    } : null;
  }
};

/**
 * Retrieves all users who are organizers of a specific community.
 */
export const getCommunityOrganizers = async (communityId: string): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        user_id,
        profiles:user_id(*)
      `)
      .eq('community_id', communityId)
      .eq('role', 'admin');
    
    if (error) {
      console.error("Error fetching community organizers:", error);
      const community = mockCommunities.find(c => c.id === communityId);
      if (!community) return [];
      
      return mockUsers
        .filter(user => community.organizerIds.includes(user.id))
        .map(user => ({
          ...user,
          role: UserRole.ORGANIZER
        }));
    }
    
    return await Promise.all(data.map(item => mapDbUser(item.profiles)));
  } catch (err) {
    console.error("Error in getCommunityOrganizers:", err);
    const community = mockCommunities.find(c => c.id === communityId);
    if (!community) return [];
    
    return mockUsers
      .filter(user => community.organizerIds.includes(user.id))
      .map(user => ({
        ...user,
        role: UserRole.ORGANIZER
      }));
  }
};

/**
 * Retrieves all users who are regular members (not organizers) of a specific community.
 */
export const getCommunityMembers = async (communityId: string): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        user_id,
        profiles:user_id(*)
      `)
      .eq('community_id', communityId)
      .eq('role', 'member');
    
    if (error) {
      console.error("Error fetching community members:", error);
      const community = mockCommunities.find(c => c.id === communityId);
      if (!community) return [];
      
      return mockUsers
        .filter(user => community.memberIds.includes(user.id))
        .map(user => ({
          ...user,
          role: UserRole.MEMBER
        }));
    }
    
    return await Promise.all(data.map(item => mapDbUser(item.profiles)));
  } catch (err) {
    console.error("Error in getCommunityMembers:", err);
    const community = mockCommunities.find(c => c.id === communityId);
    if (!community) return [];
    
    return mockUsers
      .filter(user => community.memberIds.includes(user.id))
      .map(user => ({
        ...user,
        role: UserRole.MEMBER
      }));
  }
};

// Import at the top of the file
import { communities as mockCommunities } from "@/data/communities";

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, data: {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}): Promise<User | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating user profile:", error);
      return null;
    }
    
    return await mapDbUser(profile);
  } catch (err) {
    console.error("Error in updateUserProfile:", err);
    return null;
  }
};
