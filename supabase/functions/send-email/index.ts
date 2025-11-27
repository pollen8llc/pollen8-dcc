import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ICSAttachment {
  filename: string;
  content: string;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  toName?: string;
  icsAttachment?: ICSAttachment;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, toName, icsAttachment } = await req.json() as EmailData;

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Sending email to ${to} (${toName || 'No name'}) with subject: ${subject}`);

    // Prepare email payload
    const emailPayload: any = {
      from: 'Ecosystem Builder Notifications <notifications@ecosystembuilder.app>',
      to: [to],
      subject: subject,
      html: html,
    };

    // Add ICS attachment if provided
    if (icsAttachment) {
      console.log(`Adding ICS attachment: ${icsAttachment.filename}`);
      
      // Convert ICS content to base64 with proper UTF-8 handling
      const base64Content = btoa(unescape(encodeURIComponent(icsAttachment.content)));

      emailPayload.attachments = [
        {
          filename: icsAttachment.filename,
          content: base64Content,
          content_type: 'text/calendar; charset=utf-8; method=REQUEST'
        }
      ];
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send(emailPayload);

    console.log('Email sent successfully via Resend:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        id: emailResponse.data?.id 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error: any) {
    console.error('Error sending email via Resend:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.statusCode ? `Resend API error: ${error.statusCode}` : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
