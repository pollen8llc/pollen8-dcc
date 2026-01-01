import { supabase } from "@/integrations/supabase/client";

export interface Evalu8Contact {
  id: string;
  user_id: string;
  contact_id: string;
  total_outreach_count: number;
  completed_outreach_count: number;
  pending_outreach_count: number;
  cancelled_outreach_count: number;
  total_notes_count: number;
  total_notes_word_count: number;
  engagement_score: number;
  connection_strength: string;
  rapport_status: string;
  actv8_path_id: string | null;
  actv8_current_step: number;
  actv8_total_steps: number;
  actv8_completed_steps: number;
  first_outreach_at: string | null;
  last_outreach_at: string | null;
  last_completed_outreach_at: string | null;
  last_note_added_at: string | null;
  last_actv8_update_at: string | null;
  average_response_time_hours: number | null;
  response_rate_percent: number | null;
  channel_stats: Record<string, number>;
  auto_summary: string | null;
  last_summary_update: string | null;
  created_at: string;
  updated_at: string;
}

export const getContactEvaluation = async (contactId: string): Promise<Evalu8Contact | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("evalu8_contacts")
    .select("*")
    .eq("contact_id", contactId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching evalu8 contact:", error);
    return null;
  }

  return data as Evalu8Contact | null;
};

export const refreshContactStats = async (contactId: string): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.rpc("calculate_evalu8_stats", {
    p_user_id: user.id,
    p_contact_id: contactId,
  });

  if (error) {
    console.error("Error refreshing evalu8 stats:", error);
    return null;
  }

  return data as string;
};

export const getOrCreateContactEvaluation = async (contactId: string): Promise<Evalu8Contact | null> => {
  // First try to get existing
  let evaluation = await getContactEvaluation(contactId);
  
  // If not found, trigger calculation
  if (!evaluation) {
    await refreshContactStats(contactId);
    evaluation = await getContactEvaluation(contactId);
  }

  return evaluation;
};

export const getUserEvaluationSummary = async (): Promise<{
  totalContacts: number;
  hotContacts: number;
  warmContacts: number;
  coldContacts: number;
  averageEngagement: number;
}> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { totalContacts: 0, hotContacts: 0, warmContacts: 0, coldContacts: 0, averageEngagement: 0 };
  }

  const { data, error } = await supabase
    .from("evalu8_contacts")
    .select("engagement_score, connection_strength")
    .eq("user_id", user.id);

  if (error || !data) {
    console.error("Error fetching evaluation summary:", error);
    return { totalContacts: 0, hotContacts: 0, warmContacts: 0, coldContacts: 0, averageEngagement: 0 };
  }

  const totalContacts = data.length;
  const hotContacts = data.filter(c => c.connection_strength === 'hot' || c.connection_strength === 'star').length;
  const warmContacts = data.filter(c => c.connection_strength === 'warm').length;
  const coldContacts = data.filter(c => c.connection_strength === 'cold').length;
  const averageEngagement = totalContacts > 0 
    ? Math.round(data.reduce((sum, c) => sum + (c.engagement_score || 0), 0) / totalContacts)
    : 0;

  return { totalContacts, hotContacts, warmContacts, coldContacts, averageEngagement };
};
