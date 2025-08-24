
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
      console.log('Fetching all public communities');
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('All public communities fetched:', data);
      setCommunities(data || []);
    } catch (err) {
      console.error('Error fetching communities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCommunities = async () => {
    if (!currentUser?.id) {
      console.log('No current user ID, skipping user communities fetch');
      setUserCommunities([]);
      return;
    }

    try {
      console.log('Fetching user communities for user ID:', currentUser.id);
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('owner_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching user communities:', error);
        throw error;
      }
      
      console.log('User communities fetched:', data);
      console.log('Number of user communities:', data?.length || 0);
      
      // Additional validation to ensure we only have user's communities
      const filteredData = data?.filter(community => community.owner_id === currentUser.id) || [];
      console.log('Filtered user communities:', filteredData);
      
      setUserCommunities(filteredData);
    } catch (err) {
      console.error('Error fetching user communities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user communities');
      setUserCommunities([]);
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

  // Deprecated: Direct creation is disabled to avoid RLS/type issues.
  // Use the community_data_distribution pipeline via the CommunitySetup wizard instead.
  const createCommunity = async (_communityData: Partial<Community>) => {
    if (!currentUser?.id) throw new Error('User not authenticated');

    console.warn('Direct community creation is disabled. Use the ECO8 Setup wizard (community_data_distribution) instead.');
    throw new Error('Community creation must go through the ECO8 Setup wizard. Please use /eco8/setup.');
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
