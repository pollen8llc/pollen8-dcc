import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Sample city data
const selectedLocations = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
];

// CSS-based 3D Teal Grid Globe with rotation animation
const CSSGridGlobe = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const size = 96;
  const center = size / 2;
  const radius = 38;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      <svg 
        className="w-full h-full" 
        viewBox={`0 0 ${size} ${size}`}
        style={{ 
          filter: "drop-shadow(0 0 12px rgba(20, 184, 166, 0.5))",
          transform: `rotateX(15deg)`
        }}
      >
        {/* Main sphere outline */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="none" 
          stroke="#14b8a6" 
          strokeWidth="1.5" 
          opacity="0.6"
        />
        
        {/* Latitude lines (horizontal circles) - wireframe style */}
        {[-25, -12.5, 0, 12.5, 25].map((offset, i) => {
          const y = center + offset;
          const latRadius = radius * Math.cos((offset / radius) * (Math.PI / 2));
          const rotationOffset = (rotation + i * 20) % 360;
          return (
            <ellipse
              key={`lat-${i}`}
              cx={center}
              cy={y}
              rx={latRadius}
              ry={latRadius * 0.25}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="0.8"
              opacity="0.5"
              transform={`rotate(${rotationOffset} ${center} ${center})`}
            />
          );
        })}
        
        {/* Longitude lines (vertical ellipses) - wireframe style */}
        {[0, 30, 60, 90, 120, 150].map((angle, i) => {
          const rotateAngle = (angle + rotation * 0.5) % 360;
          return (
            <ellipse
              key={`lon-${i}`}
              cx={center}
              cy={center}
              rx={radius * 0.25}
              ry={radius}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="0.8"
              opacity="0.5"
              transform={`rotate(${rotateAngle} ${center} ${center})`}
            />
          );
        })}
        
        {/* Outer glow ring */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius + 3} 
          fill="none" 
          stroke="#14b8a6" 
          strokeWidth="1.5" 
          opacity="0.3" 
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};

interface LocationWorldMapProps {
  className?: string;
}

const LocationWorldMap = ({ className = '' }: LocationWorldMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: { name: 'globe' } as any,
      zoom: 1.3,
      center: [20, 20],
      interactive: false,
    });

    // Disable all interactions
    map.current.scrollZoom.disable();
    map.current.boxZoom.disable();
    map.current.dragRotate.disable();
    map.current.dragPan.disable();
    map.current.keyboard.disable();
    map.current.doubleClickZoom.disable();
    map.current.touchZoomRotate.disable();

    // Apply teal atmosphere and add markers
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(10, 10, 10)',
        'high-color': 'rgb(20, 184, 166)',
        'horizon-blend': 0.15,
        'space-color': 'rgb(10, 10, 10)',
        'star-intensity': 0.3,
      });

      // Add pulsing markers for each location
      selectedLocations.forEach((location) => {
        const el = document.createElement('div');
        el.className = 'location-marker';
        el.innerHTML = `
          <div class="marker-pulse"></div>
          <div class="marker-dot"></div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([location.lng, location.lat])
          .addTo(map.current!);
        
        markers.current.push(marker);
      });
    });

    // Cleanup
    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
    };
  }, []);

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl">
          <CardContent className="p-0">
            <div className="relative min-h-[400px] bg-black/90">
              {/* Mapbox World Map Background - Fully Visible */}
              <div className="absolute inset-0 z-0">
                <div ref={mapContainer} className="w-full h-full" />
              </div>
              
              {/* Content Layout - matches NetworkWorldMap structure */}
              <div className="relative z-10 p-6 lg:p-8 flex flex-col justify-between h-full min-h-[400px] bg-gradient-to-br from-black/40 via-transparent to-black/40">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* 3D CSS Grid Globe (left) */}
                  <CSSGridGlobe />

                  {/* Location Info (center) */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-1">
                      Locations
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Your global presence
                    </p>
                  </div>

                  {/* Location Count (right) */}
                  <div className="flex-shrink-0 bg-black/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-teal-500/30">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-teal-400/80 mb-1">
                        Locations
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-teal-400">
                        {selectedLocations.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location badges at bottom */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {selectedLocations.map((location) => (
                    <Badge
                      key={location.name}
                      variant="secondary"
                      className="bg-black/60 text-teal-300 border-teal-500/40 hover:bg-black/80 transition-colors backdrop-blur-sm"
                    >
                      {location.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Glowing Sliver */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px] opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[4px] opacity-40" />
      </div>
    </div>
  );
};

export default LocationWorldMap;
