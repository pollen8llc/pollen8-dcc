
/**
 * Call the Supabase Edge Function "test-service" with the given service/hook name.
 * Returns: { status, result, error }
 */
export async function testServiceHealth(name: string) {
  const response = await fetch("https://oltcuwvgdzszxshpfnre.functions.supabase.co/test-service", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name }),
    credentials: "include",
  });
  if (!response.ok) return { status: "fail", error: "API error", result: {} };

  const data = await response.json();
  return data;
}
