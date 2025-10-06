import { useEffect, useRef, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import { ChevronDown, ChevronUp, Users, Plus } from 'lucide-react';

// Sample city data
const selectedLocations = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
];

// Sample community data for the middle section
const communities = [
  { name: 'Tech Innovators NYC', size: '247 members', location: 'New York' },
  { name: 'London Entrepreneurs', size: '189 members', location: 'London' },
];

interface LocationWorldMapProps {
  className?: string;
}

const LocationWorldMap = ({ className = '' }: LocationWorldMapProps) => {
  const globeEl = useRef<any>();
  const [isGlobeReady, setIsGlobeReady] = useState(false);
  const [isCommunitiesExpanded, setIsCommunitiesExpanded] = useState(false);
  const navigate = useNavigate();


  // Globe setup
  useEffect(() => {
    if (!globeEl.current) return;

    // Set initial camera position
    globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
    
    // Enable auto-rotation
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 1;
    globeEl.current.controls().enableZoom = false;
    
    setIsGlobeReady(true);
  }, []);

  // Points data for selected locations
  const pointsData = useMemo(() => {
    return selectedLocations.map(location => ({
      lat: location.lat,
      lng: location.lng,
      size: 0.5,
      color: '#14b8a6',
      city: location.name
    }));
  }, []);

  return (
    <Card className={`overflow-hidden border-0 bg-gradient-to-br from-blue-500/5 via-teal-500/5 to-blue-600/5 backdrop-blur-md shadow-2xl ${className}`}>
      <div className="p-0">
        <div className="relative bg-gradient-to-br from-blue-500/2 via-teal-500/2 to-blue-600/2 p-6 lg:p-8">
          <div className="space-y-6">
                
                {/* Section 1: Globe, Title and Description */}
                <div className="flex items-center gap-4">
                  {/* Globe */}
                  <div className="shrink-0">
                    <div className="w-[105px] h-[105px] rounded-full overflow-hidden bg-background/50 backdrop-blur-sm flex items-center justify-center" style={{ border: '3.84px solid hsl(var(--primary) / 0.2)' }}>
                      <Globe
                        ref={globeEl}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                        backgroundColor="rgba(0,0,0,0)"
                        showAtmosphere={true}
                        atmosphereColor="#14b8a6"
                        atmosphereAltitude={0.2}
                        width={101}
                        height={101}
                        animateIn={false}
                        waitForGlobeReady={true}
                        onGlobeReady={() => setIsGlobeReady(true)}
                        pointsData={pointsData}
                        pointAltitude={0.02}
                        pointRadius={1.2}
                        pointColor="color"
                        pointLabel={(d: any) => d.city}
                        pointsMerge={false}
                        pointsTransitionDuration={0}
                      />
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-foreground mb-1">Locations</h2>
                    <p className="text-sm text-muted-foreground">Your global presence across 5 cities</p>
                  </div>
                </div>

                {/* Section 2: Communities Accordion */}
                <div className="space-y-3">
                  {/* Glassmorphic Communities Button */}
                  <button
                    onClick={() => setIsCommunitiesExpanded(!isCommunitiesExpanded)}
                    className="w-full p-4 bg-gradient-to-r from-teal-500/10 via-aquamarine-500/10 to-teal-500/10 backdrop-blur-xl border border-teal-500/20 rounded-lg hover:border-teal-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-teal-500/20 rounded-lg">
                          <Users className="w-5 h-5 text-teal-400" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-foreground">Communities</h3>
                          <p className="text-sm text-muted-foreground">5 active communities</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-teal-500/10 text-teal-400 border-teal-500/20">
                          {communities.reduce((sum, community) => sum + parseInt(community.size), 0)} members
                        </Badge>
                        {isCommunitiesExpanded ? (
                          <ChevronUp className="w-5 h-5 text-teal-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-teal-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Communities Accordion Content */}
                  {isCommunitiesExpanded && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                      {/* Existing Communities */}
                      {communities.map((community, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-background/60 rounded-lg hover:bg-background/80 hover:shadow-md hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse group-hover:bg-teal-300 transition-colors" />
                            <span className="text-sm font-medium group-hover:text-teal-100 transition-colors">{community.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground group-hover:text-teal-200 transition-colors">{community.size}</span>
                        </div>
                      ))}
                      
                      {/* Add Community Slots */}
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={`add-${index}`}
                          className="flex items-center justify-between p-3 bg-background/40 rounded-lg hover:bg-background/60 hover:shadow-md hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-blue-400/50 group-hover:bg-blue-400 transition-colors" />
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-blue-200 transition-colors">Add community</span>
                          </div>
                          <Plus className="w-4 h-4 text-blue-400/50 group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 3: City Badges Grid */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">City Network</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {selectedLocations.map((location) => (
                      <Badge
                        key={location.name}
                        variant="secondary"
                        className="text-xs font-medium justify-center p-2 h-auto"
                      >
                        {location.name}
                      </Badge>
                    ))}
                  </div>
                </div>

          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </Card>
  );
};

export default LocationWorldMap;
