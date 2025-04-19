import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";

/**
 * Converts a database user to models/types User format
 */
const mapDbUser = async (profile: any): Promise<User> => {
  // Get communities where user is the owner (new structure)
  const { data: ownedCommunities, error: ownedError } = await supabase
    .from('communities')
    .select('id')
    .eq('owner_id', profile.id);
  
  if (ownedError) {
    console.error("Error fetching owned communities:", ownedError);
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
    return mapUserWithoutAdminRole(profile, ownedCommunities || []);
  }
  
  const managedCommunities = ownedCommunities?.map(c => c.id) || [];
  // In our new model, a user is only a member of communities they own
  const communities = managedCommunities;
  
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
const mapUserWithoutAdminRole = (profile: any, ownedCommunities: any[]): User => {
  const managedCommunities = ownedCommunities?.map(c => c.id) || [];
  // In our new model, a user is only a member of communities they own
  const communities = managedCommunities;
  
  // Determine user role based on ownerships
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
 * Retrieves a user by their ID
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
 * Retrieves all community organizers
 */
export const getCommunityOrganizers = async (communityId: string): Promise<User[]> => {
  try {
    // In the new model, there's only one owner per community
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('owner_id')
      .eq('id', communityId)
      .single();
    
    if (communityError || !community || !community.owner_id) {
      console.error("Error fetching community owner:", communityError);
      return [];
    }
    
    // Get the owner's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', community.owner_id)
      .single();
      
    if (profileError || !profile) {
      console.error("Error fetching owner profile:", profileError);
      return [];
    }
    
    // Map and return the owner as the only organizer
    const organizer = await mapDbUser(profile);
    return [organizer];
  } catch (err) {
    console.error("Error in getCommunityOrganizers:", err);
    return [];
  }
};

/**
 * Retrieves all community members (excluding organizers)
 * In the new model, we don't have regular members, only owners
 * This is a placeholder that returns an empty array
 */
export const getCommunityMembers = async (communityId: string): Promise<User[]> => {
  return [];
};

/**
 * Retrieves all users in the system
 * This now works with our fixed RLS policies
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');
      
    if (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
    
    // Transform each profile into a User model
    const users: Promise<User>[] = profiles.map(profile => mapDbUser(profile));
    return await Promise.all(users);
  } catch (error: any) {
    console.error("Error in getAllUsers repository function:", error);
    throw error;
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
