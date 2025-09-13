
import { supabase } from "@/integrations/supabase/client";

export const updateUserRole = async (userId: string, roleName: string) => {
  const { data, error } = await supabase.rpc('update_user_role', {
    p_user_id: userId,
    p_role_name: roleName
    // Remove p_assigner_id - let the RPC use auth.uid() automatically
  });
  
  if (error) throw error;
  return data;
};

export const getUserRole = async (userId: string) => {
  const { data, error } = await supabase.rpc('get_highest_role', {
    user_id: userId
  });
  
  if (error) throw error;
  return data;
};

export const getRoles = async () => {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const upgradeToOrganizer = async (userId: string) => {
  // First check if user is a MEMBER and owns at least one community
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .single();
  
  if (profileError) throw profileError;
  
  if (profile.role !== 'MEMBER') {
    throw new Error('User is not a MEMBER');
  }
  
  // Check if user owns any communities
  const { data: communities, error: communitiesError } = await supabase
    .from('communities')
    .select('id')
    .eq('owner_id', userId)
    .limit(1);
  
  if (communitiesError) throw communitiesError;
  
  if (!communities || communities.length === 0) {
    throw new Error('User does not own any communities');
  }
  
  // Upgrade to ORGANIZER role
  const { data, error } = await supabase.rpc('update_user_role_self', {
    p_role_name: 'ORGANIZER'
  });
  
  if (error) throw error;
  return data;
};
