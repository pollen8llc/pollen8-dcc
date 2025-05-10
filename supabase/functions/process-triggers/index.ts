
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders } }
      )
    }

    // Find triggers that need to be processed
    const now = new Date()
    
    // Get all triggers where:
    // 1. The trigger is active
    // 2. There's a corresponding notification that's pending
    // 3. The notification is scheduled for now or earlier
    const { data: triggersDue, error: triggersError } = await supabase
      .from('rms_triggers')
      .select(`
        id, 
        name, 
        description, 
        action,
        rms_email_notifications!inner(
          id,
          recipient_email,
          recipient_name,
          subject,
          body,
          scheduled_for
        )
      `)
      .eq('is_active', true)
      .eq('rms_email_notifications.status', 'pending')
      .lte('rms_email_notifications.scheduled_for', now.toISOString())

    if (triggersError) {
      throw triggersError
    }

    console.log(`Found ${triggersDue?.length || 0} triggers due for processing`)

    // Track which emails were processed
    const processed = []

    // Process each trigger and send emails
    if (triggersDue && triggersDue.length > 0) {
      for (const trigger of triggersDue) {
        // In a real implementation, you would send the emails here
        // For example:
        // await sendEmail(trigger.rms_email_notifications[0])
        
        console.log(`Processing trigger: ${trigger.name}`)
        console.log(`Email to: ${trigger.rms_email_notifications[0].recipient_email}`)
        
        // Sample email handling logic (just logging for this example)
        const emailContent = {
          to: trigger.rms_email_notifications[0].recipient_email,
          subject: trigger.rms_email_notifications[0].subject,
          body: trigger.rms_email_notifications[0].body,
        }
        
        console.log('Would send email with content:', emailContent)
        
        // Update the email notification status to sent
        const { error: updateError } = await supabase
          .from('rms_email_notifications')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString() 
          })
          .eq('id', trigger.rms_email_notifications[0].id)
        
        if (updateError) {
          console.error(`Error updating email status: ${updateError.message}`)
          continue
        }
        
        // Add to processed list
        processed.push({
          trigger_id: trigger.id,
          email_id: trigger.rms_email_notifications[0].id,
          recipient: trigger.rms_email_notifications[0].recipient_email,
        })
      }
    }

    return new Response(
      JSON.stringify({
        message: `Successfully processed ${processed.length} triggers`,
        processed,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error processing triggers:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
