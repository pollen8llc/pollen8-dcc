
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/models/types";
import { users as mockUsers } from "@/data/users";
import { communities as mockCommunities } from "@/data/communities";

/**
 * Converts a user from data/types format to models/types format
 */
const convertUserType = (dataUser: any): User => {
  return {
    ...dataUser,
    role: dataUser.role === "ORGANIZER" ? UserRole.ORGANIZER : UserRole.MEMBER
  };
};

/**
 * Retrieves a user by their ID from the data source.
 */
export const getUserById = async (id: string): Promise<User | null> => {
  // When database is ready, use this:
  // const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  // if (error) return null;
  // return convertUserType(data);
  
  const user = mockUsers.find(user => user.id === id);
  return user ? convertUserType(user) : null;
};

/**
 * Retrieves all users who are organizers of a specific community.
 */
export const getCommunityOrganizers = async (communityId: string): Promise<User[]> => {
  // When database is ready, use this:
  // const { data: community, error } = await supabase.from('communities').select('organizerIds').eq('id', communityId).single();
  // if (error) return [];
  // const { data, error: usersError } = await supabase.from('users').select('*').in('id', community.organizerIds);
  // if (usersError) return [];
  // return data.map(convertUserType);
  
  const community = mockCommunities.find(c => c.id === communityId);
  if (!community) return [];
  
  return mockUsers
    .filter(user => community.organizerIds.includes(user.id))
    .map(convertUserType);
};

/**
 * Retrieves all users who are regular members (not organizers) of a specific community.
 */
export const getCommunityMembers = async (communityId: string): Promise<User[]> => {
  // When database is ready, use this:
  // const { data: community, error } = await supabase.from('communities').select('memberIds').eq('id', communityId).single();
  // if (error) return [];
  // const { data, error: usersError } = await supabase.from('users').select('*').in('id', community.memberIds);
  // if (usersError) return [];
  // return data.map(convertUserType);
  
  const community = mockCommunities.find(c => c.id === communityId);
  if (!community) return [];
  
  return mockUsers
    .filter(user => community.memberIds.includes(user.id))
    .map(convertUserType);
};
