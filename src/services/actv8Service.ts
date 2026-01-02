import { supabase } from "@/integrations/supabase/client";

// Types
export interface DevelopmentPath {
  id: string;
  name: string;
  description: string;
  target_strength: string;
  is_system: boolean;
  steps?: DevelopmentPathStep[];
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
    .order("name");

  if (pathsError) throw pathsError;

  const { data: steps, error: stepsError } = await supabase
    .from("rms_actv8_path_steps")
    .select("*")
    .order("step_order");

  if (stepsError) throw stepsError;

  return (paths || []).map((path) => ({
    ...path,
    steps: (steps || []).filter((step) => step.path_id === path.id),
  }));
}

export async function getDevelopmentPath(pathId: string): Promise<DevelopmentPath | null> {
  const { data: path, error: pathError } = await supabase
    .from("rms_actv8_paths")
    .select("*")
    .eq("id", pathId)
    .single();

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
  }
): Promise<Actv8Contact> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("rms_actv8_contacts")
    .insert({
      user_id: user.id,
      contact_id: contactId,
      development_path_id: pathId || DEFAULT_PATH_ID,
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
    })
    .select()
    .single();

  if (error) throw error;
  return data;
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

  // Combine data
  return actv8Contacts.map((ac) => ({
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

  return {
    ...actv8Contact,
    contact: contact || undefined,
    path: path || undefined,
    affiliatedUserId: affiliation?.affiliated_user_id || null,
  };
}

export async function getActv8ContactByContactId(contactId: string): Promise<Actv8Contact | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: actv8Contact, error } = await supabase
    .from("rms_actv8_contacts")
    .select("*")
    .eq("user_id", user.id)
    .eq("contact_id", contactId)
    .maybeSingle();

  if (error) throw error;
  if (!actv8Contact) return null;

  return getActv8Contact(actv8Contact.id);
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
  return data;
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
  return data;
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
