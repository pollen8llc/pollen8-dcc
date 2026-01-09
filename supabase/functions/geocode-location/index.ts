import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: {
    country: string;
    country_code: string;
    state?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    postcode?: string;
  };
}

interface LocationResult {
  id?: string;
  name: string;
  formatted_address: string;
  latitude?: number;
  longitude?: number;
  type: string;
  country_code?: string;
  state_code?: string;
  city_name?: string;
  source: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, limit = 5 } = await req.json();
    
    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ locations: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Geocoding query: ${query}`);

    // First, search our local locations database
    const { data: localLocations, error: localError } = await supabase
      .rpc('search_locations', {
        search_query: query,
        limit_count: limit
      });

    if (localError) {
      console.error('Local search error:', localError);
    }

    let results: LocationResult[] = [];

    // Add local results first
    if (localLocations && localLocations.length > 0) {
      results = localLocations.map((loc: any) => ({
        id: loc.id,
        name: loc.name,
        formatted_address: loc.formatted_address,
        latitude: loc.latitude,
        longitude: loc.longitude,
        type: loc.type,
        country_code: loc.country_code,
        state_code: loc.state_code,
        city_name: loc.city_name,
        source: 'local'
      }));
    }

    // If we don't have enough local results, query Nominatim API
    const remainingLimit = Math.max(0, limit - results.length);
    if (remainingLimit > 0) {
      try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=${remainingLimit}&countrycodes=us,ca,gb,au,de,fr,es,it,nl,se,no,dk,fi&accept-language=en`;
        
        const nominatimResponse = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'Lovable-Location-Service/1.0'
          }
        });

        if (nominatimResponse.ok) {
          const nominatimData: NominatimResult[] = await nominatimResponse.json();
          
          // Process Nominatim results
          const nominatimResults: LocationResult[] = nominatimData.map((item) => {
            const address = item.address;
            let locationType = 'city';
            let locationName = item.name || address.city || address.town || address.village || '';

            // Determine location type and name based on OSM data
            if (item.class === 'place') {
              if (item.type === 'country') {
                locationType = 'country';
                locationName = address.country;
              } else if (item.type === 'state') {
                locationType = 'state';
                locationName = address.state || locationName;
              } else if (['city', 'town', 'village'].includes(item.type)) {
                locationType = 'city';
                locationName = address.city || address.town || address.village || locationName;
              }
            } else if (item.class === 'boundary' && item.type === 'administrative') {
              // Administrative boundaries - could be state or country
              if (item.place_rank <= 8) {
                locationType = 'country';
                locationName = address.country;
              } else if (item.place_rank <= 12) {
                locationType = 'state';
                locationName = address.state || locationName;
              }
            }

            return {
              name: locationName,
              formatted_address: item.display_name,
              latitude: parseFloat(item.lat),
              longitude: parseFloat(item.lon),
              type: locationType,
              country_code: address.country_code?.toUpperCase(),
              state_code: address.state,
              city_name: address.city || address.town || address.village,
              source: 'nominatim'
            };
          }).filter(result => result.name); // Only include results with names

          results = [...results, ...nominatimResults];
        }
      } catch (nominatimError) {
        console.error('Nominatim API error:', nominatimError);
        // Continue without external results
      }
    }

    console.log(`Returning ${results.length} location results for query: ${query}`);

    return new Response(JSON.stringify({ locations: results.slice(0, limit) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in geocode-location function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', locations: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});