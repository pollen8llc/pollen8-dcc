import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface NominationContact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  organization?: string;
}

export interface Nomination {
  id: string;
  organizer_id: string;
  contact_id: string;
  groups: Record<string, boolean> | any; // Allow for JSON type from database
  notes?: string;
  created_at: string;
  updated_at: string;
  contact?: NominationContact;
}

export interface GroupConfig {
  id: string;
  name: string;
  color: string;
  maxMembers?: number;
  description?: string;
}

// Utility function to safely parse groups data
const parseGroupsData = (groups: any): Record<string, boolean> => {
  if (!groups || typeof groups !== 'object') {
    return {};
  }
  
  // If it's already a proper object, return it
  if (typeof groups === 'object' && !Array.isArray(groups)) {
    return groups as Record<string, boolean>;
  }
  
  // If it's a string, try to parse it as JSON
  if (typeof groups === 'string') {
    try {
      const parsed = JSON.parse(groups);
      return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  
  return {};
};

// Utility function to validate nomination data structure
export const validateNominationData = (nomination: any): boolean => {
  return (
    nomination &&
    typeof nomination === 'object' &&
    typeof nomination.id === 'string' &&
    typeof nomination.organizer_id === 'string' &&
    typeof nomination.contact_id === 'string' &&
    nomination.groups &&
    typeof nomination.groups === 'object'
  );
};

export const nmn8Service = {
  // Get all nominations for the current organizer
  async getNominations(organizerId: string): Promise<Nomination[]> {
    const { data, error } = await (supabase as any)
      .from('nmn8')
      .select(`
        *,
        contact:rms_contacts (
          id,
          name,
          email,
          avatar,
          organization
        )
      `)
      .eq('organizer_id', organizerId);

    if (error) {
      console.error('Failed to fetch nominations:', error);
      toast({
        title: "Error",
        description: "Failed to load nominations",
        variant: "destructive",
      });
      throw error;
    }

    // Parse groups data for each nomination to ensure proper typing
    const parsedData = (data || [])
      .filter(validateNominationData) // Filter out invalid nominations
      .map(nomination => ({
        ...nomination,
        groups: parseGroupsData(nomination.groups)
      }));

    return parsedData;
  },

  // Nominate a contact to specific groups
  async nominateContact(
    organizerId: string, 
    contactId: string, 
    groups: Record<string, boolean>,
    notes?: string
  ): Promise<Nomination> {
    const { data, error } = await (supabase as any)
      .from('nmn8')
      .upsert({
        organizer_id: organizerId,
        contact_id: contactId,
        groups,
        notes,
      })
      .select(`
        *,
        contact:rms_contacts (
          id,
          name,
          email,
          avatar,
          organization
        )
      `)
      .single();

    if (error) {
      console.error('Failed to nominate contact:', error);
      toast({
        title: "Error",
        description: "Failed to nominate contact",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Contact nominated successfully",
    });

    // Parse groups data to ensure proper typing
    return {
      ...data,
      groups: parseGroupsData(data.groups)
    };
  },

  // Update nomination groups
  async updateNomination(
    nominationId: string,
    updates: Partial<Pick<Nomination, 'groups' | 'notes'>>
  ): Promise<void> {
    const { error } = await (supabase as any)
      .from('nmn8')
      .update(updates)
      .eq('id', nominationId);

    if (error) {
      console.error('Failed to update nomination:', error);
      toast({
        title: "Error",
        description: "Failed to update nomination",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Nomination updated successfully",
    });
  },

  // Remove a contact from a specific group
  async removeFromGroup(nominationId: string, groupId: string): Promise<void> {
    // First get the current nomination
    const { data: nomination, error: fetchError } = await (supabase as any)
      .from('nmn8')
      .select('groups')
      .eq('id', nominationId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch nomination:', fetchError);
      throw fetchError;
    }

    const parsedGroups = parseGroupsData(nomination.groups);
    const updatedGroups = { ...parsedGroups };
    updatedGroups[groupId] = false;

    // Check if any groups are still true
    const hasActiveGroups = Object.values(updatedGroups).some(Boolean);

    if (!hasActiveGroups) {
      // If no groups are active, delete the nomination
      await this.deleteNomination(nominationId);
    } else {
      // Otherwise, just update the groups
      await this.updateNomination(nominationId, { groups: updatedGroups });
    }
  },

  // Delete a nomination entirely
  async deleteNomination(nominationId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('nmn8')
      .delete()
      .eq('id', nominationId);

    if (error) {
      console.error('Failed to delete nomination:', error);
      toast({
        title: "Error",
        description: "Failed to remove nomination",
        variant: "destructive",
      });
      throw error;
    }

    toast({
      title: "Success",
      description: "Contact removed from nominations",
    });
  },

  // Check if a contact is already nominated
  async isContactNominated(organizerId: string, contactId: string): Promise<boolean> {
    const { data, error } = await (supabase as any)
      .from('nmn8')
      .select('id')
      .eq('organizer_id', organizerId)
      .eq('contact_id', contactId)
      .maybeSingle();

    if (error) {
      console.error('Failed to check nomination status:', error);
      return false;
    }

    return !!data;
  },

  // Get nomination for a specific contact
  async getNominationForContact(organizerId: string, contactId: string): Promise<Nomination | null> {
    const { data, error } = await (supabase as any)
      .from('nmn8')
      .select(`
        *,
        contact:rms_contacts (
          id,
          name,
          email,
          avatar,
          organization
        )
      `)
      .eq('organizer_id', organizerId)
      .eq('contact_id', contactId)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch nomination:', error);
      return null;
    }

    // Parse groups data to ensure proper typing
    return data ? {
      ...data,
      groups: parseGroupsData(data.groups)
    } : null;
  }
};

// Default groups configuration
export const defaultGroups: GroupConfig[] = [
  {
    id: 'ambassadors',
    name: 'Ambassadors',
    color: 'bg-blue-500',
    description: 'Community ambassadors and advocates'
  },
  {
    id: 'moderators',
    name: 'Moderators',
    color: 'bg-green-500',
    description: 'Community moderation team'
  },
  {
    id: 'evangelists',
    name: 'Evangelists',
    color: 'bg-purple-500',
    description: 'Technical evangelists and thought leaders'
  },
  {
    id: 'volunteers',
    name: 'Volunteers',
    color: 'bg-orange-500',
    description: 'Event and community volunteers'
  },
  {
    id: 'advisors',
    name: 'Advisors',
    color: 'bg-indigo-500',
    description: 'Strategic advisors and mentors'
  },
  {
    id: 'supporters',
    name: 'Supporters',
    color: 'bg-pink-500',
    description: 'General supporters and enthusiasts'
  }
];
