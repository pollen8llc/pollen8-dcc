import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LumaAttendee {
  id: string;
  name: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  linkedin_url?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  website_url?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { eventIds } = await req.json();

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      throw new Error('Event IDs are required');
    }

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
      throw new Error('No active Luma integration found');
    }

    let totalImported = 0;
    let totalDuplicates = 0;
    let totalErrors = 0;
    const importResults = [];

    // Process each event
    for (const eventId of eventIds) {
      try {
        // Get event details
        const eventResponse = await fetch(`https://api.lu.ma/v1/event/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${integration.access_token}`,
          },
        });

        if (!eventResponse.ok) {
          console.error(`Failed to fetch event ${eventId}`);
          totalErrors++;
          continue;
        }

        const eventData = await eventResponse.json();
        const eventName = eventData.name || `Event ${eventId}`;

        // Get attendees for this event
        const attendeesResponse = await fetch(`https://api.lu.ma/v1/event/${eventId}/guests`, {
          headers: {
            'Authorization': `Bearer ${integration.access_token}`,
          },
        });

        if (!attendeesResponse.ok) {
          console.error(`Failed to fetch attendees for event ${eventId}`);
          totalErrors++;
          continue;
        }

        const attendeesData = await attendeesResponse.json();
        const attendees: LumaAttendee[] = attendeesData.guests || [];

        let eventImported = 0;
        let eventDuplicates = 0;
        let eventErrors = 0;

        // Process each attendee
        for (const attendee of attendees) {
          try {
            if (!attendee.email) {
              // Skip attendees without email
              continue;
            }

            // Check for existing contact by email
            const { data: existingContact } = await supabase
              .from('rms_contacts')
              .select('id, email')
              .eq('user_id', user.id)
              .eq('email', attendee.email)
              .single();

            if (existingContact) {
              // Update existing contact with Luma data if not already from this event
               const { error: updateError } = await supabase
                .from('rms_contacts')
                .update({
                  notes: existingContact.notes || `Luma Event: ${eventName}`,
                  source: existingContact.source || `Luma Event: ${eventName}`,
                  last_contact_date: new Date().toISOString(),
                })
                .eq('id', existingContact.id);

              if (updateError) {
                console.error('Error updating contact:', updateError);
                eventErrors++;
              } else {
                eventDuplicates++;
              }
            } else {
              // Create new contact
               const { error: insertError } = await supabase
                .from('rms_contacts')
                .insert({
                  user_id: user.id,
                  name: attendee.name || 'Unknown',
                  email: attendee.email,
                  notes: attendee.bio || '',
                  source: `Luma Event: ${eventName}`,
                  last_contact_date: new Date().toISOString(),
                });

              if (insertError) {
                console.error('Error inserting contact:', insertError);
                eventErrors++;
              } else {
                eventImported++;
              }
            }
          } catch (contactError) {
            console.error('Error processing attendee:', contactError);
            eventErrors++;
          }
        }

        // Record import history
        await supabase
          .from('luma_import_history')
          .insert({
            user_id: user.id,
            integration_id: integration.id,
            event_id: eventId,
            event_name: eventName,
            contacts_imported: eventImported,
            duplicates_found: eventDuplicates,
            errors_count: eventErrors,
            import_status: 'completed',
            import_data: {
              total_attendees: attendees.length,
              processed_attendees: eventImported + eventDuplicates + eventErrors,
            },
          });

        totalImported += eventImported;
        totalDuplicates += eventDuplicates;
        totalErrors += eventErrors;

        importResults.push({
          eventId,
          eventName,
          imported: eventImported,
          duplicates: eventDuplicates,
          errors: eventErrors,
          totalAttendees: attendees.length,
        });

      } catch (eventError) {
        console.error(`Error processing event ${eventId}:`, eventError);
        totalErrors++;
      }
    }

    // Update last sync time
    await supabase
      .from('luma_integrations')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', integration.id);

    return new Response(JSON.stringify({
      success: true,
      summary: {
        totalImported,
        totalDuplicates,
        totalErrors,
        eventsProcessed: importResults.length,
      },
      results: importResults,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in luma-import-contacts:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});