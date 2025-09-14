import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from './useDebounce';

export interface Location {
  id?: string;
  name: string;
  formatted_address: string;
  latitude?: number;
  longitude?: number;
  type: 'country' | 'state' | 'city' | 'region' | 'remote' | 'international';
  country_code?: string;
  state_code?: string;
  city_name?: string;
  source: 'local' | 'nominatim' | 'system';
}

export interface UseLocationsOptions {
  searchQuery?: string;
  locationType?: string;
  limit?: number;
  debounceMs?: number;
}

export const useLocations = (options: UseLocationsOptions = {}) => {
  const {
    searchQuery = '',
    locationType,
    limit = 10,
    debounceMs = 300
  } = options;

  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(searchQuery.trim(), debounceMs);

  const searchLocations = async (query: string) => {
    if (!query || query.length < 2) {
      setLocations([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Call our edge function for geocoding
      const { data, error: functionError } = await supabase.functions.invoke('geocode-location', {
        body: { 
          query,
          limit,
          type: locationType
        }
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      setLocations(data?.locations || []);
    } catch (err) {
      console.error('Error searching locations:', err);
      setError(err instanceof Error ? err.message : 'Failed to search locations');
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      searchLocations(debouncedQuery);
    } else {
      setLocations([]);
      setIsLoading(false);
    }
  }, [debouncedQuery, locationType, limit]);

  const saveLocation = async (location: Omit<Location, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert([{
          name: location.name,
          type: location.type,
          formatted_address: location.formatted_address,
          latitude: location.latitude,
          longitude: location.longitude,
          country_code: location.country_code,
          state_code: location.state_code,
          city_name: location.city_name,
          source: location.source
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      console.error('Error saving location:', err);
      throw err;
    }
  };

  const trackLocationUsage = async (locationName: string, sourceTable: string, sourceRecordId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('track_location_usage', {
        location_name: locationName,
        user_id: user.id,
        source_table: sourceTable,
        source_record_id: sourceRecordId
      });
    } catch (err) {
      console.error('Error tracking location usage:', err);
      // Don't throw error for tracking failures
    }
  };

  const popularLocations = useMemo(() => {
    // Filter out locations that are already popular/common
    const staticLocations: Location[] = [
      {
        name: 'Remote/Online',
        formatted_address: 'Remote/Online',
        type: 'remote',
        source: 'system'
      },
      {
        name: 'International',
        formatted_address: 'International',
        type: 'international',
        source: 'system'
      }
    ];

    return staticLocations;
  }, []);

  return {
    locations,
    isLoading,
    error,
    searchLocations,
    saveLocation,
    trackLocationUsage,
    popularLocations
  };
};