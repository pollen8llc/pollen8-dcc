
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name } = await req.json();
    if (!name) {
      return new Response(
        JSON.stringify({ error: "Missing 'name' in request" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let result = null;
    let error = null;

    switch (name) {
      case "useCreateCommunity":
        // Try to fetch all communities as a basic health check for creating communities
        // (Assumes access to the table/query is enough)
        const { data: comms, error: commsErr } = await supabase
          .from("communities")
          .select("id")
          .limit(1);
        if (commsErr) {
          error = commsErr.message;
        } else {
          result = { communities: comms.length };
        }
        break;

      case "useUserManagement":
        // Try to list users
        const { data: users, error: usersErr } = await supabase
          .from("profiles")
          .select("id")
          .limit(1);
        if (usersErr) {
          error = usersErr.message;
        } else {
          result = { users: users.length };
        }
        break;

      case "useAuth":
        // Check if auth is working by calling getUser()
        const { data: { user }, error: authErr } = await supabase.auth.getUser();
        if (authErr) {
          error = authErr.message;
        } else {
          result = { authenticated: !!user };
        }
        break;

      case "userAccountService":
        // Try to fetch one user account (profile)
        const { data: account, error: accErr } = await supabase
          .from("profiles")
          .select("id")
          .limit(1);
        if (accErr) {
          error = accErr.message;
        } else {
          result = { profile: account?.length ?? 0 };
        }
        break;

      case "communityQueryService":
        // Try to fetch communities
        const { data: cs, error: cErr } = await supabase.from("communities").select("id").limit(1);
        if (cErr) {
          error = cErr.message;
        } else {
          result = { communities: cs.length };
        }
        break;

      case "auditService":
        // Try to fetch audit logs
        const { data: logs, error: logErr } = await supabase
          .from("audit_logs")
          .select("id")
          .limit(1);
        if (logErr) {
          error = logErr.message;
        } else {
          result = { logCount: logs.length };
        }
        break;

      default:
        error = "Unknown service/hook: " + name;
    }

    const resp = { status: error ? "fail" : "ok", error: error ?? "", result: result ?? {} };
    return new Response(JSON.stringify(resp), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
