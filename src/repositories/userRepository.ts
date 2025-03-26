
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/models/types";
import { users as mockUsers } from "@/data/users";

/**
 * Retrieves a user by their ID from the data source.
 */
export const getUserById = async (id: string): Promise<User | null> => {
  // When database is ready, use this:
  // const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  // if (error) return null;
  // return data as User;
  
  const user = mockUsers.find(user => user.id === id);
  return user || null;
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
  // return data as User[];
  
  const community = mockCommunities.find(c => c.id === communityId);
  if (!community) return [];
  
  return mockUsers.filter(user => community.organizerIds.includes(user.id));
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
  // return data as User[];
  
  const community = mockCommunities.find(c => c.id === communityId);
  if (!community) return [];
  
  return mockUsers.filter(user => community.memberIds.includes(user.id));
};

import { communities as mockCommunities } from "@/data/communities";
