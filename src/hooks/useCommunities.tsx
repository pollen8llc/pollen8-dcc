
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Community {
  id: string;
  name: string;
  description: string;
  type?: string;
  location?: string;
  is_public: boolean;
  website?: string;
  newsletter_url?: string;
  vision?: string;
  community_values?: string;
  community_structure?: string;
  personal_background?: string;
  format?: string;
  community_size?: string;
  event_frequency?: string;
  target_audience?: string[];
  tags?: string[];
  logo_url?: string;
  role_title?: string;
  member_count?: string;
  founder_name?: string;
  community_type?: string;
  start_date?: string;
  social_media?: any;
  communication_platforms?: any;
  owner_id?: string;
  created_at: string;
  updated_at: string;
}

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const hasUserCommunities = userCommunities.length > 0;

  const refreshUserCommunities = async () => {
    if (!currentUser?.id) return;
    try {
      setLoading(true);
      const data = await getManagedCommunities(currentUser.id);
      setUserCommunities((data as any) || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      refreshUserCommunities();
    }
  }, [currentUser?.id]);

  const getAllCommunities = useCallback(async (page = 1, limit = 20) => {
    try {
      const { data, error, count } = await supabase
        .from('communities')
        .select('*', { count: 'exact' })
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;
      
      return { data: data || [], count: count || 0 };
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load communities.',
        variant: 'destructive',
      });
      return { data: [], count: 0 };
    }
  }, [toast]);

  const getCommunityById = useCallback(async (id: string): Promise<Community | null> => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching community:', error);
        throw error;
      }

      return data as any as Community;
    } catch (error) {
      console.error('Error fetching community by ID:', error);
      toast({
        title: 'Error',
        description: 'Failed to load community.',
        variant: 'destructive',
      });
      return null;
    }
  }, [toast]);

  const getManagedCommunities = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching managed communities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your communities.',
        variant: 'destructive',
      });
      return [];
    }
  };

  const searchCommunities = useCallback(async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('is_public', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return { data: data || [], count: data?.length || 0 };
    } catch (error) {
      console.error('Error searching communities:', error);
      toast({
        title: 'Error',
        description: 'Failed to search communities.',
        variant: 'destructive',
      });
      return { data: [], count: 0 };
    }
  }, [toast]);

  const createCommunity = async (communityData: any) => {
    try {
      // Use the RPC function for consistent community creation
      const { data: communityId, error } = await supabase.rpc('create_community', {
        p_name: communityData.name,
        p_description: communityData.description,
        p_type: communityData.type || 'tech',
        p_location: communityData.location || 'Remote',
        p_format: communityData.format || 'hybrid',
        p_website: communityData.website || null,
        p_is_public: communityData.is_public !== false,
        p_tags: communityData.tags || [],
        p_target_audience: communityData.target_audience || [],
        p_social_media: communityData.social_media || {},
        p_communication_platforms: communityData.communication_platforms || {},
      });

      if (error) throw error;

      // Fetch the created community
      const { data: community } = await supabase
        .from('communities')
        .select('*')
        .eq('id', communityId)
        .single();

      toast({
        title: 'Success',
        description: 'Community created successfully.',
      });

      // Refresh user communities after creation
      await refreshUserCommunities();

      return community || { id: communityId };
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: 'Error',
        description: 'Failed to create community.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateCommunity = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Community updated successfully.',
      });

      return data;
    } catch (error) {
      console.error('Error updating community:', error);
      toast({
        title: 'Error',
        description: 'Failed to update community.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteCommunity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Community deleted successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting community:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete community.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    communities,
    userCommunities,
    hasUserCommunities,
    refreshUserCommunities,
    loading,
    getAllCommunities,
    getCommunityById,
    getManagedCommunities,
    searchCommunities,
    createCommunity,
    updateCommunity,
    deleteCommunity,
  };
};
