import { supabase } from "@/integrations/supabase/client";
import type { AssessmentLevel } from "@/components/rel8t/network/RelationshipAssessmentStep";
import type { Json } from "@/integrations/supabase/types";

/**
 * Updates the relationship level for an Actv8 contact.
 * This recalculates skipped tiers based on the new level.
 * Creates skipped path instances for proper progress bar tracking.
 */
export async function updateRelationshipLevel(
  actv8ContactId: string,
  newLevel: AssessmentLevel
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get current contact data
  const { data: contact, error: fetchError } = await supabase
    .from('rms_actv8_contacts')
    .select('skipped_paths, path_history, path_tier, current_path_instance_id')
    .eq('id', actv8ContactId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Mark current path instance as skipped if exists
  if (contact.current_path_instance_id) {
    await supabase
      .from("rms_actv8_path_instances")
      .update({ 
        status: 'skipped',
        ended_at: new Date().toISOString()
      })
      .eq("id", contact.current_path_instance_id);
  }

  // Get existing skipped tier numbers from path instances
  const { data: existingInstances } = await supabase
    .from('rms_actv8_path_instances')
    .select('path_id, rms_actv8_paths!inner(tier)')
    .eq('actv8_contact_id', actv8ContactId)
    .eq('status', 'skipped');
  
  const existingSkippedTiers = new Set(
    (existingInstances || []).map((i: any) => i.rms_actv8_paths.tier)
  );

  // Get paths for tiers that need to be skipped
  const tiersToSkip = newLevel.skippedTiers.filter(tier => !existingSkippedTiers.has(tier));
  
  if (tiersToSkip.length > 0) {
    // Get one path per tier to create skipped instances
    const { data: pathsForTiers } = await supabase
      .from('rms_actv8_paths')
      .select('id, tier')
      .in('tier', tiersToSkip)
      .order('tier_order', { ascending: true });
    
    // Create skipped path instances - one per tier
    const seenTiers = new Set<number>();
    for (const path of pathsForTiers || []) {
      if (seenTiers.has(path.tier)) continue;
      seenTiers.add(path.tier);
      
      await supabase
        .from('rms_actv8_path_instances')
        .insert({
          user_id: user.id,
          actv8_contact_id: actv8ContactId,
          path_id: path.id,
          status: 'skipped',
          started_at: new Date().toISOString(),
          ended_at: new Date().toISOString(),
        });
    }
  }

  // Also update deprecated fields for backward compatibility
  const existingSkipped = (contact.skipped_paths || []) as unknown as SkippedPathEntry[];
  const newSkippedEntries: SkippedPathEntry[] = newLevel.skippedTiers
    .filter(tier => !existingSkipped.find(s => s.tier_at_skip === tier))
    .map(tier => ({
      path_id: `tier_${tier}_level_assessment`,
      path_name: `Tier ${tier} (Relationship Level)`,
      skipped_at: new Date().toISOString(),
      reason: 'already_established',
      tier_at_skip: tier,
    }));
  
  const { error: updateError } = await supabase
    .from('rms_actv8_contacts')
    .update({
      relationship_level: newLevel.level, // Store explicit level number (1-4)
      path_tier: newLevel.startingTier,
      skipped_paths: [...existingSkipped, ...newSkippedEntries] as unknown as Json[],
      development_path_id: null, // Reset path selection
      current_step_index: 0,
      completed_steps: [],
      current_path_instance_id: null, // Clear instance reference
    })
    .eq('id', actv8ContactId);
  
  if (updateError) throw updateError;
}

// Types
export interface DevelopmentPath {
  id: string;
  name: string;
  description: string;
  target_strength: string;
  is_system: boolean;
  tier: number;
  tier_order: number;
  is_required: boolean;
  steps?: DevelopmentPathStep[];
}

export interface PathHistoryEntry {
  path_id: string;
  path_name: string;
  completed_at: string;
  steps_completed: number;
}

export interface SkippedPathEntry {
  path_id: string;
  path_name: string;
  skipped_at: string;
  reason?: string;
  tier_at_skip: number;
}

export interface DevelopmentPathStep {
  id: string;
  path_id: string;
  step_order: number;
  name: string;
  description: string;
  suggested_action: string;
  suggested_channel: string;
  suggested_tone: string;
}

export interface Actv8Contact {
  id: string;
  user_id: string;
  contact_id: string;
  development_path_id: string;
  current_path_instance_id: string | null; // Unique instance for each path "run"
  current_step_index: number;
  completed_steps: string[];
  connection_strength: string | null;
  relationship_type: string | null;
  warmth_level: string | null;
  intention_id: string | null;
  intention_notes: string | null;
  status: string;
  activated_at: string | null;
  path_started_at: string | null;
  last_touchpoint_at: string | null;
  target_completion_date: string | null;
  path_tier: number;
  path_history: PathHistoryEntry[];
  skipped_paths: SkippedPathEntry[];
  created_at: string;
  updated_at: string;
  // Joined data
  contact?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    organization: string | null;
    role: string | null;
    tags: string[] | null;
  };
  path?: DevelopmentPath;
  affiliatedUserId?: string | null;
}

// Helper to transform database response to typed Actv8Contact
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformActv8Contact(data: any): Actv8Contact {
  return {
    ...data,
    path_tier: data.path_tier ?? 1,
    current_path_instance_id: data.current_path_instance_id || null,
    path_history: (data.path_history as PathHistoryEntry[]) || [],
    skipped_paths: (data.skipped_paths as SkippedPathEntry[]) || [],
  };
}

// Helper to create a new path instance
async function createPathInstance(
  userId: string, 
  actv8ContactId: string, 
  pathId: string
): Promise<string> {
  const { data, error } = await supabase
    .from("rms_actv8_path_instances")
    .insert({
      user_id: userId,
      actv8_contact_id: actv8ContactId,
      path_id: pathId,
      status: 'active',
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  
  if (error) throw error;
  return data.id;
}

export interface Actv8Strategy {
  id: string;
  user_id: string;
  actv8_contact_id: string;
  intention_id: string;
  intention_notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  actions?: Actv8StrategyAction[];
}

export interface Actv8StrategyAction {
  id: string;
  strategy_id: string;
  action_type: string;
  scheduled_date: string | null;
  channel: string;
  tone: string;
  status: string;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Actv8Interaction {
  id: string;
  user_id: string;
  actv8_contact_id: string;
  interaction_date: string;
  location: string | null;
  topics: string | null;
  warmth: string;
  strengthened: boolean;
  follow_up: string | null;
  created_at: string;
}

// =====================================================
// Development Paths
// =====================================================

export async function getDevelopmentPaths(): Promise<DevelopmentPath[]> {
  const { data: paths, error: pathsError } = await supabase
    .from("rms_actv8_paths")
    .select("*")
    .order("tier")
    .order("tier_order");

  if (pathsError) throw pathsError;

  const { data: steps, error: stepsError } = await supabase
    .from("rms_actv8_path_steps")
    .select("*")
    .order("step_order");

  if (stepsError) throw stepsError;

  return (paths || []).map((path) => ({
    ...path,
    tier: path.tier ?? 1,
    tier_order: path.tier_order ?? 0,
    is_required: path.is_required ?? false,
    steps: (steps || []).filter((step) => step.path_id === path.id),
  }));
}

// Get available paths based on contact's current tier
export async function getAvailablePaths(actv8ContactId: string): Promise<{
  available: DevelopmentPath[];
  locked: DevelopmentPath[];
  currentTier: number;
}> {
  const contact = await getActv8Contact(actv8ContactId);
  if (!contact) throw new Error("Contact not found");

  const allPaths = await getDevelopmentPaths();
  const currentTier = contact.path_tier || 1;
  
  // Available paths are current tier and one tier ahead (to allow advancement)
  const available = allPaths.filter(p => p.tier <= currentTier + 1);
  const locked = allPaths.filter(p => p.tier > currentTier + 1);

  return { available, locked, currentTier };
}

// Complete current path and advance to next tier
export async function completeCurrentPath(actv8ContactId: string): Promise<Actv8Contact> {
  const contact = await getActv8Contact(actv8ContactId);
  if (!contact) throw new Error("Contact not found");
  if (!contact.path) throw new Error("No path assigned");

  const newHistoryEntry: PathHistoryEntry = {
    path_id: contact.development_path_id,
    path_name: contact.path.name,
    completed_at: new Date().toISOString(),
    steps_completed: contact.completed_steps?.length || 0,
  };

  const updatedHistory = [...(contact.path_history || []), newHistoryEntry];
  const newTier = Math.max(contact.path_tier || 1, contact.path.tier) + 1;

  const { data, error } = await supabase
    .from("rms_actv8_contacts")
    .update({
      path_tier: newTier,
      path_history: updatedHistory as unknown as Json,
    })
    .eq("id", actv8ContactId)
    .select()
    .single();

  if (error) throw error;
  return transformActv8Contact(data);
}

// Skip current path and record the skip
export async function skipCurrentPath(
  actv8ContactId: string,
  reason?: string
): Promise<Actv8Contact> {
  const contact = await getActv8Contact(actv8ContactId);
  if (!contact) throw new Error("Contact not found");
  if (!contact.path) throw new Error("No path assigned");

  // Mark current path instance as SKIPPED (not ended)
  if (contact.current_path_instance_id) {
    await supabase
      .from("rms_actv8_path_instances")
      .update({ 
        status: 'skipped',
        ended_at: new Date().toISOString()
      })
      .eq("id", contact.current_path_instance_id);
  }

  const skipEntry: SkippedPathEntry = {
    path_id: contact.development_path_id,
    path_name: contact.path.name,
    skipped_at: new Date().toISOString(),
    reason: reason || undefined,
    tier_at_skip: contact.path_tier || 1,
  };

  const updatedSkips = [...(contact.skipped_paths || []), skipEntry];
  const newTier = Math.max(contact.path_tier || 1, contact.path.tier) + 1;

  const { data, error } = await supabase
    .from("rms_actv8_contacts")
    .update({
      path_tier: newTier,
      skipped_paths: updatedSkips as unknown as Json,
      development_path_id: null as unknown as string, // Clear path so user must select a new one
      current_step_index: 0,
      completed_steps: [],
      path_started_at: null,
      current_path_instance_id: null, // Clear instance reference
    })
    .eq("id", actv8ContactId)
    .select()
    .single();

  if (error) throw error;
  return transformActv8Contact(data);
}

// Advance to a new path (validates tier eligibility)
export async function advanceToPath(
  actv8ContactId: string,
  newPathId: string
): Promise<Actv8Contact> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const contact = await getActv8Contact(actv8ContactId);
  if (!contact) throw new Error("Contact not found");

  const newPath = await getDevelopmentPath(newPathId);
  if (!newPath) throw new Error("Path not found");

  const currentTier = contact.path_tier || 1;
  
  // Allow selecting paths up to one tier ahead
  if (newPath.tier > currentTier + 1) {
    throw new Error(`Cannot select this path yet. Complete current tier first.`);
  }

  // Mark current path instance as ended if exists
  if (contact.current_path_instance_id) {
    await supabase
      .from("rms_actv8_path_instances")
      .update({ 
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq("id", contact.current_path_instance_id);
  }

  // Create a new path instance for this "run"
  const pathInstanceId = await createPathInstance(user.id, actv8ContactId, newPathId);

  const { data, error } = await supabase
    .from("rms_actv8_contacts")
    .update({
      development_path_id: newPathId,
      current_path_instance_id: pathInstanceId,
      current_step_index: 0,
      completed_steps: [],
      path_started_at: new Date().toISOString(),
    })
    .eq("id", actv8ContactId)
    .select()
    .single();

  if (error) throw error;
  
  // Create the first step instance for the new path with path_instance_id
  if (newPath.steps?.[0] && data) {
    try {
      await (supabase as any)
        .from("rms_actv8_step_instances")
        .insert({
          actv8_contact_id: actv8ContactId,
          step_id: newPath.steps[0].id,
          step_index: 0,
          path_id: newPathId,
          path_instance_id: pathInstanceId,
          status: 'active',
          started_at: new Date().toISOString(),
          user_id: user.id,
        });
    } catch (stepError) {
      console.log("Could not create initial step instance:", stepError);
    }
  }
  
  return transformActv8Contact(data);
}

// =====================================================
// Completed Path Instances (for TierProgressBar)
// =====================================================

export interface CompletedPathInstance {
  id: string;
  path_id: string;
  path_name: string;
  tier: number;
  status: 'ended' | 'skipped';
  started_at: string;
  ended_at?: string;
}

export async function getCompletedPathInstances(actv8ContactId: string): Promise<CompletedPathInstance[]> {
  const { data, error } = await supabase
    .from('rms_actv8_path_instances')
    .select(`
      id,
      path_id,
      status,
      started_at,
      ended_at,
      rms_actv8_paths!inner(name, tier)
    `)
    .eq('actv8_contact_id', actv8ContactId)
    .in('status', ['ended', 'skipped'])
    .order('started_at', { ascending: true });

  if (error) throw error;

  return (data || []).map((d: any) => ({
    id: d.id,
    path_id: d.path_id,
    path_name: d.rms_actv8_paths.name,
    tier: d.rms_actv8_paths.tier,
    status: d.status as 'ended' | 'skipped',
    started_at: d.started_at,
    ended_at: d.ended_at || undefined,
  }));
}

export async function getDevelopmentPath(pathId: string): Promise<DevelopmentPath | null> {
  if (!pathId) return null;
  
  const { data: path, error: pathError } = await supabase
    .from("rms_actv8_paths")
    .select("*")
    .eq("id", pathId)
    .maybeSingle();

  if (pathError) throw pathError;
  if (!path) return null;

  const { data: steps, error: stepsError } = await supabase
    .from("rms_actv8_path_steps")
    .select("*")
    .eq("path_id", pathId)
    .order("step_order");

  if (stepsError) throw stepsError;

  return { ...path, steps: steps || [] };
}

// =====================================================
// Actv8 Contacts
// =====================================================

// Default path ID - uses "build_rapport" as the default starting path
const DEFAULT_PATH_ID = "build_rapport";

export async function activateContact(
  contactId: string,
  pathId?: string,
  options?: {
    connectionStrength?: string;
    relationshipType?: string;
    warmthLevel?: string;
    intentionId?: string;
    intentionNotes?: string;
    targetCompletionDate?: string;
    startingTier?: number; // 1-4, for initial relationship assessment
    skippedTiers?: number[]; // auto-calculated from startingTier
  }
): Promise<Actv8Contact> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Always start with Build Rapport (tier 1) unless explicitly overridden
  const startingPathId = pathId || DEFAULT_PATH_ID;

  // Check if an existing record exists for this user + contact
  const { data: existing } = await supabase
    .from("rms_actv8_contacts")
    .select("id, status, current_step_index, completed_steps, path_tier, path_history, skipped_paths")
    .eq("user_id", user.id)
    .eq("contact_id", contactId)
    .maybeSingle();

  console.log('[Actv8] Activating contact:', contactId, 'existing?', !!existing, 'existing status:', existing?.status);

  let data;
  let error;

  if (existing) {
    // Reactivate existing record - preserve progress, just set status to active
    console.log('[Actv8] Updating existing record:', existing.id, 'to status: active');
    const result = await supabase
      .from("rms_actv8_contacts")
      .update({
        status: "active",
        activated_at: new Date().toISOString(),
        // Only reset path if they had none
        ...(existing.current_step_index === 0 && (!existing.completed_steps || existing.completed_steps.length === 0)
          ? {
              development_path_id: startingPathId,
              path_started_at: new Date().toISOString(),
            }
          : {}),
        // Apply any new options if provided
        ...(options?.connectionStrength ? { connection_strength: options.connectionStrength } : {}),
        ...(options?.relationshipType ? { relationship_type: options.relationshipType } : {}),
        ...(options?.warmthLevel ? { warmth_level: options.warmthLevel } : {}),
        ...(options?.intentionId ? { intention_id: options.intentionId } : {}),
        ...(options?.intentionNotes ? { intention_notes: options.intentionNotes } : {}),
        ...(options?.targetCompletionDate ? { target_completion_date: options.targetCompletionDate } : {}),
      })
      .eq("id", existing.id)
      .select()
      .single();
    
    data = result.data;
    error = result.error;
    console.log('[Actv8] Update result:', data?.status, 'error:', error?.message);
  } else {
    // Insert new record
    console.log('[Actv8] Creating new record for contact:', contactId);
    
    // Calculate starting tier and skipped paths from initial assessment
    const startingTier = options?.startingTier || 1;
    const skippedTiers = options?.skippedTiers || [];
    
    // Build skipped_paths entries for tiers that were skipped during assessment
    const skippedPathsEntries: SkippedPathEntry[] = skippedTiers.map(tier => ({
      path_id: `tier_${tier}_skipped`,
      path_name: `Tier ${tier} (Initial Assessment)`,
      skipped_at: new Date().toISOString(),
      reason: 'already_established',
      tier_at_skip: tier,
    }));
    
    // First insert the contact record without path_instance_id
    const result = await supabase
      .from("rms_actv8_contacts")
      .insert({
        user_id: user.id,
        contact_id: contactId,
        development_path_id: startingPathId,
        current_step_index: 0,
        completed_steps: [],
        connection_strength: options?.connectionStrength || null,
        relationship_type: options?.relationshipType || null,
        warmth_level: options?.warmthLevel || null,
        intention_id: options?.intentionId || null,
        intention_notes: options?.intentionNotes || null,
        target_completion_date: options?.targetCompletionDate || null,
        status: "active",
        activated_at: new Date().toISOString(),
        path_started_at: new Date().toISOString(),
        path_tier: startingTier,
        relationship_level: startingTier, // Store explicit level (1-4) for path logic
        path_history: [],
        skipped_paths: skippedPathsEntries as unknown as Json[],
      })
      .select()
      .single();
    
    data = result.data;
    error = result.error;
    console.log('[Actv8] Insert result:', data?.status, 'id:', data?.id, 'error:', error?.message);
    
    // Now create a path instance for the initial path
    if (data && !error) {
      try {
        const pathInstanceId = await createPathInstance(user.id, data.id, startingPathId);
        
        // Update the contact with the path instance id
        await supabase
          .from("rms_actv8_contacts")
          .update({ current_path_instance_id: pathInstanceId })
          .eq("id", data.id);
        
        data.current_path_instance_id = pathInstanceId;
        
        // Create the first step instance with path_instance_id
        const path = await getDevelopmentPath(startingPathId);
        if (path?.steps?.[0]) {
          await (supabase as any)
            .from("rms_actv8_step_instances")
            .insert({
              actv8_contact_id: data.id,
              step_id: path.steps[0].id,
              step_index: 0,
              path_id: startingPathId,
              path_instance_id: pathInstanceId,
              status: 'active',
              started_at: new Date().toISOString(),
              user_id: user.id,
            });
        }
      } catch (instanceError) {
        console.log("Could not create path instance:", instanceError);
      }
    }
  }

  if (error) throw error;
  
  console.log('[Actv8] Final activation status:', data?.status, 'id:', data?.id);
  
  return transformActv8Contact(data);
}

export async function getActiveContacts(): Promise<Actv8Contact[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: actv8Contacts, error: actv8Error } = await supabase
    .from("rms_actv8_contacts")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("activated_at", { ascending: false });

  if (actv8Error) throw actv8Error;
  if (!actv8Contacts || actv8Contacts.length === 0) return [];

  // Fetch associated contacts
  const contactIds = actv8Contacts.map((ac) => ac.contact_id);
  const { data: contacts, error: contactsError } = await supabase
    .from("rms_contacts")
    .select("id, name, email, phone, organization, role, tags")
    .in("id", contactIds);

  if (contactsError) throw contactsError;

  // Fetch paths
  const pathIds = [...new Set(actv8Contacts.map((ac) => ac.development_path_id))];
  const { data: paths, error: pathsError } = await supabase
    .from("rms_actv8_paths")
    .select("*")
    .in("id", pathIds);

  if (pathsError) throw pathsError;

  // Fetch affiliations for all contacts to get affiliated user IDs
  const { data: affiliations, error: affiliationsError } = await supabase
    .from("rms_contact_affiliations")
    .select("contact_id, affiliated_user_id")
    .in("contact_id", contactIds)
    .eq("affiliation_type", "user")
    .not("affiliated_user_id", "is", null);

  if (affiliationsError) throw affiliationsError;

  // Create a map of contact_id -> affiliated_user_id
  const affiliationMap = new Map<string, string>();
  affiliations?.forEach((aff) => {
    if (aff.affiliated_user_id) {
      affiliationMap.set(aff.contact_id, aff.affiliated_user_id);
    }
  });

  // Combine data with transformation
  return actv8Contacts.map((ac) => transformActv8Contact({
    ...ac,
    contact: contacts?.find((c) => c.id === ac.contact_id),
    path: paths?.find((p) => p.id === ac.development_path_id),
    affiliatedUserId: affiliationMap.get(ac.contact_id) || null,
  }));
}

export async function getActv8Contact(actv8ContactId: string): Promise<Actv8Contact | null> {
  const { data: actv8Contact, error: actv8Error } = await supabase
    .from("rms_actv8_contacts")
    .select("*")
    .eq("id", actv8ContactId)
    .single();

  if (actv8Error) throw actv8Error;
  if (!actv8Contact) return null;

  // Fetch contact details
  const { data: contact, error: contactError } = await supabase
    .from("rms_contacts")
    .select("id, name, email, phone, organization, role, tags")
    .eq("id", actv8Contact.contact_id)
    .single();

  if (contactError && contactError.code !== "PGRST116") throw contactError;

  // Fetch affiliated user ID from contact affiliations
  const { data: affiliation } = await supabase
    .from("rms_contact_affiliations")
    .select("affiliated_user_id")
    .eq("contact_id", actv8Contact.contact_id)
    .eq("affiliation_type", "user")
    .not("affiliated_user_id", "is", null)
    .maybeSingle();

  // Fetch path with steps
  const path = await getDevelopmentPath(actv8Contact.development_path_id);

  return transformActv8Contact({
    ...actv8Contact,
    contact: contact || undefined,
    path: path || undefined,
    affiliatedUserId: affiliation?.affiliated_user_id || null,
  });
}

export async function getActv8ContactByContactId(contactId: string): Promise<Actv8Contact | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: actv8Contact, error } = await supabase
    .from("rms_actv8_contacts")
    .select("*")
    .eq("user_id", user.id)
    .eq("contact_id", contactId)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  if (!actv8Contact) return null;

  return getActv8Contact(actv8Contact.id);
}

// Get Actv8 contact status regardless of active/inactive status
export interface Actv8ContactStatus {
  exists: boolean;
  isActive: boolean;
  actv8Contact: Actv8Contact | null;
}

export async function getActv8ContactStatus(contactId: string): Promise<Actv8ContactStatus> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: actv8Contact, error } = await supabase
    .from("rms_actv8_contacts")
    .select("*")
    .eq("user_id", user.id)
    .eq("contact_id", contactId)
    .maybeSingle(); // No status filter - get any record

  if (error) throw error;
  if (!actv8Contact) return { exists: false, isActive: false, actv8Contact: null };

  const fullContact = await getActv8Contact(actv8Contact.id);
  return { 
    exists: true, 
    isActive: actv8Contact.status === 'active', 
    actv8Contact: fullContact 
  };
}

export async function updateContactProgress(
  actv8ContactId: string,
  stepIndex: number,
  completedSteps: string[]
): Promise<Actv8Contact> {
  const { data, error } = await supabase
    .from("rms_actv8_contacts")
    .update({
      current_step_index: stepIndex,
      completed_steps: completedSteps,
      last_touchpoint_at: new Date().toISOString(),
    })
    .eq("id", actv8ContactId)
    .select()
    .single();

  if (error) throw error;
  return transformActv8Contact(data);
}

export async function updateActv8Contact(
  actv8ContactId: string,
  updates: Partial<{
    connection_strength: string;
    relationship_type: string;
    warmth_level: string;
    intention_id: string;
    intention_notes: string;
    status: string;
    target_completion_date: string;
  }>
): Promise<Actv8Contact> {
  const { data, error } = await supabase
    .from("rms_actv8_contacts")
    .update(updates)
    .eq("id", actv8ContactId)
    .select()
    .single();

  if (error) throw error;
  return transformActv8Contact(data);
}

export async function deactivateContact(actv8ContactId: string): Promise<void> {
  const { error } = await supabase
    .from("rms_actv8_contacts")
    .update({ status: "inactive" })
    .eq("id", actv8ContactId);

  if (error) throw error;
}

// =====================================================
// Strategies
// =====================================================

export async function createStrategy(
  actv8ContactId: string,
  intentionId: string,
  intentionNotes?: string
): Promise<Actv8Strategy> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("rms_actv8_strategies")
    .insert({
      user_id: user.id,
      actv8_contact_id: actv8ContactId,
      intention_id: intentionId,
      intention_notes: intentionNotes || null,
      status: "active",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getStrategy(actv8ContactId: string): Promise<Actv8Strategy | null> {
  const { data: strategy, error: strategyError } = await supabase
    .from("rms_actv8_strategies")
    .select("*")
    .eq("actv8_contact_id", actv8ContactId)
    .maybeSingle();

  if (strategyError) throw strategyError;
  if (!strategy) return null;

  const { data: actions, error: actionsError } = await supabase
    .from("rms_actv8_strategy_actions")
    .select("*")
    .eq("strategy_id", strategy.id)
    .order("scheduled_date", { ascending: true });

  if (actionsError) throw actionsError;

  return { ...strategy, actions: actions || [] };
}

export async function updateStrategy(
  strategyId: string,
  updates: Partial<{
    intention_id: string;
    intention_notes: string;
    status: string;
  }>
): Promise<Actv8Strategy> {
  const { data, error } = await supabase
    .from("rms_actv8_strategies")
    .update(updates)
    .eq("id", strategyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// =====================================================
// Strategy Actions
// =====================================================

export async function addStrategyAction(
  strategyId: string,
  action: {
    action_type: string;
    channel: string;
    tone: string;
    scheduled_date?: string;
    notes?: string;
  }
): Promise<Actv8StrategyAction> {
  const { data, error } = await supabase
    .from("rms_actv8_strategy_actions")
    .insert({
      strategy_id: strategyId,
      action_type: action.action_type,
      channel: action.channel,
      tone: action.tone,
      scheduled_date: action.scheduled_date || null,
      notes: action.notes || null,
      status: "planned",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateStrategyAction(
  actionId: string,
  updates: Partial<{
    action_type: string;
    channel: string;
    tone: string;
    scheduled_date: string;
    notes: string;
    status: string;
    completed_at: string;
  }>
): Promise<Actv8StrategyAction> {
  const { data, error } = await supabase
    .from("rms_actv8_strategy_actions")
    .update(updates)
    .eq("id", actionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeStrategyAction(actionId: string): Promise<Actv8StrategyAction> {
  return updateStrategyAction(actionId, {
    status: "completed",
    completed_at: new Date().toISOString(),
  });
}

export async function deleteStrategyAction(actionId: string): Promise<void> {
  const { error } = await supabase
    .from("rms_actv8_strategy_actions")
    .delete()
    .eq("id", actionId);

  if (error) throw error;
}

// =====================================================
// Interactions
// =====================================================

export async function logInteraction(
  actv8ContactId: string,
  interaction: {
    interaction_date: string;
    location?: string;
    topics?: string;
    warmth?: string;
    strengthened?: boolean;
    follow_up?: string;
  }
): Promise<Actv8Interaction> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("rms_actv8_interactions")
    .insert({
      user_id: user.id,
      actv8_contact_id: actv8ContactId,
      interaction_date: interaction.interaction_date,
      location: interaction.location || null,
      topics: interaction.topics || null,
      warmth: interaction.warmth || "neutral",
      strengthened: interaction.strengthened || false,
      follow_up: interaction.follow_up || null,
    })
    .select()
    .single();

  if (error) throw error;

  // Update last touchpoint
  await supabase
    .from("rms_actv8_contacts")
    .update({ last_touchpoint_at: interaction.interaction_date })
    .eq("id", actv8ContactId);

  return data;
}

export async function getInteractions(actv8ContactId: string): Promise<Actv8Interaction[]> {
  const { data, error } = await supabase
    .from("rms_actv8_interactions")
    .select("*")
    .eq("actv8_contact_id", actv8ContactId)
    .order("interaction_date", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateInteraction(
  interactionId: string,
  updates: Partial<{
    interaction_date: string;
    location: string;
    topics: string;
    warmth: string;
    strengthened: boolean;
    follow_up: string;
  }>
): Promise<Actv8Interaction> {
  const { data, error } = await supabase
    .from("rms_actv8_interactions")
    .update(updates)
    .eq("id", interactionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteInteraction(interactionId: string): Promise<void> {
  const { error } = await supabase
    .from("rms_actv8_interactions")
    .delete()
    .eq("id", interactionId);

  if (error) throw error;
}

// =====================================================
// Reference Data (from mock data for compatibility)
// =====================================================

export const intentionTemplates = [
  { id: "orbit", label: "Keep in Orbit", description: "Stay connected without deepening" },
  { id: "friendship", label: "Build Friendship", description: "Develop a personal connection" },
  { id: "professional", label: "Professional Growth", description: "Career or business advancement" },
  { id: "collaboration", label: "Collaboration", description: "Work together on projects" },
  { id: "mentorship", label: "Seek Mentorship", description: "Learn from their experience" },
  { id: "support", label: "Offer Support", description: "Help them with their goals" },
];

export const actionTemplates = [
  { id: "soft_checkin", label: "Soft Check-in", channel: "dm", tone: "friendly" },
  { id: "deep_checkin", label: "Deep Check-in", channel: "dm", tone: "caring" },
  { id: "send_resource", label: "Send Resource", channel: "email", tone: "helpful" },
  { id: "coffee", label: "Coffee Meeting", channel: "in_person", tone: "friendly" },
  { id: "schedule_call", label: "Schedule Call", channel: "video", tone: "professional" },
  { id: "invite_event", label: "Invite to Event", channel: "email", tone: "enthusiastic" },
  { id: "offer_help", label: "Offer Help", channel: "email", tone: "supportive" },
  { id: "thank_you", label: "Thank You Note", channel: "email", tone: "grateful" },
  { id: "reconnect", label: "Reconnect Message", channel: "dm", tone: "warm" },
];

export const channels = [
  { id: "dm", label: "Direct Message" },
  { id: "email", label: "Email" },
  { id: "in_person", label: "In Person" },
  { id: "video", label: "Video Call" },
  { id: "phone", label: "Phone Call" },
  { id: "linkedin", label: "LinkedIn" },
];

export const tones = [
  { id: "friendly", label: "Friendly" },
  { id: "professional", label: "Professional" },
  { id: "caring", label: "Caring" },
  { id: "enthusiastic", label: "Enthusiastic" },
];

export const warmthLevels = [
  { id: "cold", label: "Cold", color: "#3b82f6" },
  { id: "neutral", label: "Neutral", color: "#6b7280" },
  { id: "warm", label: "Warm", color: "#f59e0b" },
  { id: "enthusiastic", label: "Enthusiastic", color: "#ef4444" },
];

export const connectionStrengths = [
  { id: "thin", label: "Thin", description: "Just met or barely know" },
  { id: "growing", label: "Growing", description: "Building connection" },
  { id: "solid", label: "Solid", description: "Reliable relationship" },
  { id: "thick", label: "Thick", description: "Deep, trusted bond" },
];

export const relationshipTypes = [
  { id: "professional", label: "Professional" },
  { id: "personal", label: "Personal" },
  { id: "mentor", label: "Mentor" },
  { id: "mentee", label: "Mentee" },
  { id: "collaborator", label: "Collaborator" },
  { id: "client", label: "Client" },
];

// =====================================================
// Step Instances - Unique ID tracking for each step
// =====================================================

export interface StepInstance {
  id: string;
  actv8_contact_id: string;
  step_id: string;
  step_index: number;
  path_id: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  started_at: string | null;
  completed_at: string | null;
  outreach_id: string | null;
  days_to_complete: number | null;
  interaction_outcome: string | null;
  rapport_progress: string | null;
  notes: string | null;
  metadata: Record<string, any>;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export async function getStepInstances(actv8ContactId: string): Promise<StepInstance[]> {
  const { data, error } = await (supabase as any)
    .from("rms_actv8_step_instances")
    .select("*")
    .eq("actv8_contact_id", actv8ContactId)
    .order("step_index");

  if (error) throw error;
  return (data || []) as StepInstance[];
}

export async function createStepInstance(
  actv8ContactId: string,
  stepId: string,
  stepIndex: number,
  pathId: string,
  status: 'pending' | 'active' = 'active',
  pathInstanceId?: string | null
): Promise<StepInstance> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // If no pathInstanceId provided, get it from the actv8 contact
  let instanceId = pathInstanceId;
  if (!instanceId) {
    const { data: actv8Contact } = await supabase
      .from("rms_actv8_contacts")
      .select("current_path_instance_id")
      .eq("id", actv8ContactId)
      .single();
    instanceId = actv8Contact?.current_path_instance_id;
  }

  const { data, error } = await (supabase as any)
    .from("rms_actv8_step_instances")
    .insert({
      actv8_contact_id: actv8ContactId,
      step_id: stepId,
      step_index: stepIndex,
      path_id: pathId,
      path_instance_id: instanceId || null,
      status,
      started_at: status === 'active' ? new Date().toISOString() : null,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as StepInstance;
}

export async function updateStepInstance(
  instanceId: string,
  updates: Partial<StepInstance>
): Promise<StepInstance> {
  const { data, error } = await (supabase as any)
    .from("rms_actv8_step_instances")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", instanceId)
    .select()
    .single();

  if (error) throw error;
  return data as StepInstance;
}

export async function completeStepInstance(
  actv8ContactId: string,
  stepIndex: number,
  outreachId: string,
  outcome?: { interaction_outcome?: string; rapport_progress?: string },
  pathInstanceId?: string | null
): Promise<StepInstance | null> {
  // Find the step instance for this step - filter by path_instance_id if provided for accuracy
  let query = (supabase as any)
    .from("rms_actv8_step_instances")
    .select("*")
    .eq("actv8_contact_id", actv8ContactId)
    .eq("step_index", stepIndex);
  
  // If pathInstanceId provided, filter by it for proper isolation between runs
  if (pathInstanceId) {
    query = query.eq("path_instance_id", pathInstanceId);
  }
  
  const { data: instances, error: findError } = await query.limit(1);

  if (findError) throw findError;
  
  const instance = instances?.[0] as StepInstance | undefined;
  if (!instance) return null;

  // Calculate days to complete
  const startedAt = instance.started_at ? new Date(instance.started_at) : new Date(instance.created_at);
  const completedAt = new Date();
  const daysToComplete = Math.ceil((completedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24));

  const { data, error } = await (supabase as any)
    .from("rms_actv8_step_instances")
    .update({
      status: 'completed',
      completed_at: completedAt.toISOString(),
      outreach_id: outreachId,
      days_to_complete: daysToComplete,
      interaction_outcome: outcome?.interaction_outcome || null,
      rapport_progress: outcome?.rapport_progress || null,
      updated_at: completedAt.toISOString(),
    })
    .eq("id", instance.id)
    .select()
    .single();

  if (error) throw error;
  return data as StepInstance;
}

export async function getOrCreateFirstStepInstance(
  actv8ContactId: string,
  pathId: string,
  stepId: string
): Promise<StepInstance> {
  // Check if first step instance already exists
  const { data: existing } = await (supabase as any)
    .from("rms_actv8_step_instances")
    .select("*")
    .eq("actv8_contact_id", actv8ContactId)
    .eq("step_index", 0)
    .eq("path_id", pathId)
    .maybeSingle();

  if (existing) return existing as StepInstance;
  
  return createStepInstance(actv8ContactId, stepId, 0, pathId, 'active');
}
