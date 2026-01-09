import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Link invited-by function called');

    // Initialize Supabase client with service role key
    const supabaseServiceRole = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const { contactId, organizerId } = await req.json();
    console.log('Request data:', { contactId, organizerId });

    if (!contactId || !organizerId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing contactId or organizerId' 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get contact details
    const { data: contact, error: contactError } = await supabaseServiceRole
      .from('rms_contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (contactError || !contact) {
      console.error('Contact fetch error:', contactError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Contact not found' 
        }), 
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user already exists in auth.users by email
    const { data: existingUser, error: userError } = await supabaseServiceRole.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to check existing users' 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const existingAuthUser = existingUser.users.find(user => user.email === contact.email);

    if (existingAuthUser) {
      // Update existing profile with invited_by
      const { error: profileUpdateError } = await supabaseServiceRole
        .from('profiles')
        .update({ 
          invited_by: organizerId 
        })
        .eq('user_id', existingAuthUser.id);

      if (profileUpdateError) {
        console.error('Profile update error:', profileUpdateError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to update profile' 
          }), 
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Successfully linked existing user to organizer');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Successfully linked existing user',
          userId: existingAuthUser.id
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If no existing user, just log that no action was needed
    console.log('No existing user found for contact, no action needed');
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'No existing user to link'
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});