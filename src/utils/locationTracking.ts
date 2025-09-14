import { supabase } from '@/integrations/supabase/client';

/**
 * Track location usage in the lexicon system for analytics
 * This helps us understand which locations are most commonly used
 */
export const trackLocationUsage = async (
  locationName: string,
  sourceTable: string,
  sourceRecordId: string,
  userId?: string
) => {
  try {
    if (!locationName || !locationName.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = userId || user?.id;
    
    if (!currentUserId) return;

    // Use the RPC function to track location usage in lexicon
    await supabase.rpc('track_location_usage', {
      location_name: locationName.trim(),
      user_id: currentUserId,
      source_table: sourceTable,
      source_record_id: sourceRecordId
    });
  } catch (error) {
    console.error('Error tracking location usage:', error);
    // Don't throw error for tracking failures - this is analytics only
  }
};

/**
 * Standardize location string format for consistency
 * This ensures locations are stored in a consistent format
 */
export const standardizeLocationFormat = (location: string): string => {
  if (!location || typeof location !== 'string') return '';
  
  // Trim whitespace
  let standardized = location.trim();
  
  // Handle common abbreviations and standardizations
  const standardizations: Record<string, string> = {
    'USA': 'United States',
    'US': 'United States',
    'UK': 'United Kingdom',
    'NYC': 'New York City, New York',
    'LA': 'Los Angeles, California',
    'SF': 'San Francisco, California',
    'Remote/Online': 'Remote/Online',
    'International': 'International',
    'Worldwide': 'International'
  };
  
  // Check for exact matches first
  if (standardizations[standardized]) {
    return standardizations[standardized];
  }
  
  // Handle state code to full name conversions for US locations
  const stateAbbreviations: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
    'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
    'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
    'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
    'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
    'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
    'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
    'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
    'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'Washington D.C.'
  };
  
  // Look for state abbreviations and expand them
  Object.entries(stateAbbreviations).forEach(([abbr, fullName]) => {
    // Pattern: ", XX" or ", XX," or ending with " XX"
    const patterns = [
      new RegExp(`, ${abbr}$`, 'gi'),
      new RegExp(`, ${abbr},`, 'gi'),
      new RegExp(` ${abbr}$`, 'gi'),
      new RegExp(` ${abbr},`, 'gi')
    ];
    
    patterns.forEach(pattern => {
      standardized = standardized.replace(pattern, (match) => {
        return match.replace(new RegExp(abbr, 'gi'), fullName);
      });
    });
  });
  
  return standardized;
};

/**
 * Get location suggestions based on user's previous usage
 */
export const getLocationSuggestions = async (query: string = '', limit: number = 5) => {
  try {
    const { data, error } = await supabase.rpc('get_term_suggestions', {
      p_term_type: 'location',
      p_search_query: query,
      p_limit: limit
    });

    if (error) throw error;

    return data?.map((item: any) => ({
      name: item.term,
      usage_count: item.usage_count,
      first_user: item.first_user_name
    })) || [];
  } catch (error) {
    console.error('Error getting location suggestions:', error);
    return [];
  }
};