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

    const { email_id, from, subject, text, html } = payload.data;

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

    // Try to extract new date from email body for reschedules
    let newDateString = null;
    if (detectedStatus === 'rescheduled') {
      const datePatterns = [
        /new time[:\s]+(.+?)(?:\n|$)/i,
        /rescheduled to[:\s]+(.+?)(?:\n|$)/i,
        /changed to[:\s]+(.+?)(?:\n|$)/i,
      ];

      for (const pattern of datePatterns) {
        const match = emailBody.match(pattern);
        if (match) {
          newDateString = match[1].trim();
          console.log("📅 Extracted new date:", newDateString);
          break;
        }
      }
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to parse short outreach ID from subject line
    // Format: "Reminder set: Follow up with Aaron #904a90dd"
    // Also handles "RE: Reminder set: ..." or "Fwd: ..."
    const subjectMatch = subject.match(/#([a-f0-9]{8})(?:\s*$|\s)/i);
    
    if (!subjectMatch) {
      console.log("No outreach ID found in subject");
      return new Response(JSON.stringify({ message: "No task ID in subject" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const shortId = subjectMatch[1];
    console.log("📧 Parsed short outreach ID from subject:", shortId);
    
    // Find outreach where ID starts with this short ID
    const { data: outreach, error: lookupError } = await supabase
      .from("rms_outreach")
      .select("*")
      .ilike("id", `${shortId}%`)
      .single();

    if (lookupError || !outreach) {
      console.log("No matching outreach task found");
      return new Response(JSON.stringify({ message: "No matching task" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ Found matching outreach task:", outreach.id);

    // Calculate what changed based on detected status
    const changes: Record<string, any> = {
      status: { old: outreach.status, new: detectedStatus }
    };

    // Try to parse new date if provided
    if (newDateString) {
      try {
        const parsedDate = new Date(newDateString);
        if (!isNaN(parsedDate.getTime())) {
          changes.due_date = { old: outreach.due_date, new: parsedDate.toISOString() };
        }
      } catch (e) {
        console.log("Failed to parse new date:", newDateString);
      }
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

    // Create cross-platform notification for the user
    const notificationTitle = detectedStatus === 'cancelled' 
      ? '📅 Calendar Event Cancelled'
      : detectedStatus === 'accepted'
      ? '✅ Calendar Event Accepted'
      : detectedStatus === 'declined'
      ? '❌ Calendar Event Declined'
      : detectedStatus === 'tentative'
      ? '🤔 Calendar Event Tentative'
      : detectedStatus === 'rescheduled'
      ? '🔄 Calendar Event Rescheduled'
      : '📝 Calendar Event Updated';

    const notificationMessage = detectedStatus === 'cancelled'
      ? `${outreach.title} was cancelled`
      : detectedStatus === 'accepted'
      ? `${outreach.title} was accepted`
      : detectedStatus === 'declined'
      ? `${outreach.title} was declined`
      : detectedStatus === 'tentative'
      ? `${outreach.title} marked as tentative`
      : detectedStatus === 'rescheduled' && newDateString
      ? `${outreach.title} was rescheduled to ${newDateString}`
      : `${outreach.title} was updated`;

    const { error: notifError } = await supabase
      .from("cross_platform_notifications")
      .insert({
        user_id: outreach.user_id,
        title: notificationTitle,
        message: notificationMessage,
        notification_type: "calendar_sync",
        is_read: false,
        metadata: {
          outreachId: outreach.id,
          syncType: detectedStatus,
          changes: changes,
          emailFrom: from,
          emailSubject: subject
        }
      });

    if (notifError) {
      console.error("Failed to create notification:", notifError);
    } else {
      console.log("✅ User notification created");
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
