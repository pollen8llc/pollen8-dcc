import { useEffect, useRef, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
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
    <Card className={`relative overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl ${className}`}>
      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
          {/* Left: Mini Globe */}
          <div className="shrink-0 mx-auto lg:mx-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-background/50 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
              <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                backgroundColor="rgba(0,0,0,0)"
                showAtmosphere={true}
                atmosphereColor="#14b8a6"
                atmosphereAltitude={0.2}
                width={128}
                height={128}
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

          {/* Center: Title and Description */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">Locations</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">Your global presence</p>
            
            {/* Location badges */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start">
              {selectedLocations.map((location) => (
                <Badge
                  key={location.name}
                  variant="secondary"
                  className="text-xs sm:text-sm font-medium"
                >
                  {location.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right: Manage Button */}
          <div className="shrink-0 mx-auto lg:mx-0">
            <Button
              onClick={() => navigate('/p8/loc8')}
              variant="outline"
              size="sm"
              className="font-medium"
            >
              Manage
            </Button>
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
