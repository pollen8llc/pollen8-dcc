import { supabase } from '@/integrations/supabase/client';

export interface LocationData {
  id?: string;
  name: string;
  formatted_address: string;
  latitude?: number;
  longitude?: number;
  type: 'country' | 'state' | 'city' | 'region' | 'remote' | 'international';
  country_code?: string;
  state_code?: string;
  city_name?: string;
  source: string;
}

export const initializeLocationData = async (): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('populate_us_states_from_atlas');
    
    if (error) {
      console.error('Error initializing location data:', error);
      throw error;
    }

    console.log(`Successfully initialized ${data} location records`);
    return data || 0;
  } catch (error) {
    console.error('Failed to initialize location data:', error);
    throw error;
  }
};

export const searchLocationsByName = async (query: string, limit = 10): Promise<LocationData[]> => {
  try {
    const { data, error } = await supabase.rpc('search_locations', {
      search_query: query,
      limit_count: limit
    });

    if (error) {
      throw error;
    }

    // Transform the data to match our interface
    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      formatted_address: item.formatted_address,
      country_code: item.country_code,
      state_code: item.state_code,
      city_name: item.city_name,
      source: 'local' // Default source for database results
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

export const formatLocationDisplay = (location: LocationData): string => {
  if (location.type === 'remote' || location.type === 'international') {
    return location.name;
  }

  if (location.type === 'city' && location.state_code && location.country_code) {
    return `${location.name}, ${location.state_code}, ${location.country_code}`;
  }

  if (location.type === 'state' && location.country_code) {
    return `${location.name}, ${location.country_code}`;
  }

  return location.formatted_address || location.name;
};

export const getLocationHierarchy = (location: LocationData): string[] => {
  const parts: string[] = [];
  
  if (location.city_name) parts.push(location.city_name);
  if (location.state_code) parts.push(location.state_code);
  if (location.country_code) parts.push(location.country_code);
  
  return parts;
};

// Legacy support: Convert old location strings to standardized format
export const standardizeLocationString = (locationString: string): string => {
  // Handle common legacy formats
  const cleanLocation = locationString.trim();
  
  // Map old state codes to full names if needed
  const stateCodeMap: Record<string, string> = {
    'AL': 'Alabama, United States',
    'AK': 'Alaska, United States',
    'AZ': 'Arizona, United States',
    'AR': 'Arkansas, United States',
    'CA': 'California, United States',
    'CO': 'Colorado, United States',
    'CT': 'Connecticut, United States',
    'DE': 'Delaware, United States',
    'FL': 'Florida, United States',
    'GA': 'Georgia, United States',
    'HI': 'Hawaii, United States',
    'ID': 'Idaho, United States',
    'IL': 'Illinois, United States',
    'IN': 'Indiana, United States',
    'IA': 'Iowa, United States',
    'KS': 'Kansas, United States',
    'KY': 'Kentucky, United States',
    'LA': 'Louisiana, United States',
    'ME': 'Maine, United States',
    'MD': 'Maryland, United States',
    'MA': 'Massachusetts, United States',
    'MI': 'Michigan, United States',
    'MN': 'Minnesota, United States',
    'MS': 'Mississippi, United States',
    'MO': 'Missouri, United States',
    'MT': 'Montana, United States',
    'NE': 'Nebraska, United States',
    'NV': 'Nevada, United States',
    'NH': 'New Hampshire, United States',
    'NJ': 'New Jersey, United States',
    'NM': 'New Mexico, United States',
    'NY': 'New York, United States',
    'NC': 'North Carolina, United States',
    'ND': 'North Dakota, United States',
    'OH': 'Ohio, United States',
    'OK': 'Oklahoma, United States',
    'OR': 'Oregon, United States',
    'PA': 'Pennsylvania, United States',
    'RI': 'Rhode Island, United States',
    'SC': 'South Carolina, United States',
    'SD': 'South Dakota, United States',
    'TN': 'Tennessee, United States',
    'TX': 'Texas, United States',
    'UT': 'Utah, United States',
    'VT': 'Vermont, United States',
    'VA': 'Virginia, United States',
    'WA': 'Washington, United States',
    'WV': 'West Virginia, United States',
    'WI': 'Wisconsin, United States',
    'WY': 'Wyoming, United States',
    'DC': 'Washington D.C., United States',
    'Remote': 'Remote/Online',
    'International': 'International'
  };

  return stateCodeMap[cleanLocation] || cleanLocation;
};