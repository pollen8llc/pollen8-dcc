import { useEffect, useRef, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Globe from 'react-globe.gl';

// Sample city data
const selectedLocations = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
];

interface LocationWorldMapProps {
  className?: string;
}

const LocationWorldMap = ({ className = '' }: LocationWorldMapProps) => {
  const globeEl = useRef<any>();
  const [isGlobeReady, setIsGlobeReady] = useState(false);


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
    <Card className={`group overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 ${className}`}>
      <div className="p-6 lg:p-8">
        <div className="flex flex-row items-center gap-6 lg:gap-8">
          {/* Left: Globe (same size as avatar - 96px) */}
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
              <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundColor="rgba(0,0,0,0)"
                showAtmosphere={true}
                atmosphereColor="#14b8a6"
                atmosphereAltitude={0.15}
                width={96}
                height={96}
                animateIn={false}
                waitForGlobeReady={true}
                onGlobeReady={() => setIsGlobeReady(true)}
                pointsData={pointsData}
                pointAltitude={0.01}
                pointRadius={0.6}
                pointColor="color"
                pointLabel={(d: any) => d.city}
                pointsMerge={false}
                pointsTransitionDuration={0}
              />
            </div>
          </div>

          {/* Center: Title and Badges */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-2">Locations</h2>
            
            {/* Location badges */}
            <div className="flex flex-wrap gap-1.5">
              {selectedLocations.map((location) => (
                <Badge
                  key={location.name}
                  className="text-xs bg-[#00eada]/10 text-[#00eada] border border-[#00eada]/30 hover:bg-[#00eada]/20 transition-colors"
                >
                  {location.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right: Stats */}
          <div className="shrink-0 text-right">
            <div className="text-3xl font-bold text-foreground mb-1">
              {selectedLocations.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Cities
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LocationWorldMap;
