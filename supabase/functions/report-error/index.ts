
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// Runtime secrets from edge environment
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only authenticated users can report errors
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    const jwt = authHeader.replace("Bearer ", "");
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { global: { headers: { Authorization: `Bearer ${jwt}` } } });

    // Parse incoming error
    const { error_message, error_stack, location, details } = await req.json();

    // Get user info from the JWT
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 401, headers: corsHeaders });
    }

    // Insert into audit_logs with action "client_error"
    const { error: insertErr } = await client.from("audit_logs").insert([{
      action: "client_error",
      performed_by: user.id,
      details: {
        error_message,
        error_stack,
        location: location || null,
        details: details || null,
        reported_at: new Date().toISOString(),
        user_agent: req.headers.get("user-agent") || null,
      }
    }]);

    if (insertErr) {
      return new Response(JSON.stringify({ error: insertErr.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ status: "ok" }), { status: 200, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message ?? "Internal error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
