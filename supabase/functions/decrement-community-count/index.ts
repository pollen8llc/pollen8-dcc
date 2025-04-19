
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.3'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://oltcuwvgdzszxshpfnre.supabase.co'
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

serve(async (req) => {
  try {
    const { communityId } = await req.json()
    
    if (!communityId) {
      return new Response(
        JSON.stringify({ error: 'Community ID is required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get current count
    const { data, error: getError } = await supabase
      .from('communities')
      .select('member_count')
      .eq('id', communityId)
      .single()
    
    if (getError) {
      console.error('Error getting community:', getError)
      return new Response(
        JSON.stringify({ error: getError.message }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Decrement count, ensure it doesn't go below 0
    const currentCount = data.member_count || 0
    const newCount = Math.max(0, currentCount - 1)
    
    const { error: updateError } = await supabase
      .from('communities')
      .update({ member_count: newCount })
      .eq('id', communityId)
    
    if (updateError) {
      console.error('Error updating community:', updateError)
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    return new Response(
      JSON.stringify({ success: true, member_count: newCount }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
