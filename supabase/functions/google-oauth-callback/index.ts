import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    console.error('Google OAuth credentials not configured');
    return new Response('Google OAuth credentials not configured', { status: 500 });
  }

  try {
    // Handle GET request (browser redirect from Google OAuth)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      // Handle OAuth errors
      if (error) {
        console.error('OAuth error:', error);
        const errorUrl = state ? JSON.parse(atob(state)).returnUrl : 'https://preview--pollen8-dcc.lovable.app/rel8/connect/import';
        const errorHtml = `
          <!DOCTYPE html>
          <html>
          <head><title>Connection Failed</title></head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'google_oauth_error', error: '${error}' }, '*');
                setTimeout(() => window.close(), 500);
              } else {
                window.location.href = '${errorUrl}?google_error=${encodeURIComponent(error)}';
              }
            </script>
          </body>
          </html>
        `;
        return new Response(errorHtml, { headers: { 'Content-Type': 'text/html' } });
      }

      if (!code || !state) {
        console.error('Missing code or state');
        return new Response('Missing authorization code or state', { status: 400 });
      }

      // Decode state to get userId and returnUrl
      let stateData;
      try {
        stateData = JSON.parse(atob(state));
      } catch (e) {
        console.error('Invalid state parameter:', e);
        return new Response('Invalid state parameter', { status: 400 });
      }

      const { userId, returnUrl } = stateData;
      const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-oauth-callback`;

      console.log('Processing OAuth callback for user:', userId);

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
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', errorText);
        const errorHtml = `
          <!DOCTYPE html>
          <html>
          <head><title>Connection Failed</title></head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'google_oauth_error', error: 'token_exchange_failed' }, '*');
                setTimeout(() => window.close(), 500);
              } else {
                window.location.href = '${returnUrl}?google_error=token_exchange_failed';
              }
            </script>
          </body>
          </html>
        `;
        return new Response(errorHtml, { headers: { 'Content-Type': 'text/html' } });
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
        console.error('Failed to fetch Google user info');
        const errorHtml = `
          <!DOCTYPE html>
          <html>
          <head><title>Connection Failed</title></head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'google_oauth_error', error: 'user_info_failed' }, '*');
                setTimeout(() => window.close(), 500);
              } else {
                window.location.href = '${returnUrl}?google_error=user_info_failed';
              }
            </script>
          </body>
          </html>
        `;
        return new Response(errorHtml, { headers: { 'Content-Type': 'text/html' } });
      }

      const userData = await userResponse.json();
      console.log('Google user info fetched:', userData.email);

      // Calculate token expiration
      const expiresAt = new Date(Date.now() + (expires_in * 1000));

      // Store or update integration
      const { data, error: dbError } = await supabase
        .from('google_integrations')
        .upsert({
          user_id: userId,
          access_token: access_token,
          refresh_token: refresh_token,
          token_expires_at: expiresAt.toISOString(),
          google_user_id: userData.id,
          google_email: userData.email,
          connected_at: new Date().toISOString(),
          is_active: true,
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        const errorHtml = `
          <!DOCTYPE html>
          <html>
          <head><title>Connection Failed</title></head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'google_oauth_error', error: 'database_error' }, '*');
                setTimeout(() => window.close(), 500);
              } else {
                window.location.href = '${returnUrl}?google_error=database_error';
              }
            </script>
          </body>
          </html>
        `;
        return new Response(errorHtml, { headers: { 'Content-Type': 'text/html' } });
      }

      console.log('Google integration successful for user:', userId);

      // Return HTML that communicates with opener and closes popup
      const successHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Google Connected</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0a0a0a; color: #fff; }
            .container { text-align: center; }
            .spinner { width: 40px; height: 40px; border: 3px solid #333; border-top-color: #10b981; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
            @keyframes spin { to { transform: rotate(360deg); } }
            p { color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <p>Connecting to Google...</p>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'google_oauth_success', email: '${userData.email}' }, '*');
              setTimeout(() => window.close(), 500);
            } else {
              window.location.href = '${returnUrl}?google_connected=true';
            }
          </script>
        </body>
        </html>
      `;
      return new Response(successHtml, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Handle POST request (legacy API call method)
    if (req.method === 'POST') {
      const { code, redirectUri } = await req.json();

      if (!code) {
        throw new Error('Authorization code is required');
      }

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
        }, { onConflict: 'user_id' })
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
    }

    return new Response('Method not allowed', { status: 405 });

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
