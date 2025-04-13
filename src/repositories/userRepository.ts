
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";

/**
 * Converts a database user to models/types User format
 */
const mapDbUser = async (profile: any): Promise<User> => {
  // Get user's community memberships
  const { data: memberData, error: memberError } = await supabase
    .from('community_members')
    .select('community_id, role')
    .eq('user_id', profile.id);
  
  if (memberError) {
    console.error("Error fetching community memberships:", memberError);
    return mapUserWithoutMemberships(profile);
  }
  
  // Get admin role if exists
  const { data: adminRole, error: adminError } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('user_id', profile.id)
    .maybeSingle();
  
  if (adminError) {
    console.error("Error fetching admin role:", adminError);
    return mapUserWithoutAdminRole(profile, memberData || []);
  }
  
  const communities = memberData?.map(m => m.community_id) || [];
  const managedCommunities = memberData
    ?.filter(m => m.role === 'admin')
    .map(m => m.community_id) || [];
  
  // Determine user role
  let role = UserRole.MEMBER;
  
  if (adminRole?.role === "ADMIN") {
    role = UserRole.ADMIN;
  } else if (managedCommunities.length > 0) {
    role = UserRole.ORGANIZER;
  } else if (communities.length > 0) {
    role = UserRole.MEMBER;
  }
  
  return {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
    role: role,
    imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    email: profile.email || "",
    bio: "", // Bio is not in the profiles table
    communities,
    managedCommunities,
    createdAt: profile.created_at
  };
};

/**
 * Helper function to map user without memberships
 */
const mapUserWithoutMemberships = (profile: any): User => {
  return {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
    role: UserRole.MEMBER,
    imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    email: profile.email || "",
    bio: "",
    communities: [],
    managedCommunities: [],
    createdAt: profile.created_at
  };
};

/**
 * Helper function to map user without admin role
 */
const mapUserWithoutAdminRole = (profile: any, memberData: any[]): User => {
  const communities = memberData?.map(m => m.community_id) || [];
  const managedCommunities = memberData
    ?.filter(m => m.role === 'admin')
    .map(m => m.community_id) || [];
  
  // Determine user role based on memberships
  let role = UserRole.MEMBER;
  
  if (managedCommunities.length > 0) {
    role = UserRole.ORGANIZER;
  }
  
  return {
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
    role: role,
    imageUrl: profile.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
    email: profile.email || "",
    bio: "",
    communities,
    managedCommunities,
    createdAt: profile.created_at
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
      return null;
    }
    
    return await mapDbUser(profile);
  } catch (err) {
    console.error("Error in getUserById:", err);
    return null;
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
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return await Promise.all(data.map(item => mapDbUser(item.profiles)));
  } catch (err) {
    console.error("Error in getCommunityOrganizers:", err);
    return [];
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
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return await Promise.all(data.map(item => mapDbUser(item.profiles)));
  } catch (err) {
    console.error("Error in getCommunityMembers:", err);
    return [];
  }
};

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

/**
 * Creates a new admin user
 */
export const createAdminUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_roles')
      .insert({
        user_id: userId,
        role: 'ADMIN'
      });
    
    if (error) {
      console.error("Error creating admin user:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in createAdminUser:", err);
    return false;
  }
};

/**
 * Removes admin role from a user
 */
export const removeAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_roles')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error("Error removing admin role:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in removeAdminRole:", err);
    return false;
  }
};
