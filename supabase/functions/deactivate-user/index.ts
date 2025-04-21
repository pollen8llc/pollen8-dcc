
// Follow Deno conventions for imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Deno.serve handler
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create authenticated client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get user from auth token
    const {
      data: { user: caller },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !caller) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization token' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if caller is admin using a database function
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
      user_id: caller.id,
    });

    if (adminCheckError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Only admins can deactivate users.' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: userId' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create admin client with service role key
    const adminAuthClient = createClient(
      supabaseUrl,
      supabaseServiceKey
    ).auth;

    // Deactivate the user (this is a soft deactivation that disables login)
    const { error: updateError } = await adminAuthClient.admin.updateUserById(
      userId,
      { user_metadata: { status: 'deactivated' }, app_metadata: { deactivated: true } }
    );

    if (updateError) {
      console.error('Error updating user:', updateError);
      return new Response(
        JSON.stringify({ error: `Error deactivating user: ${updateError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Log the deactivation in audit logs
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    await adminClient.rpc('log_audit_action', {
      action_name: 'user_deactivated',
      performer_id: caller.id,
      target_id: userId,
      action_details: {
        timestamp: new Date().toISOString(),
      },
    });

    return new Response(
      JSON.stringify({ success: true, message: 'User deactivated successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in deactivate-user function:', error);
    
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
