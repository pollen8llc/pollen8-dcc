import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

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

// Convert lat/lng to SVG coordinates (Mercator projection)
const projectToMap = (lat: number, lng: number, width: number, height: number) => {
  const x = ((lng + 180) / 360) * width;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = height / 2 - (mercN * width) / (2 * Math.PI);
  return { x, y };
};

const LocationWorldMap = ({ className = '' }: LocationWorldMapProps) => {
  const mapWidth = 800;
  const mapHeight = 400;

  const locationPoints = useMemo(() => {
    return selectedLocations.map(location => ({
      ...location,
      coords: projectToMap(location.lat, location.lng, mapWidth, mapHeight)
    }));
  }, []);

  return (
    <Card className={`group overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/30 ${className}`}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8">
          {/* Left: World Map (same width as avatar - 96px on desktop, full width on mobile) */}
          <div className="shrink-0 w-full sm:w-24">
            <div className="relative w-full sm:w-24 aspect-[2/1] sm:aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
              <svg
                viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Simplified world map outline */}
                <path
                  d="M 50 100 Q 100 80 150 100 T 250 100 Q 300 90 350 100 T 450 100 Q 500 110 550 100 T 650 100 Q 700 90 750 100 M 100 150 Q 150 140 200 150 T 300 150 Q 350 160 400 150 T 500 150 Q 550 140 600 150 T 700 150 M 150 200 Q 200 190 250 200 T 350 200 Q 400 210 450 200 T 550 200 M 200 250 Q 250 240 300 250 T 400 250 Q 450 260 500 250 M 250 300 Q 300 290 350 300 T 450 300"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.2"
                  className="animate-pulse"
                />
                
                {/* Location markers */}
                {locationPoints.map((location, index) => (
                  <g key={location.name}>
                    {/* Pulsing circle */}
                    <circle
                      cx={location.coords.x}
                      cy={location.coords.y}
                      r="8"
                      fill="hsl(var(--primary))"
                      opacity="0.2"
                      className="animate-ping"
                      style={{ animationDelay: `${index * 200}ms` }}
                    />
                    {/* Main marker */}
                    <circle
                      cx={location.coords.x}
                      cy={location.coords.y}
                      r="4"
                      fill="hsl(var(--primary))"
                      className="transition-all duration-300 hover:r-6"
                    />
                  </g>
                ))}
                
                {/* Connection lines */}
                {locationPoints.map((location, i) => 
                  i < locationPoints.length - 1 ? (
                    <line
                      key={`line-${i}`}
                      x1={location.coords.x}
                      y1={location.coords.y}
                      x2={locationPoints[i + 1].coords.x}
                      y2={locationPoints[i + 1].coords.y}
                      stroke="hsl(var(--primary))"
                      strokeWidth="0.5"
                      opacity="0.3"
                      strokeDasharray="4,4"
                      className="animate-pulse"
                    />
                  ) : null
                )}
              </svg>
              
              {/* Map pin icon overlay (desktop only) */}
              <div className="hidden sm:flex absolute inset-0 items-center justify-center pointer-events-none">
                <MapPin className="w-8 h-8 text-primary/20" />
              </div>
            </div>
          </div>

          {/* Center: Title and Badges */}
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2">Locations</h2>
            
            {/* Location badges */}
            <div className="flex flex-wrap gap-1.5">
              {selectedLocations.map((location) => (
                <Badge
                  key={location.name}
                  variant="teal"
                  className="text-xs"
                >
                  {location.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right: Stats */}
          <div className="shrink-0 text-left sm:text-right w-full sm:w-auto">
            <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              {selectedLocations.length}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Cities
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LocationWorldMap;
