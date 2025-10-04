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
    <Card className={`relative overflow-hidden bg-card/40 backdrop-blur-md border-0 ${className}`}>
      {/* SVG World Map Outline Background */}
      <div className="absolute inset-0 opacity-10">
        <svg
          viewBox="0 0 2000 1000"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(20, 184, 166, 0.3)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="2000" height="1000" fill="#0a0a0a"/>
          <rect width="2000" height="1000" fill="url(#grid)"/>
          {/* Simplified world map paths with teal stroke */}
          <g stroke="rgba(20, 184, 166, 0.6)" strokeWidth="1" fill="none">
            {/* North America */}
            <path d="M 200,200 Q 250,150 350,200 L 400,250 L 380,350 Q 320,400 250,380 L 200,300 Z"/>
            {/* South America */}
            <path d="M 350,450 Q 380,420 400,480 L 420,600 Q 400,650 360,630 L 340,550 Z"/>
            {/* Europe */}
            <path d="M 900,200 Q 950,180 1000,220 L 1020,280 Q 980,300 920,280 Z"/>
            {/* Africa */}
            <path d="M 920,350 Q 980,330 1050,380 L 1080,550 Q 1020,600 960,580 L 940,450 Z"/>
            {/* Asia */}
            <path d="M 1100,150 Q 1300,120 1500,200 L 1580,350 Q 1520,400 1400,380 L 1200,300 Z"/>
            {/* Australia */}
            <path d="M 1450,650 Q 1520,630 1580,680 L 1560,750 Q 1500,770 1440,740 Z"/>
          </g>
        </svg>
      </div>

      {/* Glassmorphic overlay with teal tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background/80 to-background/90" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-6">
          {/* Left: D3 Grid Globe */}
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-background/20 backdrop-blur-sm border border-teal-500/30">
              <Globe
                ref={globeEl}
                globeImageUrl={null}
                backgroundColor="rgba(0,0,0,0)"
                showGlobe={true}
                showAtmosphere={true}
                atmosphereColor="rgba(20, 184, 166, 0.8)"
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

          {/* Center: Title, Description and Location badges */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h2 className="text-2xl font-bold mb-1">Locations</h2>
              <p className="text-sm text-muted-foreground">Your global presence</p>
            </div>
            
            {/* Location badges */}
            <div className="flex flex-wrap gap-2">
              {selectedLocations.map((location) => (
                <Badge
                  key={location.name}
                  variant="secondary"
                  className="bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30 transition-colors"
                >
                  {location.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle teal glow accents */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </Card>
  );
};

export default LocationWorldMap;
