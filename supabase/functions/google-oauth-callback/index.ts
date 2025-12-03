import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { code, redirectUri } = await req.json();

    if (!code) {
      throw new Error('Authorization code is required');
    }

    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured');
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri || `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-oauth-callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Token exchange failed:', error);
      throw new Error('Failed to exchange authorization code for token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    console.log('Token exchange successful, fetching user info...');

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch Google user information');
    }

    const userData = await userResponse.json();
    console.log('Google user info fetched:', userData.email);

    // Get authenticated user from JWT
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + (expires_in * 1000));

    // Store or update integration
    const { data, error } = await supabase
      .from('google_integrations')
      .upsert({
        user_id: user.id,
        access_token: access_token,
        refresh_token: refresh_token,
        token_expires_at: expiresAt.toISOString(),
        google_user_id: userData.id,
        google_email: userData.email,
        connected_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to store integration');
    }

    console.log('Google integration successful for user:', user.id);

    return new Response(JSON.stringify({ 
      success: true, 
      integration: {
        id: data.id,
        google_email: data.google_email,
        connected_at: data.connected_at,
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-oauth-callback:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
