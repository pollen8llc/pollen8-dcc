
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  to: string;
  subject: string;
  html: string;
  toName?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { to, subject, html, toName } = await req.json() as EmailData;

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Sending email to ${to} (${toName || 'No name'}) with subject: ${subject}`);
    
    // Setup SMTP client
    const client = new SmtpClient();
    
    await client.connect({
      hostname: Deno.env.get('SMTP_HOST') || 'mail.pollen8.app',
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      username: Deno.env.get('SMTP_USER') || 'notifications@pollen8.app',
      password: Deno.env.get('SMTP_PASS'),
      tls: false, // For STARTTLS (starts as plain then upgrades)
      starttls: true,
    });
    
    // Send email
    await client.send({
      from: Deno.env.get('FROM_EMAIL') || 'notifications@pollen8.app',
      to: to,
      subject: subject,
      content: html,
      html: html,
    });
    
    // Close connection
    await client.close();

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
