
import { supabase } from "@/integrations/supabase/client";

export async function debugSupabaseAccess() {
  console.log('Starting Supabase access debug...');
  
  try {
    // Test 1: Auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Auth test:', { userId: user?.id, error: authError });

    if (!user) return { auth: false };

    // Test 2: Profile access
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    console.log('Profile table test:', { data: userProfile, error: profileError });

    // Test 3: User roles access
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);
    console.log('User roles test:', { data: roles, error: rolesError });

    // Test 4: RPC function access
    const { data: userRoles, error: rpcError } = await supabase.rpc(
      'get_user_roles',
      { user_id: user.id }
    );
    console.log('RPC test:', { data: userRoles, error: rpcError });
    
    // Test 5: Community creation permission
    const canCreateCommunity = userRoles && 
      Array.isArray(userRoles) && 
      userRoles.some((role: any) => 
        (typeof role === 'string' ? role : role.role_name) === 'ADMIN' || 
        (typeof role === 'string' ? role : role.role_name) === 'ORGANIZER'
      );
      
    console.log('Community creation permission:', canCreateCommunity);

    return {
      auth: !authError,
      profileAccess: !profileError,
      rolesAccess: !rolesError,
      rpcAccess: !rpcError,
      canCreateCommunity
    };
  } catch (error) {
    console.error('Debug failed:', error);
    return null;
  }
}
