import { supabase } from "@/integrations/supabase/client";

export interface Formula {
  id: string;
  category: string;
  key: string;
  value: number;
  label: string;
  description?: string;
  min_value?: number;
  max_value?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FormulaConfig {
  weights: {
    path_weight: number;
    engagement_weight: number;
    origin_weight: number;
    network_weight: number;
  };
  engagement: {
    calendar_accepts_points: number;
    fast_response_points: number;
    ignored_penalty: number;
    decline_penalty: number;
    gap_penalty: number;
  };
  origin: {
    invite_points: number;
    wizard_points: number;
    manual_points: number;
    import_points: number;
    unknown_points: number;
    inviter_bonus: number;
  };
  network: {
    shared_contacts_multiplier: number;
    affiliations_multiplier: number;
    communities_multiplier: number;
  };
  path: {
    tier_multiplier: number;
    completed_path_points: number;
    skipped_path_penalty: number;
  };
  thresholds: {
    star_min: number;
    flame_min: number;
    ember_min: number;
  };
  avatar_tiers: {
    tier_5_min: number;
    tier_4_min: number;
    tier_3_min: number;
    tier_2_min: number;
  };
}

export async function getFormulas(): Promise<Formula[]> {
  const { data, error } = await supabase
    .from('formulas')
    .select('*')
    .order('category', { ascending: true })
    .order('key', { ascending: true });

  if (error) {
    console.error('Error fetching formulas:', error);
    throw error;
  }

  return (data || []).map(f => ({
    ...f,
    value: Number(f.value),
    min_value: f.min_value ? Number(f.min_value) : undefined,
    max_value: f.max_value ? Number(f.max_value) : undefined,
  }));
}

export async function getFormulasByCategory(category: string): Promise<Formula[]> {
  const { data, error } = await supabase
    .from('formulas')
    .select('*')
    .eq('category', category)
    .order('key', { ascending: true });

  if (error) {
    console.error('Error fetching formulas by category:', error);
    throw error;
  }

  return (data || []).map(f => ({
    ...f,
    value: Number(f.value),
    min_value: f.min_value ? Number(f.min_value) : undefined,
    max_value: f.max_value ? Number(f.max_value) : undefined,
  }));
}

export async function updateFormula(id: string, value: number): Promise<Formula> {
  const { data, error } = await supabase
    .from('formulas')
    .update({ value })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating formula:', error);
    throw error;
  }

  return {
    ...data,
    value: Number(data.value),
    min_value: data.min_value ? Number(data.min_value) : undefined,
    max_value: data.max_value ? Number(data.max_value) : undefined,
  };
}

export async function getFormulaConfig(): Promise<FormulaConfig> {
  const formulas = await getFormulas();
  
  const getValue = (category: string, key: string, defaultValue: number): number => {
    const formula = formulas.find(f => f.category === category && f.key === key);
    return formula ? formula.value : defaultValue;
  };

  return {
    weights: {
      path_weight: getValue('weights', 'path_weight', 40),
      engagement_weight: getValue('weights', 'engagement_weight', 30),
      origin_weight: getValue('weights', 'origin_weight', 15),
      network_weight: getValue('weights', 'network_weight', 15),
    },
    engagement: {
      calendar_accepts_points: getValue('engagement', 'calendar_accepts_points', 6),
      fast_response_points: getValue('engagement', 'fast_response_points', 4),
      ignored_penalty: getValue('engagement', 'ignored_penalty', -6),
      decline_penalty: getValue('engagement', 'decline_penalty', -5),
      gap_penalty: getValue('engagement', 'gap_penalty', -5),
    },
    origin: {
      invite_points: getValue('origin', 'invite_points', 12),
      wizard_points: getValue('origin', 'wizard_points', 10),
      manual_points: getValue('origin', 'manual_points', 7),
      import_points: getValue('origin', 'import_points', 5),
      unknown_points: getValue('origin', 'unknown_points', 3),
      inviter_bonus: getValue('origin', 'inviter_bonus', 3),
    },
    network: {
      shared_contacts_multiplier: getValue('network', 'shared_contacts_multiplier', 1.5),
      affiliations_multiplier: getValue('network', 'affiliations_multiplier', 1),
      communities_multiplier: getValue('network', 'communities_multiplier', 1),
    },
    path: {
      tier_multiplier: getValue('path', 'tier_multiplier', 5),
      completed_path_points: getValue('path', 'completed_path_points', 4),
      skipped_path_penalty: getValue('path', 'skipped_path_penalty', -2),
    },
    thresholds: {
      star_min: getValue('thresholds', 'star_min', 75),
      flame_min: getValue('thresholds', 'flame_min', 50),
      ember_min: getValue('thresholds', 'ember_min', 25),
    },
    avatar_tiers: {
      tier_5_min: getValue('avatar_tiers', 'tier_5_min', 80),
      tier_4_min: getValue('avatar_tiers', 'tier_4_min', 60),
      tier_3_min: getValue('avatar_tiers', 'tier_3_min', 40),
      tier_2_min: getValue('avatar_tiers', 'tier_2_min', 20),
    },
  };
}

export function formulasToConfig(formulas: Formula[]): FormulaConfig {
  const getValue = (category: string, key: string, defaultValue: number): number => {
    const formula = formulas.find(f => f.category === category && f.key === key);
    return formula ? formula.value : defaultValue;
  };

  return {
    weights: {
      path_weight: getValue('weights', 'path_weight', 40),
      engagement_weight: getValue('weights', 'engagement_weight', 30),
      origin_weight: getValue('weights', 'origin_weight', 15),
      network_weight: getValue('weights', 'network_weight', 15),
    },
    engagement: {
      calendar_accepts_points: getValue('engagement', 'calendar_accepts_points', 6),
      fast_response_points: getValue('engagement', 'fast_response_points', 4),
      ignored_penalty: getValue('engagement', 'ignored_penalty', -6),
      decline_penalty: getValue('engagement', 'decline_penalty', -5),
      gap_penalty: getValue('engagement', 'gap_penalty', -5),
    },
    origin: {
      invite_points: getValue('origin', 'invite_points', 12),
      wizard_points: getValue('origin', 'wizard_points', 10),
      manual_points: getValue('origin', 'manual_points', 7),
      import_points: getValue('origin', 'import_points', 5),
      unknown_points: getValue('origin', 'unknown_points', 3),
      inviter_bonus: getValue('origin', 'inviter_bonus', 3),
    },
    network: {
      shared_contacts_multiplier: getValue('network', 'shared_contacts_multiplier', 1.5),
      affiliations_multiplier: getValue('network', 'affiliations_multiplier', 1),
      communities_multiplier: getValue('network', 'communities_multiplier', 1),
    },
    path: {
      tier_multiplier: getValue('path', 'tier_multiplier', 5),
      completed_path_points: getValue('path', 'completed_path_points', 4),
      skipped_path_penalty: getValue('path', 'skipped_path_penalty', -2),
    },
    thresholds: {
      star_min: getValue('thresholds', 'star_min', 75),
      flame_min: getValue('thresholds', 'flame_min', 50),
      ember_min: getValue('thresholds', 'ember_min', 25),
    },
    avatar_tiers: {
      tier_5_min: getValue('avatar_tiers', 'tier_5_min', 80),
      tier_4_min: getValue('avatar_tiers', 'tier_4_min', 60),
      tier_3_min: getValue('avatar_tiers', 'tier_3_min', 40),
      tier_2_min: getValue('avatar_tiers', 'tier_2_min', 20),
    },
  };
}
