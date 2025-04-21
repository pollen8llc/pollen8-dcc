
import { supabase } from "@/integrations/supabase/client";

/**
 * Call the Supabase Edge Function "test-service" with the given service/hook name.
 * Returns: { status, result, error }
 */
export async function testServiceHealth(name: string) {
  const { data, error } = await supabase.functions.invoke("test-service", {
    body: { name },
  });

  if (error) {
    return { status: "fail", error: error.message ?? "API error", result: {} };
  }
  return data;
}
