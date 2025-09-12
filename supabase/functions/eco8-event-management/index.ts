import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { action, eventData, eventId, userId } = await req.json()

    switch (action) {
      case 'create_event':
        const { data: newEvent, error: createError } = await supabaseClient
          .from('eco8_events')
          .insert({
            ...eventData,
            created_by: userId
          })
          .select()
          .single()

        if (createError) throw createError
        return new Response(JSON.stringify({ event: newEvent }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'register_user':
        const { data: registration, error: regError } = await supabaseClient
          .rpc('register_for_event', { event_id: eventId })

        if (regError) throw regError
        return new Response(JSON.stringify({ success: registration }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_events':
        const { data: events, error: eventsError } = await supabaseClient
          .rpc('get_community_events', { community_id: eventData.community_id })

        if (eventsError) throw eventsError
        return new Response(JSON.stringify({ events }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})