import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Community {
  id: string;
  name: string;
  description: string;
  type?: string;
  community_type?: string;
  location?: string;
  owner_id?: string;
  target_audience?: string[];
  social_media?: any;
  website?: string;
  newsletter_url?: string;
  communication_platforms?: any;
  community_size?: string;
  format?: string;
  event_frequency?: string;
  start_date?: string;
  vision?: string;
  community_structure?: string;
  community_values?: string;
  personal_background?: string;
  role_title?: string;
  founder_name?: string;
  logo_url?: string;
  is_public: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export const useCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (err) {
      console.error('Error fetching communities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCommunities = async () => {
    if (!currentUser?.id) return;

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('owner_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserCommunities(data || []);
    } catch (err) {
      console.error('Error fetching user communities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user communities');
    }
  };

  const getCommunityById = async (id: string): Promise<Community | null> => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching community:', err);
      return null;
    }
  };

  const createCommunity = async (communityData: Partial<Community>) => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    // Ensure required fields are present
    if (!communityData.name) throw new Error('Community name is required');
    if (!communityData.description) throw new Error('Community description is required');

    try {
      const { data, error } = await supabase
        .from('communities')
        .insert({
          ...communityData,
          owner_id: currentUser.id,
          name: communityData.name, // Ensure name is included
          description: communityData.description // Ensure description is included
        })
        .select()
        .single();

      if (error) throw error;
      
      // Refresh user communities
      await fetchUserCommunities();
      
      return data;
    } catch (err) {
      console.error('Error creating community:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserCommunities();
    }
  }, [currentUser?.id]);

  return {
    communities,
    userCommunities,
    loading,
    error,
    refreshCommunities: fetchCommunities,
    refreshUserCommunities: fetchUserCommunities,
    getCommunityById,
    createCommunity,
    hasUserCommunities: userCommunities.length > 0
  };
};