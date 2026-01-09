import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { encode as base64Encode } from "https://deno.land/std@0.190.0/encoding/base64.ts";

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
  includeContactsAsAttendees?: boolean;
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
      return details.phone ? `Phone: ${details.phone}` : 'Phone';
    case 'email':
      return details.email ? `Email: ${details.email}` : 'Email';
    case 'dm':
      return details.platform && details.handle 
        ? `${details.platform}: @${details.handle}` 
        : 'Direct Message';
    case 'meeting':
      return details.link 
        ? `Link: ${details.link}` 
        : details.meetingPlatform || 'Virtual Meeting';
    case 'irl':
      return details.address ? `Address: ${details.address}` : 'In Person';
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
    const { outreachId, updateType, userEmail, includeContactsAsAttendees }: CalendarUpdateRequest = await req.json();

    console.log('Processing calendar update:', { outreachId, updateType, userEmail, includeContactsAsAttendees });

    // Fetch outreach task with contacts (including emails)
    const { data: outreach, error: fetchError } = await supabase
      .from('rms_outreach')
      .select(`
        *,
        contacts:rms_outreach_contacts(
          contact:rms_contacts(id, name, email)
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

    // Fetch user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('user_id', outreach.user_id)
      .single();
    
    const userFullName = profile 
      ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() 
      : 'User';

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
    const summaryText = `${userFullName}: Follow up with - ${contactNames} #${shortId}`;
    
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

    // Add contacts as attendees if requested
    const contactEmails: string[] = [];
    if (includeContactsAsAttendees && outreach.contacts?.length > 0) {
      for (const contactEntry of outreach.contacts) {
        const contact = contactEntry.contact;
        if (contact.email) {
          icsLines.push(
            foldLine(`ATTENDEE;CN=${escapeICSText(contact.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${contact.email}`)
          );
          contactEmails.push(contact.email);
        }
      }
    }

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
    // User email subject - detailed with prefix and ID
    let userEmailSubject = `Updated: ${summaryText}`;
    if (updateType === 'cancel') {
      userEmailSubject = `Cancelled: ${summaryText}`;
    } else if (updateType === 'reschedule') {
      userEmailSubject = `Rescheduled: ${summaryText}`;
    }

    // Contact email subject - clean and friendly
    const contactEmailSubject = `Meeting invitation from ${userFullName}`;

    // User HTML body - detailed format
    const userHtmlBody = `
      <h2>Your REL8 outreach task has been ${updateType === 'cancel' ? 'cancelled' : 'updated'}</h2>
      <p><strong>${outreach.title}</strong></p>
      <p>${description}</p>
      ${updateType !== 'cancel' ? `
        <p><strong>When:</strong> ${new Date(outreach.due_date).toLocaleString()}</p>
        <p><strong>Where:</strong> ${location}</p>
        <p><strong>Priority:</strong> ${outreach.priority}</p>
      ` : '<p>This event has been cancelled.</p>'}
      <p>Your calendar will be updated automatically when you accept the attached invitation.</p>
    `;

    // Contact HTML body - friendly invitation format
    const contactHtmlBody = `
      <h2>${userFullName} has invited you to connect</h2>
      <p><strong>Follow up with: ${contactNames}</strong></p>
      ${updateType !== 'cancel' ? `
        <p><strong>When:</strong> ${new Date(outreach.due_date).toLocaleString()}</p>
        <p><strong>Where:</strong> ${location}</p>
      ` : '<p>This meeting has been cancelled.</p>'}
      <p>Please accept or decline the attached calendar invitation.</p>
    `;

    const icsBase64 = base64Encode(icsContent);

    // Send email to user with detailed subject
    const userEmailResponse = await resend.emails.send({
      from: 'Ecosystem Builder <notifications@ecosystembuilder.app>',
      to: [userEmail],
      subject: userEmailSubject,
      html: userHtmlBody,
      attachments: [
        {
          filename: 'outreach-update.ics',
          content: icsBase64,
        }
      ]
    });

    console.log('Email sent to user:', userEmailResponse);

    // Send separate email to contacts with friendly subject
    if (includeContactsAsAttendees && contactEmails.length > 0) {
      const contactEmailResponse = await resend.emails.send({
        from: 'Ecosystem Builder <notifications@ecosystembuilder.app>',
        to: contactEmails,
        subject: contactEmailSubject,  // "Meeting invitation from Marcus Johnson"
        html: contactHtmlBody,
        attachments: [
          {
            filename: 'meeting-invitation.ics',
            content: icsBase64,
          }
        ]
      });
      console.log(`Sent invitation to ${contactEmails.length} contacts:`, contactEmailResponse);
    }

    // Update database with new sequence, raw ICS, and contacts_notified_at if contacts were notified
    const updateData: any = {
      calendar_event_sequence: newSequence,
      raw_ics: icsContent,
      last_calendar_update: new Date().toISOString()
    };
    
    // Set contacts_notified_at when contacts are being notified
    if (includeContactsAsAttendees && contactEmails.length > 0) {
      updateData.contacts_notified_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('rms_outreach')
      .update(updateData)
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
        sync_type: updateType,
        email_source: 'rel8_system',
        sequence: newSequence,
        raw_ics: icsContent,
        changes: {
          update_type: updateType,
          new_sequence: newSequence,
          contacts_notified: includeContactsAsAttendees ? contactEmails : []
        }
      });

    if (logError) {
      console.error('Failed to log sync:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        sequence: newSequence,
        emailId: userEmailResponse.data?.id 
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
