import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveContacts, deactivateContact, getActv8ContactByContactId } from "@/services/actv8Service";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

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

export interface Actv8ContactDisplay {
  id: string;
  contactId: string;
  name: string;
  industry: string;
  role: string;
  company: string;
  location: string;
  relationshipType: string;
  connectionStrength: 'spark' | 'ember' | 'flame' | 'star';
  lastInteraction: string;
  developmentPathId?: string;
  developmentPathName?: string;
  currentStepIndex: number;
  completedSteps: string[];
  pathStartedAt?: string;
  totalSteps?: number;
  status?: string;
  affiliatedUserId?: string | null;
  pathTier: number;
  pathHistory: PathHistoryEntry[];
  skippedPaths: SkippedPathEntry[];
}

export function useActv8Contacts() {
  const { currentUser } = useUser();
  const userId = currentUser?.id;

  return useQuery({
    queryKey: ['actv8-contacts', userId],
    queryFn: async () => {
      const contacts = await getActiveContacts();
      const strengthMap: Record<string, 'spark' | 'ember' | 'flame' | 'star'> = {
        thin: 'spark', growing: 'ember', solid: 'flame', thick: 'star',
        spark: 'spark', ember: 'ember', flame: 'flame', star: 'star'
      };
      return contacts.map((ac): Actv8ContactDisplay => ({
        id: ac.id,
        contactId: ac.contact_id,
        name: ac.contact?.name || 'Unknown',
        industry: ac.contact?.tags?.[0] || 'General',
        role: ac.contact?.role || 'Professional',
        company: ac.contact?.organization || 'Independent',
        location: 'Not specified',
        relationshipType: ac.relationship_type || 'collaborator',
        connectionStrength: strengthMap[ac.connection_strength || 'thin'] || 'spark',
        lastInteraction: ac.last_touchpoint_at || ac.activated_at || new Date().toISOString(),
        developmentPathId: ac.development_path_id,
        developmentPathName: ac.path?.name,
        currentStepIndex: ac.current_step_index || 0,
        completedSteps: ac.completed_steps || [],
        pathStartedAt: ac.path_started_at || undefined,
        totalSteps: ac.path?.steps?.length,
        status: ac.status,
        affiliatedUserId: ac.affiliatedUserId || null,
        pathTier: ac.path_tier || 1,
        pathHistory: ac.path_history || [],
        skippedPaths: ac.skipped_paths || [],
      }));
    },
    enabled: !!userId,
  });
}

export function useActv8Status(contactId: string | undefined) {
  const { currentUser } = useUser();
  const userId = currentUser?.id;
  
  return useQuery({
    queryKey: ['actv8-status', userId, contactId],
    queryFn: () => contactId ? getActv8ContactByContactId(contactId) : null,
    enabled: !!userId && !!contactId,
  });
}

export function useDeactivateContact() {
  const queryClient = useQueryClient();
  
  const deactivate = async (actv8ContactId: string, contactName: string) => {
    try {
      await deactivateContact(actv8ContactId);
      queryClient.invalidateQueries({ queryKey: ['actv8-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['actv8-status'] });
      toast.success(`${contactName} removed from Actv8`);
      return true;
    } catch (error) {
      toast.error('Failed to remove contact from Actv8');
      return false;
    }
  };
  
  return { deactivate };
}
