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

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Get user's Luma integration
    const { data: integration, error: integrationError } = await supabase
      .from('luma_integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      return new Response(JSON.stringify({ 
        error: 'No active Luma integration found. Please connect your Luma account first.' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if token needs refresh
    let accessToken = integration.access_token;
    if (integration.token_expires_at && new Date(integration.token_expires_at) <= new Date()) {
      // Token expired, refresh it
      if (!integration.refresh_token) {
        throw new Error('Token expired and no refresh token available');
      }

      const refreshResponse = await fetch('https://api.lu.ma/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: Deno.env.get('LUMA_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('LUMA_CLIENT_SECRET') ?? '',
          refresh_token: integration.refresh_token,
        }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token');
      }

      const refreshData = await refreshResponse.json();
      accessToken = refreshData.access_token;

      // Update stored token
      await supabase
        .from('luma_integrations')
        .update({
          access_token: accessToken,
          refresh_token: refreshData.refresh_token || integration.refresh_token,
          token_expires_at: new Date(Date.now() + (refreshData.expires_in * 1000)).toISOString(),
        })
        .eq('id', integration.id);
    }

    // Fetch user's events from Luma
    const eventsResponse = await fetch('https://api.lu.ma/v1/user/events', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!eventsResponse.ok) {
      const errorText = await eventsResponse.text();
      console.error('Luma API error:', errorText);
      throw new Error('Failed to fetch events from Luma');
    }

    const eventsData = await eventsResponse.json();

    // Transform events data for frontend
    const events = eventsData.events?.map((event: any) => ({
      id: event.id,
      title: event.name,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      location: event.location?.address || event.location?.name || 'Virtual',
      attendee_count: event.guest_count || 0,
      rsvp_count: event.rsvp_count || 0,
      status: event.status,
      cover_url: event.cover_url,
      url: event.url,
    })) || [];

    return new Response(JSON.stringify({ 
      events,
      total: events.length,
      integration_status: 'connected',
      luma_username: integration.luma_username,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in luma-get-events:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});