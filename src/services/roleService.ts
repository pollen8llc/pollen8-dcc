
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
