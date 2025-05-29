
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    // Using fetch to send email via a more reliable external email service
    // This is a mock implementation - email isn't actually sent since we don't have
    // a working email service in the Deno environment yet
    
    // We'll simulate success for testing purposes
    // In a production environment, you would integrate with a service like Resend, SendGrid, etc.
    
    // Mock successful response
    return new Response(
      JSON.stringify({ success: true, message: 'Email processed successfully (mock response)' }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error processing email:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
