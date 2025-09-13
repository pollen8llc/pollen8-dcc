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
      .from('nmn8_nominations')
      .select(`
        *,
        contact:rms_contacts (
          id,
          name,
          email,
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
      .from('nmn8_nominations')
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

    // Create or update nmn8_profile entry
    try {
      await supabase
        .from('nmn8_profiles')
        .upsert({
          contact_id: contactId,
          organizer_id: organizerId,
          classification: 'Volunteer', // Default classification
          community_engagement: 0,
          events_attended: 0,
          interests: [],
          last_active: new Date().toISOString(),
        }, {
          onConflict: 'contact_id,organizer_id'
        });
    } catch (profileError) {
      console.warn('Warning: Failed to create/update nmn8_profile:', profileError);
    }

    // Try to link invited_by for existing users
    try {
      await supabase.functions.invoke('link-invited-by', {
        body: { contactId, organizerId }
      });
    } catch (linkError) {
      console.warn('Warning: Failed to link invited_by:', linkError);
    }

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
      .from('nmn8_nominations')
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
      .from('nmn8_nominations')
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
      .from('nmn8_nominations')
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
      .from('nmn8_nominations')
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
      .from('nmn8_nominations')
      .select(`
        *,
        contact:rms_contacts (
          id,
          name,
          email,
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

// Settings management for groups and categories
export const settingsService = {
  // Get all settings for current user
  async getSettings(settingType?: 'group' | 'category'): Promise<GroupConfig[]> {
    try {
      let query = supabase
        .from('nmn8_settings')
        .select('*')
        .eq('organizer_id', (await supabase.auth.getUser()).data.user?.id!)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (settingType) {
        query = query.eq('setting_type', settingType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching settings:', error);
        return [];
      }

      return data.map(setting => ({
        id: setting.id, // Use actual database ID
        name: setting.name,
        color: setting.color,
        description: setting.description
      }));
    } catch (error) {
      console.error('Error in getSettings:', error);
      return [];
    }
  },

  // Get groups specifically
  async getGroups(): Promise<GroupConfig[]> {
    return this.getSettings('group');
  },

  // Create a new setting
  async createSetting(settingType: 'group' | 'category', name: string, description?: string, color?: string): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('nmn8_settings')
        .insert({
          organizer_id: userId,
          setting_type: settingType,
          name,
          description,
          color: color || '#3B82F6'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating setting:', error);
      throw error;
    }
  },

  // Update a setting
  async updateSetting(settingId: string, updates: Partial<{ name: string; description: string; color: string }>): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('nmn8_settings')
        .update(updates)
        .eq('organizer_id', userId)
        .eq('id', settingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  },

  // Delete a setting
  async deleteSetting(settingId: string): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('nmn8_settings')
        .update({ is_active: false })
        .eq('organizer_id', userId)
        .eq('id', settingId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting setting:', error);
      throw error;
    }
  }
};

// Default groups configuration (fallback)
export const defaultGroups: GroupConfig[] = [
  {
    id: 'ambassador',
    name: 'Ambassador',
    color: '#10B981',
    description: 'Community ambassadors and leaders'
  },
  {
    id: 'volunteer', 
    name: 'Volunteer',
    color: '#3B82F6',
    description: 'Active volunteers helping with events'
  },
  {
    id: 'supporter',
    name: 'Supporter', 
    color: '#F59E0B',
    description: 'Supporters and advocates'
  },
  {
    id: 'moderator',
    name: 'Moderator',
    color: '#8B5CF6', 
    description: 'Content and community moderators'
  }
];
