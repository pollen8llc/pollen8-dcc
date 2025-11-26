import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CalendarUpdateRequest {
  outreachId: string;
  updateType: 'update' | 'reschedule' | 'cancel';
  userEmail: string;
}

// ICS generation utilities (inline to avoid imports)
const formatICSDate = (date: Date): string => {
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
};

const foldLine = (line: string): string => {
  if (line.length <= 75) return line;
  const result: string[] = [];
  let remaining = line;
  result.push(remaining.substring(0, 75));
  remaining = remaining.substring(75);
  while (remaining.length > 0) {
    result.push(' ' + remaining.substring(0, 74));
    remaining = remaining.substring(74);
  }
  return result.join('\r\n');
};

const escapeICSText = (text: string) => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
};

const getLocationFromChannel = (channel: string | null, details: any): string => {
  if (!channel || !details) return 'REL8 Platform';
  
  switch (channel) {
    case 'text':
    case 'call':
      return details.phone ? `📱 ${details.phone}` : 'Phone';
    case 'email':
      return details.email ? `✉️ ${details.email}` : 'Email';
    case 'dm':
      return details.platform && details.handle 
        ? `💬 ${details.platform}: @${details.handle}` 
        : 'Direct Message';
    case 'meeting':
      return details.link 
        ? `🔗 ${details.link}` 
        : details.meetingPlatform || 'Virtual Meeting';
    case 'irl':
      return details.address ? `📍 ${details.address}` : 'In Person';
    default:
      return 'REL8 Platform';
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { outreachId, updateType, userEmail }: CalendarUpdateRequest = await req.json();

    console.log('Processing calendar update:', { outreachId, updateType, userEmail });

    // Fetch outreach task with contacts
    const { data: outreach, error: fetchError } = await supabase
      .from('rms_outreach')
      .select(`
        *,
        contacts:rms_outreach_contacts(
          contact:rms_contacts(id, name)
        )
      `)
      .eq('id', outreachId)
      .single();

    if (fetchError || !outreach) {
      console.error('Failed to fetch outreach:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Outreach task not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment sequence number
    const newSequence = (outreach.calendar_event_sequence || 0) + 1;
    const shortId = outreachId.slice(0, 8);
    const uid = `outreach-${outreachId}@rel8.app`;

    // Generate ICS update
    const now = new Date();
    const startDate = new Date(outreach.due_date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const contactNames = outreach.contacts?.map((c: any) => c.contact.name).join(', ') || 'contacts';
    const description = outreach.description || `Follow up with ${contactNames}`;
    const location = getLocationFromChannel(outreach.outreach_channel, outreach.channel_details);
    const summaryText = `Reminder set: ${outreach.title} #${shortId}`;
    
    const method = updateType === 'cancel' ? 'CANCEL' : 'REQUEST';
    const status = updateType === 'cancel' ? 'CANCELLED' : 'CONFIRMED';

    const icsLines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//REL8//Outreach Task//EN',
      'CALSCALE:GREGORIAN',
      `METHOD:${method}`,
      'X-WR-CALNAME:REL8 - Outreach Tasks',
      'X-WR-TIMEZONE:UTC',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatICSDate(now)}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      foldLine(`SUMMARY:${escapeICSText(summaryText)}`),
      foldLine(`DESCRIPTION:${escapeICSText(description)}`),
      foldLine(`LOCATION:${escapeICSText(location)}`),
      `STATUS:${status}`,
      `SEQUENCE:${newSequence}`,
      `PRIORITY:${outreach.priority === 'high' ? '1' : outreach.priority === 'medium' ? '5' : '9'}`,
      foldLine(`ORGANIZER;CN=REL8 Notifications:mailto:${outreach.system_email}`),
      foldLine(`ATTENDEE;CN=REL8 Notification System;ROLE=NON-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${outreach.system_email}`),
      foldLine(`ATTENDEE;CN=User;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${userEmail}`)
    ];

    if (updateType !== 'cancel') {
      icsLines.push(
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        foldLine(`DESCRIPTION:Reminder: ${escapeICSText(summaryText)}`),
        'END:VALARM'
      );
    }

    icsLines.push('END:VEVENT', 'END:VCALENDAR');
    const icsContent = icsLines.join('\r\n') + '\r\n';

    // Determine email subject based on update type
    let emailSubject = `Updated: ${summaryText}`;
    if (updateType === 'cancel') {
      emailSubject = `Cancelled: ${summaryText}`;
    } else if (updateType === 'reschedule') {
      emailSubject = `Rescheduled: ${summaryText}`;
    }

    // Send email with ICS attachment
    const emailResponse = await resend.emails.send({
      from: 'REL8 Calendar <notifications@ecosystembuilder.app>',
      to: [userEmail],
      subject: emailSubject,
      html: `
        <h2>Your REL8 outreach task has been ${updateType === 'cancel' ? 'cancelled' : 'updated'}</h2>
        <p><strong>${outreach.title}</strong></p>
        <p>${description}</p>
        ${updateType !== 'cancel' ? `
          <p><strong>When:</strong> ${new Date(outreach.due_date).toLocaleString()}</p>
          <p><strong>Where:</strong> ${location}</p>
          <p><strong>Priority:</strong> ${outreach.priority}</p>
        ` : '<p>This event has been cancelled.</p>'}
        <p>Your calendar will be updated automatically when you accept the attached invitation.</p>
      `,
      attachments: [
        {
          filename: 'outreach-update.ics',
          content: Buffer.from(icsContent).toString('base64'),
        }
      ]
    });

    console.log('Email sent:', emailResponse);

    // Update database with new sequence and raw ICS
    const { error: updateError } = await supabase
      .from('rms_outreach')
      .update({
        calendar_event_sequence: newSequence,
        raw_ics: icsContent,
        last_calendar_update: new Date().toISOString()
      })
      .eq('id', outreachId);

    if (updateError) {
      console.error('Failed to update outreach sequence:', updateError);
    }

    // Log the outbound update to sync log
    const { error: logError } = await supabase
      .from('rms_outreach_sync_log')
      .insert({
        outreach_id: outreachId,
        user_id: outreach.user_id,
        sync_type: 'outbound_update',
        sync_direction: 'outbound',
        email_source: 'rel8_system',
        sequence_number: newSequence,
        status: status.toLowerCase(),
        changes: {
          update_type: updateType,
          new_sequence: newSequence
        }
      });

    if (logError) {
      console.error('Failed to log sync:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sequence: newSequence,
        emailId: emailResponse.data?.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in send-calendar-update:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);
