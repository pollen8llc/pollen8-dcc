import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import ICAL from "https://esm.sh/ical.js@1.5.0";

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

    const { email_id, from, subject, attachments } = payload.data;

    // Check if there are attachments
    if (!attachments || attachments.length === 0) {
      console.log("No attachments found, skipping");
      return new Response(JSON.stringify({ message: "No attachments" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find ICS attachment
    const icsAttachment = attachments.find(
      (att) => att.filename.endsWith(".ics") || att.content_type === "text/calendar"
    );

    if (!icsAttachment) {
      console.log("No ICS attachment found");
      return new Response(JSON.stringify({ message: "No ICS attachment" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("📎 Found ICS attachment:", icsAttachment.filename);

    // Fetch the ICS attachment from Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch attachment content from Resend
    const attachmentResponse = await fetch(
      `https://api.resend.com/emails/${email_id}/attachments/${icsAttachment.filename}`,
      {
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
        },
      }
    );

    if (!attachmentResponse.ok) {
      console.error("Failed to fetch attachment:", attachmentResponse.statusText);
      return new Response(JSON.stringify({ error: "Failed to fetch attachment" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const icsContent = await attachmentResponse.text();
    console.log("📄 ICS content fetched, length:", icsContent.length);

    // Parse ICS using ical.js
    const jcalData = ICAL.parse(icsContent);
    const comp = new ICAL.Component(jcalData);
    const vevent = comp.getFirstSubcomponent("vevent");

    if (!vevent) {
      console.log("No VEVENT found in ICS");
      return new Response(JSON.stringify({ message: "No VEVENT" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract event properties
    const uid = vevent.getFirstPropertyValue("uid");
    const summary = vevent.getFirstPropertyValue("summary");
    const description = vevent.getFirstPropertyValue("description");
    const dtstart = vevent.getFirstPropertyValue("dtstart");
    const dtend = vevent.getFirstPropertyValue("dtend");
    const sequence = vevent.getFirstPropertyValue("sequence") || 0;
    const status = vevent.getFirstPropertyValue("status") || "CONFIRMED";

    console.log("📅 Parsed ICS:", { uid, summary, sequence, status });

    if (!uid) {
      console.log("No UID in ICS, cannot match to outreach task");
      return new Response(JSON.stringify({ message: "No UID" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to parse short outreach ID from subject line first
    // Format: "Outreach #12345678: ..." or "RE: Outreach #12345678: ..."
    const subjectMatch = subject.match(/Outreach\s+#([a-f0-9]{8}):/i);
    let outreach = null;
    let lookupError = null;

    if (subjectMatch) {
      const shortId = subjectMatch[1];
      console.log("📧 Parsed short outreach ID from subject:", shortId);
      
      // Find outreach where ID starts with this short ID
      const result = await supabase
        .from("rms_outreach")
        .select("*")
        .ilike("id", `${shortId}%`)
        .single();
      
      outreach = result.data;
      lookupError = result.error;
      
      if (outreach) {
        console.log("✅ Found outreach by short ID:", outreach.id);
      }
    }

    // Fallback to ICS UID matching if subject parsing failed
    if (!outreach && uid) {
      console.log("Trying ICS UID fallback:", uid);
      const result = await supabase
        .from("rms_outreach")
        .select("*")
        .eq("ics_uid", uid)
        .single();
      
      outreach = result.data;
      lookupError = result.error;
    }

    if (lookupError || !outreach) {
      console.log("No matching outreach task found");
      return new Response(JSON.stringify({ message: "No matching task" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ Found matching outreach task:", outreach.id);

    // Calculate what changed
    const changes: Record<string, any> = {};
    const newStartDate = dtstart ? dtstart.toJSDate().toISOString() : null;
    const newEndDate = dtend ? dtend.toJSDate().toISOString() : null;

    if (newStartDate && outreach.due_date !== newStartDate) {
      changes.due_date = { old: outreach.due_date, new: newStartDate };
    }
    if (summary && outreach.title !== summary) {
      changes.title = { old: outreach.title, new: summary };
    }
    if (description && outreach.description !== description) {
      changes.description = { old: outreach.description, new: description };
    }
    if (sequence !== outreach.sequence) {
      changes.sequence = { old: outreach.sequence, new: sequence };
    }

    // Determine sync type
    let syncType = "update";
    if (status === "CANCELLED") {
      syncType = "cancel";
    } else if (changes.due_date) {
      syncType = "reschedule";
    }

    // Update the outreach task
    const { error: updateError } = await supabase
      .from("rms_outreach")
      .update({
        due_date: newStartDate || outreach.due_date,
        title: summary || outreach.title,
        description: description || outreach.description,
        sequence: sequence,
        status: status === "CANCELLED" ? "cancelled" : outreach.status,
        last_calendar_update: new Date().toISOString(),
        raw_ics: icsContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", outreach.id);

    if (updateError) {
      console.error("Failed to update outreach task:", updateError);
      return new Response(JSON.stringify({ error: "Update failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ Outreach task updated");

    // Log to sync log
    const { error: logError } = await supabase
      .from("rms_outreach_sync_log")
      .insert({
        outreach_id: outreach.id,
        user_id: outreach.user_id,
        sync_type: syncType,
        changes: changes,
        raw_ics: icsContent,
        email_from: from,
        email_subject: subject,
        sequence: sequence,
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
        sync_type: syncType,
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
