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

    const { action, postData, postId, reactionType, communityId } = await req.json()

    switch (action) {
      case 'create_post':
        const { data: newPost, error: createError } = await supabaseClient
          .from('eco8_community_posts')
          .insert(postData)
          .select()
          .single()

        if (createError) throw createError
        return new Response(JSON.stringify({ post: newPost }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'add_reaction':
        const { data: reaction, error: reactionError } = await supabaseClient
          .from('eco8_post_reactions')
          .insert({
            post_id: postId,
            reaction_type: reactionType,
            user_id: (await supabaseClient.auth.getUser()).data.user?.id
          })
          .select()
          .single()

        if (reactionError) throw reactionError
        return new Response(JSON.stringify({ reaction }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_posts':
        const { data: posts, error: postsError } = await supabaseClient
          .from('eco8_community_posts')
          .select(`
            *,
            reactions:eco8_post_reactions(reaction_type, user_id)
          `)
          .eq('community_id', communityId)
          .order('created_at', { ascending: false })

        if (postsError) throw postsError
        return new Response(JSON.stringify({ posts }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})