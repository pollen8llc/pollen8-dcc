import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, Handshake, Heart, LucideIcon } from "lucide-react";

// Database types
export interface RelationshipLevel {
  id: string;
  level: number;
  label: string;
  description: string;
  starting_tier: number;
  skipped_tiers: number[];
  icon_name: string;
  display_order: number;
}

export interface TierMetadata {
  tier: number;
  label: string;
  description: string | null;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  Users,
  Handshake,
  Heart,
};

export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || Users;
}

// Fetch relationship levels from database
export function useRelationshipLevels() {
  return useQuery({
    queryKey: ["relationship-levels"],
    queryFn: async (): Promise<RelationshipLevel[]> => {
      const { data, error } = await (supabase.rpc as any)("get_relationship_levels");

      if (error) {
        console.error("Error fetching relationship levels:", error);
        throw error;
      }

      return (data || []) as RelationshipLevel[];
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour - this data rarely changes
  });
}

// Fetch tier metadata from database
export function useTierMetadata() {
  return useQuery({
    queryKey: ["tier-metadata"],
    queryFn: async (): Promise<TierMetadata[]> => {
      const { data, error } = await (supabase.rpc as any)("get_tier_metadata");

      if (error) {
        console.error("Error fetching tier metadata:", error);
        throw error;
      }

      return (data || []) as TierMetadata[];
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

// Helper to get tier labels as a Record for easy lookup
export function useTierLabels(): Record<number, string> {
  const { data: tiers } = useTierMetadata();

  if (!tiers) {
    // Fallback while loading
    return {
      1: "Foundation",
      2: "Growth",
      3: "Professional",
      4: "Advanced",
    };
  }

  return tiers.reduce(
    (acc, tier) => {
      acc[tier.tier] = tier.label;
      return acc;
    },
    {} as Record<number, string>
  );
}

// Step instance types for progress tracking
export type StepStatus =
  | "pending"
  | "active"
  | "completed"
  | "missed"
  | "retrying";
export type StepOutcome = "completed" | "missed" | "declined" | null;

export interface StepInstance {
  id: string;
  user_id: string;
  actv8_contact_id: string;
  path_instance_id: string | null;
  step_id: string;
  step_index: number;
  path_id: string;
  status: StepStatus;
  retry_count: number;
  last_outcome: StepOutcome;
  outreach_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  days_to_complete: number | null;
  interaction_outcome: string | null;
  rapport_progress: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Fetch step instances for a contact
export function useStepInstances(actv8ContactId: string | undefined) {
  return useQuery({
    queryKey: ["step-instances", actv8ContactId],
    queryFn: async (): Promise<StepInstance[]> => {
      if (!actv8ContactId) return [];

      const { data, error } = await (supabase.rpc as any)("get_step_instances", {
        p_actv8_contact_id: actv8ContactId,
      });

      if (error) {
        console.error("Error fetching step instances:", error);
        throw error;
      }

      return (data || []) as StepInstance[];
    },
    enabled: !!actv8ContactId,
  });
}

// RPC function wrappers
export async function markStepMissed(
  actv8ContactId: string,
  stepIndex: number,
  reason: string = "missed"
): Promise<StepInstance | null> {
  const { data, error } = await (supabase.rpc as any)("mark_step_missed", {
    p_actv8_contact_id: actv8ContactId,
    p_step_index: stepIndex,
    p_reason: reason,
  });

  if (error) {
    console.error("Error marking step missed:", error);
    throw error;
  }

  return data as StepInstance | null;
}

export async function retryStep(
  actv8ContactId: string,
  stepIndex: number
): Promise<StepInstance | null> {
  const { data, error } = await (supabase.rpc as any)("retry_step", {
    p_actv8_contact_id: actv8ContactId,
    p_step_index: stepIndex,
  });

  if (error) {
    console.error("Error retrying step:", error);
    throw error;
  }

  return data as StepInstance | null;
}

export interface CompleteStepResult {
  step_instance: StepInstance;
  path_complete: boolean;
  completed_count: number;
  total_steps: number;
}

export async function completeStep(
  actv8ContactId: string,
  stepIndex: number,
  outreachId?: string,
  interactionOutcome?: string,
  rapportProgress?: string
): Promise<CompleteStepResult> {
  const { data, error } = await (supabase.rpc as any)("complete_step", {
    p_actv8_contact_id: actv8ContactId,
    p_step_index: stepIndex,
    p_outreach_id: outreachId || null,
    p_interaction_outcome: interactionOutcome || null,
    p_rapport_progress: rapportProgress || null,
  });

  if (error) {
    console.error("Error completing step:", error);
    throw error;
  }

  return data as unknown as CompleteStepResult;
}

export async function checkLevelCompletion(
  actv8ContactId: string,
  level: number
): Promise<boolean> {
  const { data, error } = await (supabase.rpc as any)("check_level_completion", {
    p_actv8_contact_id: actv8ContactId,
    p_level: level,
  });

  if (error) {
    console.error("Error checking level completion:", error);
    throw error;
  }

  return data as boolean;
}

export interface SwitchLevelResult {
  success: boolean;
  error?: string;
  new_level?: number;
  new_tier?: number;
  switch_count?: number;
  requires_completion?: number;
}

export async function switchRelationshipLevel(
  actv8ContactId: string,
  newLevel: number
): Promise<SwitchLevelResult> {
  const { data, error } = await (supabase.rpc as any)("switch_relationship_level", {
    p_actv8_contact_id: actv8ContactId,
    p_new_level: newLevel,
  });

  if (error) {
    console.error("Error switching relationship level:", error);
    throw error;
  }

  return data as unknown as SwitchLevelResult;
}
