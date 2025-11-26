import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResendWebhookPayload {
  type: string;
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    html?: string;
    text?: string;
    headers?: Record<string, string>;
    attachments?: Array<{
      filename: string;
      content_type: string;
      size: number;
    }>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("📧 Received calendar update webhook");

    // Parse the Resend webhook payload
    const payload: ResendWebhookPayload = await req.json();
    console.log("Webhook type:", payload.type);
    console.log("Email from:", payload.data.from);
    console.log("Email subject:", payload.data.subject);

    // Only process email.received events
    if (payload.type !== "email.received") {
      console.log("Ignoring non-received event:", payload.type);
      return new Response(JSON.stringify({ message: "Event ignored" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email_id, from, to, subject, text, html } = payload.data;
    
    // Extract system email from "To" addresses
    const systemEmailMatch = to?.find((addr: string) => addr.includes('@ecosystembuilder.app'));
    console.log("📬 System email recipient:", systemEmailMatch || "not found");

    // Parse email body content
    const emailBody = text || (html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '');
    console.log("📧 Email body preview:", emailBody ? emailBody.substring(0, 200) : "(empty)");

    // Parse status from subject line FIRST (calendar apps prefix subject with status)
    const subjectLower = subject.toLowerCase();
    let detectedStatus = 'update';

    if (subjectLower.startsWith('accepted:') || subjectLower.includes('accepted:')) {
      detectedStatus = 'accepted';
      console.log("📊 Status detected from subject: accepted");
    } else if (subjectLower.startsWith('declined:') || subjectLower.includes('declined:')) {
      detectedStatus = 'declined';
      console.log("📊 Status detected from subject: declined");
    } else if (subjectLower.startsWith('tentative:') || subjectLower.includes('tentative:')) {
      detectedStatus = 'tentative';
      console.log("📊 Status detected from subject: tentative");
    } else if (subjectLower.startsWith('cancelled:') || subjectLower.startsWith('canceled:')) {
      detectedStatus = 'cancelled';
      console.log("📊 Status detected from subject: cancelled");
    }

    // If no status in subject and we have a body, try parsing the body as fallback
    if (detectedStatus === 'update' && emailBody) {
      const bodyLower = emailBody.toLowerCase();

      if (bodyLower.includes('accepted') || bodyLower.includes('has accepted') || bodyLower.includes('going')) {
        detectedStatus = 'accepted';
        console.log("📊 Status detected from body: accepted");
      } else if (bodyLower.includes('declined') || bodyLower.includes('has declined') || bodyLower.includes('not going')) {
        detectedStatus = 'declined';
        console.log("📊 Status detected from body: declined");
      } else if (bodyLower.includes('tentative') || bodyLower.includes('maybe')) {
        detectedStatus = 'tentative';
        console.log("📊 Status detected from body: tentative");
      } else if (bodyLower.includes('cancelled') || bodyLower.includes('canceled')) {
        detectedStatus = 'cancelled';
        console.log("📊 Status detected from body: cancelled");
      } else if (bodyLower.includes('rescheduled') || bodyLower.includes('new time') || bodyLower.includes('changed to')) {
        detectedStatus = 'rescheduled';
        console.log("📊 Status detected from body: rescheduled");
      }
    }

    console.log("📊 Final detected status:", detectedStatus);

    // Extract responder information from 'from' field
    const responderMatch = from.match(/^(.+?)\s*<(.+?)>$/);
    const responderName = responderMatch ? responderMatch[1].replace(/['"]/g, '').trim() : null;
    const responderEmail = responderMatch ? responderMatch[2] : from;
    console.log("👤 Responder:", responderName || responderEmail);

    // Extract attendee note/comment from body if present
    let attendeeNote = null;
    if (emailBody) {
      const notePatterns = [
        /note[:\s]+["']?(.+?)["']?(?:\n\n|\n[A-Z]|$)/is,
        /comment[:\s]+["']?(.+?)["']?(?:\n\n|\n[A-Z]|$)/is,
        /message[:\s]+["']?(.+?)["']?(?:\n\n|\n[A-Z]|$)/is,
        /"([^"]{10,200})"/,  // Quoted message between 10-200 chars
      ];

      for (const pattern of notePatterns) {
        const match = emailBody.match(pattern);
        if (match) {
          attendeeNote = match[1].trim();
          if (attendeeNote.length > 200) {
            attendeeNote = attendeeNote.substring(0, 200) + '...';
          }
          console.log("💬 Attendee note found:", attendeeNote.substring(0, 50));
          break;
        }
      }
    }

    // Extract time changes from body
    let newTimeInfo = null;
    if (emailBody) {
      const timePatterns = [
        /when[:\s]+(.+?)(?:\n|$)/i,
        /time[:\s]+(.+?)(?:\n|$)/i,
        /new time[:\s]+(.+?)(?:\n|$)/i,
        /rescheduled to[:\s]+(.+?)(?:\n|$)/i,
        /changed to[:\s]+(.+?)(?:\n|$)/i,
      ];

      for (const pattern of timePatterns) {
        const match = emailBody.match(pattern);
        if (match) {
          newTimeInfo = match[1].trim();
          console.log("🕐 Time info found:", newTimeInfo);
          break;
        }
      }
    }

    // Extract location changes from body
    let newLocation = null;
    if (emailBody) {
      const locationPatterns = [
        /where[:\s]+(.+?)(?:\n|$)/i,
        /location[:\s]+(.+?)(?:\n|$)/i,
        /new location[:\s]+(.+?)(?:\n|$)/i,
      ];

      for (const pattern of locationPatterns) {
        const match = emailBody.match(pattern);
        if (match) {
          newLocation = match[1].trim();
          console.log("📍 Location found:", newLocation);
          break;
        }
      }
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to extract outreach info from "To" address first
    // Format: notifications-{6charUserId}{6charOutreachId}@ecosystembuilder.app
    let outreach = null;
    let lookupError = null;

    // Method 1: Match by system_email directly (most reliable)
    if (systemEmailMatch) {
      console.log("🔍 Attempting lookup by system_email:", systemEmailMatch);
      const result = await supabase
        .from("rms_outreach")
        .select("*")
        .eq("system_email", systemEmailMatch)
        .single();
      
      outreach = result.data;
      lookupError = result.error;
    }

    // Method 2: Fallback - Parse short ID from system email
    if (!outreach && systemEmailMatch) {
      const emailMatch = systemEmailMatch.match(/notifications-[a-f0-9]{6}([a-f0-9]{6})@/i);
      if (emailMatch) {
        const shortOutreachId = emailMatch[1];
        console.log("🔍 Attempting lookup by short ID from email:", shortOutreachId);
        const result = await supabase
          .from("rms_outreach")
          .select("*")
          .filter('id::text', 'ilike', `${shortOutreachId}%`)
          .single();
        
        outreach = result.data;
        lookupError = result.error;
      }
    }

    // Method 3: Fallback - Parse short ID from subject (original method)
    if (!outreach) {
      const subjectMatch = subject.match(/#([a-f0-9]{8})(?:\s*$|\s)/i);
      if (subjectMatch) {
        const shortId = subjectMatch[1];
        console.log("🔍 Attempting lookup by short ID from subject:", shortId);
        const result = await supabase
          .from("rms_outreach")
          .select("*")
          .filter('id::text', 'ilike', `${shortId}%`)
          .single();
        
        outreach = result.data;
        lookupError = result.error;
      }
    }

    if (!outreach) {
      console.log("❌ No matching outreach task found");
      return new Response(JSON.stringify({ message: "No matching task" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ Found matching outreach task:", outreach.id);

    // Build comprehensive changes object with all extracted data
    const changes: Record<string, any> = {
      status: { old: outreach.status, new: detectedStatus },
      responder: {
        name: responderName,
        email: responderEmail
      }
    };

    // Add optional fields if found
    if (attendeeNote) {
      changes.note = attendeeNote;
    }
    if (newTimeInfo) {
      changes.newTime = newTimeInfo;
      // Try to parse as date for due_date update
      try {
        const parsedDate = new Date(newTimeInfo);
        if (!isNaN(parsedDate.getTime())) {
          changes.due_date = { old: outreach.due_date, new: parsedDate.toISOString() };
        }
      } catch (e) {
        console.log("Could not parse time as date:", newTimeInfo);
      }
    }
    if (newLocation) {
      changes.location = newLocation;
    }

    // Update the outreach task status
    const updateData: any = {
      last_calendar_update: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Update status based on detected action
    if (detectedStatus === 'cancelled') {
      updateData.status = 'cancelled';
    } else if (detectedStatus === 'accepted') {
      updateData.status = 'active';
    }

    // Update date if rescheduled and we have a new date
    if (changes.due_date) {
      updateData.due_date = changes.due_date.new;
    }

    const { error: updateError } = await supabase
      .from("rms_outreach")
      .update(updateData)
      .eq("id", outreach.id);

    if (updateError) {
      console.error("Failed to update outreach task:", updateError);
      return new Response(JSON.stringify({ error: "Update failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ Outreach task updated");

    // Log to sync log with email body
    const { error: logError } = await supabase
      .from("rms_outreach_sync_log")
      .insert({
        outreach_id: outreach.id,
        user_id: outreach.user_id,
        sync_type: detectedStatus,
        changes: changes,
        raw_ics: emailBody, // Store email body in raw_ics field
        email_from: from,
        email_subject: subject,
        sequence: null, // No sequence from email body
      });

    if (logError) {
      console.error("Failed to log sync event:", logError);
    } else {
      console.log("✅ Sync logged");
    }

    return new Response(
      JSON.stringify({
        message: "Calendar update processed",
        outreach_id: outreach.id,
        sync_type: detectedStatus,
        changes: Object.keys(changes),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("❌ Error processing calendar update:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
