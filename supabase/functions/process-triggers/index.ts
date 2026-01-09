import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

// SMTP configuration
const smtpHost = Deno.env.get('SMTP_HOST') || 'mail.ecosystembuilder.app'
const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587')
const smtpUser = Deno.env.get('SMTP_USER') || 'notifications@ecosystembuilder.app'
const smtpPassword = Deno.env.get('SMTP_PASS') || ''
const smtpFromEmail = Deno.env.get('FROM_EMAIL') || 'notifications@ecosystembuilder.app'
const smtpFromName = Deno.env.get('SMTP_FROM_NAME') || 'Ecosystem Builder Automation'

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper function to send email using our send-email edge function
async function sendEmail(recipient: string, recipientName: string, subject: string, body: string) {
  try {
    // Call our send-email function using Supabase Edge Functions client
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: recipient,
        toName: recipientName, 
        subject: subject,
        html: body
      }
    });

    if (error) {
      console.error("Error calling send-email function:", error);
      return false;
    }

    console.log("Email sent successfully:", data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Helper function to calculate next execution date based on recurrence pattern
function calculateNextExecutionDate(trigger: any): string | null {
  if (!trigger.recurrence_pattern) {
    return null // No recurrence pattern, no next execution
  }
  
  const now = new Date()
  const pattern = trigger.recurrence_pattern
  let nextDate: Date
  
  // Start with current date or last execution date
  const baseDate = trigger.last_executed_at 
    ? new Date(trigger.last_executed_at) 
    : new Date()
  
  switch(pattern.type) {
    case 'hourly':
      nextDate = new Date(baseDate)
      nextDate.setHours(nextDate.getHours() + 1)
      break
    case 'daily':
      nextDate = new Date(baseDate)
      nextDate.setDate(nextDate.getDate() + 1)
      break
    case 'weekly':
      nextDate = new Date(baseDate)
      nextDate.setDate(nextDate.getDate() + 7)
      break
    case 'monthly':
      nextDate = new Date(baseDate)
      nextDate.setMonth(nextDate.getMonth() + 1)
      break
    case 'quarterly':
      nextDate = new Date(baseDate)
      nextDate.setMonth(nextDate.getMonth() + 3)
      break
    case 'yearly':
      nextDate = new Date(baseDate)
      nextDate.setFullYear(nextDate.getFullYear() + 1)
      break
    default:
      return null
  }
  
  return nextDate.toISOString()
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
    
    console.log(`Running trigger processing at ${now.toISOString()}`)
    
    // Get time-based triggers due for execution
    const { data: timedTriggers, error: timedTriggersError } = await supabase
      .from('rms_triggers')
      .select('*')
      .eq('is_active', true)
      .lte('next_execution', now.toISOString())

    if (timedTriggersError) {
      throw timedTriggersError
    }

    console.log(`Found ${timedTriggers?.length || 0} time-based triggers due for execution`)

    // Process time-based triggers
    const processedTimedTriggers = []
    
    if (timedTriggers && timedTriggers.length > 0) {
      for (const trigger of timedTriggers) {
        console.log(`Processing time-based trigger: ${trigger.name} (${trigger.id})`)
        
        // Create an email notification for this trigger
        if (trigger.action === 'send_email') {
          // Here you would fetch the user's info to get recipient email
          const { data: user } = await supabase
            .from('profiles')
            .select('email, first_name, last_name')
            .eq('user_id', trigger.user_id)
            .single()
          
          if (!user) {
            console.error(`Could not find user for trigger ${trigger.id}`)
            continue
          }
          
          const emailSubject = `Automated Reminder: ${trigger.name}`
          const emailBody = `
            <h2>Automated Reminder</h2>
            <p>This is an automated reminder from your Rel8t system.</p>
            <p><strong>Trigger:</strong> ${trigger.name}</p>
            <p><strong>Description:</strong> ${trigger.description || 'No description provided'}</p>
            <p>This message was automatically generated at ${now.toLocaleString()}.</p>
          `
          
          // Create an email notification record
          const { data: notification, error: notificationError } = await supabase
            .from('rms_email_notifications')
            .insert([{
              user_id: trigger.user_id,
              trigger_id: trigger.id,
              recipient_email: user.email,
              recipient_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
              subject: emailSubject,
              body: emailBody,
              status: 'pending',
              scheduled_for: now.toISOString()
            }])
            .select()
            .single()
            
          if (notificationError) {
            console.error(`Error creating email notification for trigger ${trigger.id}:`, notificationError)
            continue
          }
          
          // Try to send the email using our new send-email function
          const emailSent = await sendEmail(
            user.email,
            `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            emailSubject,
            emailBody
          )
          
          // Update the notification status
          await supabase
            .from('rms_email_notifications')
            .update({ 
              status: emailSent ? 'sent' : 'failed', 
              sent_at: emailSent ? now.toISOString() : null 
            })
            .eq('id', notification.id)
          
          // Calculate next execution time for recurring triggers
          const nextExecution = calculateNextExecutionDate(trigger)
          
          // Update the trigger's last execution time and next execution time
          await supabase
            .from('rms_triggers')
            .update({ 
              last_executed_at: now.toISOString(),
              next_execution: nextExecution
            })
            .eq('id', trigger.id)
          
          console.log(`Updated trigger ${trigger.id} with next execution: ${nextExecution}`)
          
          // Find and reschedule linked outreach tasks for recurring triggers
          if (trigger.recurrence_pattern) {
            const { data: linkedOutreach, error: outreachError } = await supabase
              .from('rms_outreach')
              .select('*')
              .eq('trigger_id', trigger.id)
              .eq('status', 'pending')
            
            if (outreachError) {
              console.error('Error fetching linked outreach:', outreachError)
            } else if (linkedOutreach && linkedOutreach.length > 0) {
              console.log(`Found ${linkedOutreach.length} linked outreach tasks for trigger ${trigger.id}`)
              
              for (const outreach of linkedOutreach) {
                if (outreach.calendar_sync_enabled) {
                  // Update the outreach task's due_date to the next execution
                  const { error: updateError } = await supabase
                    .from('rms_outreach')
                    .update({ due_date: nextExecution })
                    .eq('id', outreach.id)
                  
                  if (updateError) {
                    console.error(`Error updating outreach ${outreach.id}:`, updateError)
                  } else {
                    console.log(`Updated outreach ${outreach.id} due_date to ${nextExecution}`)
                    
                    // Get user email for calendar update
                    const { data: profile } = await supabase
                      .from('profiles')
                      .select('email')
                      .eq('user_id', outreach.user_id)
                      .single()
                    
                    if (profile?.email) {
                      // Send ICS reschedule update
                      const { error: calendarError } = await supabase.functions.invoke('send-calendar-update', {
                        body: {
                          outreachId: outreach.id,
                          updateType: 'reschedule',
                          userEmail: profile.email,
                          includeContactsAsAttendees: false
                        }
                      })
                      
                      if (calendarError) {
                        console.error(`Error sending calendar update for outreach ${outreach.id}:`, calendarError)
                      } else {
                        console.log(`Sent calendar reschedule update for outreach ${outreach.id}`)
                      }
                    }
                  }
                }
              }
            }
          }
          
          processedTimedTriggers.push({
            trigger_id: trigger.id,
            email_sent: emailSent,
            next_execution: nextExecution
          })
        }
      }
    }
    
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

    console.log(`Found ${triggersDue?.length || 0} event-based triggers due for processing`)

    // Track which emails were processed
    const processed = []

    // Process each trigger and send emails
    if (triggersDue && triggersDue.length > 0) {
      for (const trigger of triggersDue) {
        // In a real implementation, you would send the emails here
        // For example:
        // await sendEmail(trigger.rms_email_notifications[0])
        
        console.log(`Processing event-based trigger: ${trigger.name}`)
        console.log(`Email to: ${trigger.rms_email_notifications[0].recipient_email}`)
        
        // Send the email using our helper function
        const emailSent = await sendEmail(
          trigger.rms_email_notifications[0].recipient_email,
          trigger.rms_email_notifications[0].recipient_name || '',
          trigger.rms_email_notifications[0].subject,
          trigger.rms_email_notifications[0].body
        )
        
        // Update the email notification status
        const { error: updateError } = await supabase
          .from('rms_email_notifications')
          .update({ 
            status: emailSent ? 'sent' : 'failed',
            sent_at: emailSent ? now.toISOString() : null 
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
          email_sent: emailSent
        })
      }
    }

    return new Response(
      JSON.stringify({
        message: `Successfully processed ${processed.length} event-based triggers and ${processedTimedTriggers.length} time-based triggers`,
        processed,
        processedTimedTriggers
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error processing triggers:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})
