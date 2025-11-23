import { useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Globe from 'react-globe.gl';
import { getContacts } from '@/services/rel8t/contactService';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Users, Globe as GlobeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// City coordinates mapping - Major US cities + international cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // Major US Cities
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "Chicago": { lat: 41.8781, lng: -87.6298 },
  "Houston": { lat: 29.7604, lng: -95.3698 },
  "Phoenix": { lat: 33.4484, lng: -112.0740 },
  "Philadelphia": { lat: 39.9526, lng: -75.1652 },
  "San Antonio": { lat: 29.4241, lng: -98.4936 },
  "San Diego": { lat: 32.7157, lng: -117.1611 },
  "Dallas": { lat: 32.7767, lng: -96.7970 },
  "San Jose": { lat: 37.3382, lng: -121.8863 },
  "Austin": { lat: 30.2672, lng: -97.7431 },
  "Jacksonville": { lat: 30.3322, lng: -81.6557 },
  "Fort Worth": { lat: 32.7555, lng: -97.3308 },
  "Columbus": { lat: 39.9612, lng: -82.9988 },
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  "Charlotte": { lat: 35.2271, lng: -80.8431 },
  "Indianapolis": { lat: 39.7684, lng: -86.1581 },
  "Seattle": { lat: 47.6062, lng: -122.3321 },
  "Denver": { lat: 39.7392, lng: -104.9903 },
  "Washington": { lat: 38.9072, lng: -77.0369 },
  "Boston": { lat: 42.3601, lng: -71.0589 },
  "Nashville": { lat: 36.1627, lng: -86.7816 },
  "Detroit": { lat: 42.3314, lng: -83.0458 },
  "Portland": { lat: 45.5152, lng: -122.6784 },
  "Las Vegas": { lat: 36.1699, lng: -115.1398 },
  "Memphis": { lat: 35.1495, lng: -90.0490 },
  "Baltimore": { lat: 39.2904, lng: -76.6122 },
  "Milwaukee": { lat: 43.0389, lng: -87.9065 },
  "Albuquerque": { lat: 35.0844, lng: -106.6504 },
  "Tucson": { lat: 32.2226, lng: -110.9747 },
  "Fresno": { lat: 36.7378, lng: -119.7871 },
  "Mesa": { lat: 33.4152, lng: -111.8315 },
  "Sacramento": { lat: 38.5816, lng: -121.4944 },
  "Atlanta": { lat: 33.7490, lng: -84.3880 },
  "Kansas City": { lat: 39.0997, lng: -94.5786 },
  "Colorado Springs": { lat: 38.8339, lng: -104.8214 },
  "Miami": { lat: 25.7617, lng: -80.1918 },
  "Raleigh": { lat: 35.7796, lng: -78.6382 },
  "Omaha": { lat: 41.2565, lng: -95.9345 },
  "Long Beach": { lat: 33.7701, lng: -118.1937 },
  "Virginia Beach": { lat: 36.8529, lng: -75.9780 },
  "Oakland": { lat: 37.8044, lng: -122.2712 },
  "Minneapolis": { lat: 44.9778, lng: -93.2650 },
  "Tampa": { lat: 27.9506, lng: -82.4572 },
  "Tulsa": { lat: 36.1540, lng: -95.9928 },
  "New Orleans": { lat: 29.9511, lng: -90.0715 },
  "Cleveland": { lat: 41.4993, lng: -81.6944 },
  "Honolulu": { lat: 21.3099, lng: -157.8581 },
  "Santa Ana": { lat: 33.7455, lng: -117.8677 },
  "Anaheim": { lat: 33.8366, lng: -117.9143 },
  "Aurora": { lat: 39.7294, lng: -104.8319 },
  "Bakersfield": { lat: 35.3733, lng: -119.0187 },
  "Riverside": { lat: 33.9806, lng: -117.3755 },
  "Corpus Christi": { lat: 27.8006, lng: -97.3964 },
  "Lexington": { lat: 38.0406, lng: -84.5037 },
  "Pittsburgh": { lat: 40.4406, lng: -79.9959 },
  "Anchorage": { lat: 61.2181, lng: -149.9003 },
  "Stockton": { lat: 37.9577, lng: -121.2908 },
  "Cincinnati": { lat: 39.1031, lng: -84.5120 },
  "Saint Paul": { lat: 44.9537, lng: -93.0900 },
  "Toledo": { lat: 41.6528, lng: -83.5379 },
  "Newark": { lat: 40.7357, lng: -74.1724 },
  "Greensboro": { lat: 36.0726, lng: -79.7920 },
  "Buffalo": { lat: 42.8864, lng: -78.8784 },
  "Plano": { lat: 33.0198, lng: -96.6989 },
  "Lincoln": { lat: 40.8136, lng: -96.7026 },
  "Henderson": { lat: 36.0395, lng: -114.9817 },
  "Fort Wayne": { lat: 41.0793, lng: -85.1394 },
  "Jersey City": { lat: 40.7178, lng: -74.0431 },
  "St. Louis": { lat: 38.6270, lng: -90.1994 },
  "Norfolk": { lat: 36.8508, lng: -76.2859 },
  "Chandler": { lat: 33.3062, lng: -111.8413 },
  "Orlando": { lat: 28.5383, lng: -81.3792 },
  "Boise": { lat: 43.6150, lng: -116.2023 },
  "Salt Lake City": { lat: 40.7608, lng: -111.8910 },
  // International Cities
  "Vancouver": { lat: 49.2827, lng: -123.1207 },
  "Toronto": { lat: 43.6532, lng: -79.3832 },
  "Mexico City": { lat: 19.4326, lng: -99.1332 },
  "London": { lat: 51.5074, lng: -0.1278 },
  "Paris": { lat: 48.8566, lng: 2.3522 },
  "Berlin": { lat: 52.5200, lng: 13.4050 },
  "Rome": { lat: 41.9028, lng: 12.4964 },
  "Madrid": { lat: 40.4168, lng: -3.7038 },
  "Barcelona": { lat: 41.3851, lng: 2.1734 },
  "Amsterdam": { lat: 52.3676, lng: 4.9041 },
  "Brussels": { lat: 50.8503, lng: 4.3517 },
  "Vienna": { lat: 48.2082, lng: 16.3738 },
  "Athens": { lat: 37.9838, lng: 23.7275 },
  "Dubai": { lat: 25.2048, lng: 55.2708 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Bangkok": { lat: 13.7563, lng: 100.5018 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
  "Beijing": { lat: 39.9042, lng: 116.4074 },
  "Shanghai": { lat: 31.2304, lng: 121.4737 },
  "Tokyo": { lat: 35.6762, lng: 139.6503 },
  "Seoul": { lat: 37.5665, lng: 126.9780 },
  "Sydney": { lat: -33.8688, lng: 151.2093 },
  "Melbourne": { lat: -37.8136, lng: 144.9631 },
};

interface LocationPoint {
  lat: number;
  lng: number;
  city: string;
  count: number;
  color: string;
}

const NetworkMapGlobe = () => {
  const globeEl = useRef<any>();

  // Fetch all contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => getContacts(),
  });

  // Fetch locations from database
  const { data: dbLocations = [] } = useQuery({
    queryKey: ['locations-for-map'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('name, latitude, longitude, type, state_code, country_code')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)
        .eq('is_active', true);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Parse and aggregate contact locations
  const locationData = useMemo(() => {
    const locationMap = new Map<string, { lat: number; lng: number; name: string }>();

    contacts.forEach((contact) => {
      if (contact.location) {
        const location = contact.location.trim();
        const locationLower = location.toLowerCase();
        
        // First try to match against database locations (prioritize exact matches)
        let dbMatch = dbLocations.find(
          (loc) => loc.name.toLowerCase() === locationLower
        );
        
        // If no exact match, try partial match (e.g., "Austin, Texas" matches "Texas")
        if (!dbMatch) {
          dbMatch = dbLocations.find(
            (loc) => locationLower.includes(loc.name.toLowerCase()) ||
                     (loc.state_code && locationLower.includes(loc.state_code.toLowerCase()))
          );
        }
        
        if (dbMatch && dbMatch.latitude && dbMatch.longitude) {
          const key = dbMatch.name;
          if (!locationMap.has(key)) {
            locationMap.set(key, {
              lat: dbMatch.latitude,
              lng: dbMatch.longitude,
              name: dbMatch.name,
            });
          }
        } else {
          // Fall back to hardcoded cityCoordinates
          const cityKey = Object.keys(cityCoordinates).find(
            (city) => locationLower.includes(city.toLowerCase())
          );
          
          if (cityKey && !locationMap.has(cityKey)) {
            locationMap.set(cityKey, {
              lat: cityCoordinates[cityKey].lat,
              lng: cityCoordinates[cityKey].lng,
              name: cityKey,
            });
          }
        }
      }
    });

    // Count contacts per location
    const locationCounts = new Map<string, number>();
    contacts.forEach((contact) => {
      if (contact.location) {
        const location = contact.location.trim();
        const locationLower = location.toLowerCase();
        
        for (const [key, coords] of locationMap.entries()) {
          if (locationLower.includes(key.toLowerCase()) ||
              (key === coords.name && locationLower === key.toLowerCase())) {
            locationCounts.set(key, (locationCounts.get(key) || 0) + 1);
            break;
          }
        }
      }
    });

    // Convert to array of points
    const points: LocationPoint[] = Array.from(locationMap.entries())
      .map(([key, coords]) => ({
        lat: coords.lat,
        lng: coords.lng,
        city: coords.name,
        count: locationCounts.get(key) || 1,
        color: 'hsl(var(--primary))',
      }))
      .filter((point) => point.count > 0);

    return points;
  }, [contacts, dbLocations]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalWithLocation = locationData.reduce((sum, loc) => sum + loc.count, 0);
    const uniqueCities = locationData.length;
    const totalContacts = contacts.length;
    
    return {
      totalWithLocation,
      uniqueCities,
      totalContacts,
      percentage: totalContacts > 0 ? Math.round((totalWithLocation / totalContacts) * 100) : 0,
    };
  }, [locationData, contacts]);

  // Globe setup with auto-rotation
  useEffect(() => {
    if (!globeEl.current) return;

    const globe = globeEl.current;
    
    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.3;
    globe.controls().enableZoom = true;

    // Set initial view
    globe.pointOfView({ altitude: 2.5 });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <GlobeIcon className="h-8 w-8 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading network map...</p>
        </div>
      </div>
    );
  }

  if (locationData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="flex flex-col items-center gap-3 text-center max-w-md">
          <MapPin className="h-12 w-12 text-muted-foreground/50" />
          <h4 className="text-lg font-semibold">No Location Data</h4>
          <p className="text-sm text-muted-foreground">
            Add location information to your contacts to see them on the network map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Badge variant="secondary" className="px-3 py-1.5">
          <Users className="h-3.5 w-3.5 mr-1.5" />
          {stats.totalWithLocation} contacts mapped
        </Badge>
        <Badge variant="secondary" className="px-3 py-1.5">
          <MapPin className="h-3.5 w-3.5 mr-1.5" />
          {stats.uniqueCities} {stats.uniqueCities === 1 ? 'city' : 'cities'}
        </Badge>
        <Badge variant="secondary" className="px-3 py-1.5">
          <GlobeIcon className="h-3.5 w-3.5 mr-1.5" />
          {stats.percentage}% coverage
        </Badge>
      </div>

      {/* Globe Container */}
      <div className="relative h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-background to-primary/5">
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="hsl(var(--primary))"
          atmosphereAltitude={0.15}
          pointsData={locationData}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude={0.01}
          pointRadius={(d: any) => Math.min(0.5 + (d.count * 0.15), 2)}
          pointLabel={(d: any) => `
            <div style="
              background: hsl(var(--popover));
              color: hsl(var(--popover-foreground));
              padding: 8px 12px;
              border-radius: 8px;
              border: 1px solid hsl(var(--border));
              font-family: system-ui;
              font-size: 13px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            ">
              <strong>${d.city}</strong><br/>
              ${d.count} ${d.count === 1 ? 'contact' : 'contacts'}
            </div>
          `}
          pointsMerge={true}
          width={undefined}
          height={400}
        />

        {/* Decorative gradient overlays */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>
    </div>
  );
};

export default NetworkMapGlobe;
