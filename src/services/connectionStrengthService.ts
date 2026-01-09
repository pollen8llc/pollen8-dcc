import { supabase } from "@/integrations/supabase/client";

export interface FormulaConfig {
  weights: Record<string, number>;
  engagement: Record<string, number>;
  origin: Record<string, number>;
  network: Record<string, number>;
  path: Record<string, number>;
  thresholds: Record<string, number>;
  avatar_tiers: Record<string, number>;
}

/**
 * Fetch all formulas from database grouped by category
 */
export async function fetchFormulas(): Promise<FormulaConfig> {
  const { data, error } = await supabase
    .from('formulas')
    .select('category, key, value');

  if (error) {
    console.error('Error fetching formulas:', error);
    throw error;
  }

  const config: FormulaConfig = {
    weights: {},
    engagement: {},
    origin: {},
    network: {},
    path: {},
    thresholds: {},
    avatar_tiers: {}
  };

  data?.forEach(formula => {
    const category = formula.category as keyof FormulaConfig;
    if (config[category]) {
      config[category][formula.key] = Number(formula.value);
    }
  });

  return config;
}

/**
 * Calculate connection strength for a single contact
 */
export async function calculateContactStrength(userId: string, contactId: string): Promise<number> {
  const { data, error } = await supabase.rpc('calculate_contact_strength', {
    p_user_id: userId,
    p_contact_id: contactId
  });

  if (error) {
    console.error('Error calculating contact strength:', error);
    throw error;
  }

  return data as number;
}

/**
 * Update user's network score based on all their contacts
 */
export async function updateUserNetworkScore(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('update_user_network_score', {
    p_user_id: userId
  });

  if (error) {
    console.error('Error updating network score:', error);
    throw error;
  }

  return data as number;
}

/**
 * Recalculate strength for all contacts of a user
 */
export async function recalculateAllContacts(userId: string): Promise<void> {
  // Get all contacts for user
  const { data: contacts, error } = await supabase
    .from('rms_contacts')
    .select('id')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }

  // Calculate strength for each contact
  for (const contact of contacts || []) {
    await calculateContactStrength(userId, contact.id);
  }

  // Update user's aggregate network score
  await updateUserNetworkScore(userId);
}

/**
 * Get network score tier based on score value
 */
export function getNetworkScoreTier(score: number): { tier: number; planets: number; label: string } {
  if (score >= 2500) return { tier: 5, planets: 5, label: 'Legendary' };
  if (score >= 1000) return { tier: 4, planets: 4, label: 'Elite' };
  if (score >= 500) return { tier: 3, planets: 3, label: 'Established' };
  if (score >= 250) return { tier: 2, planets: 2, label: 'Growing' };
  if (score >= 100) return { tier: 1, planets: 1, label: 'Emerging' };
  return { tier: 0, planets: 0, label: 'Starting' };
}

/**
 * Get user's current network score and tier
 */
export async function getUserNetworkScore(userId: string): Promise<{
  score: number;
  avgStrength: number;
  tier: { tier: number; planets: number; label: string };
}> {
  const { data, error } = await supabase
    .from('iotas')
    .select('network_score, avg_connection_strength')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching network score:', error);
    throw error;
  }

  const score = data?.network_score || 0;
  const avgStrength = Number(data?.avg_connection_strength) || 0;

  return {
    score,
    avgStrength,
    tier: getNetworkScoreTier(score)
  };
}
