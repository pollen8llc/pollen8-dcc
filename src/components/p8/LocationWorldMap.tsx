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

// 3D Teal Grid Globe Component
const GridGlobe = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.8) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const size = 96;
  const center = size / 2;
  const radius = 40;

  return (
    <div className="relative w-24 h-24 flex-shrink-0">
      {/* Glassmorphic background circle */}
      <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-sm" />
      
      <svg 
        className="w-full h-full" 
        viewBox={`0 0 ${size} ${size}`}
        style={{ 
          filter: "drop-shadow(0 0 8px rgba(20, 184, 166, 0.4))",
          transform: `perspective(400px) rotateY(${rotation}deg) rotateX(15deg)`
        }}
      >
        {/* Main sphere outline */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius} 
          fill="none" 
          stroke="rgba(20, 184, 166, 0.5)" 
          strokeWidth="1.5" 
        />
        
        {/* Latitude lines (horizontal circles) */}
        {[-30, -15, 0, 15, 30].map((offset, i) => {
          const y = center + offset;
          const latRadius = radius * Math.cos((offset / radius) * (Math.PI / 2));
          return (
            <ellipse
              key={`lat-${i}`}
              cx={center}
              cy={y}
              rx={latRadius}
              ry={latRadius * 0.3}
              fill="none"
              stroke="rgba(20, 184, 166, 0.4)"
              strokeWidth="0.8"
            />
          );
        })}
        
        {/* Longitude lines (vertical ellipses) */}
        {[0, 30, 60, 90, 120, 150].map((angle, i) => {
          const rotateAngle = angle + rotation * 0.3;
          return (
            <ellipse
              key={`lon-${i}`}
              cx={center}
              cy={center}
              rx={radius * 0.3}
              ry={radius}
              fill="none"
              stroke="rgba(20, 184, 166, 0.4)"
              strokeWidth="0.8"
              transform={`rotate(${rotateAngle} ${center} ${center})`}
            />
          );
        })}
        
        {/* Pulsing location dots */}
        {selectedLocations.map((loc, i) => {
          const angle = (i / selectedLocations.length) * 360 + rotation;
          const depth = Math.cos((angle * Math.PI) / 180);
          const x = center + radius * 0.7 * Math.sin((angle * Math.PI) / 180);
          const y = center - radius * 0.5 * Math.sin(((i * 60) * Math.PI) / 180);
          const scale = depth > 0 ? 1 : 0.6;
          const opacity = depth > 0 ? 0.9 : 0.3;
          
          return (
            <g key={loc.name}>
              <circle
                cx={x}
                cy={y}
                r={3 * scale}
                fill="rgba(20, 184, 166, 0.3)"
                className="animate-pulse"
              />
              <circle
                cx={x}
                cy={y}
                r={1.5 * scale}
                fill={`rgba(20, 184, 166, ${opacity})`}
              />
            </g>
          );
        })}
        
        {/* Outer glow ring */}
        <circle 
          cx={center} 
          cy={center} 
          r={radius + 2} 
          fill="none" 
          stroke="rgba(20, 184, 166, 0.6)" 
          strokeWidth="1" 
          opacity="0.4" 
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
            <div className="relative min-h-[400px] bg-gradient-to-r from-background via-background/50 to-background">
              {/* Mapbox World Map Background */}
              <div className="absolute inset-0 z-0 opacity-60">
                <div ref={mapContainer} className="w-full h-full" style={{ filter: 'hue-rotate(100deg) saturate(1.3) brightness(1.1)' }} />
              </div>

              {/* Glassmorphic overlay with teal tint */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-background/60 to-background/80 z-0" />
              
              {/* Content Layout - matches NetworkWorldMap structure */}
              <div className="relative z-10 p-6 lg:p-8 flex flex-col justify-between h-full min-h-[400px]">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* 3D Grid Globe (left) */}
                  <GridGlobe />

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
                  <div className="flex-shrink-0 bg-background/60 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-primary/20">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        Locations
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-[rgba(20,184,166,0.9)]">
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
                      className="bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30 transition-colors backdrop-blur-sm"
                    >
                      {location.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Subtle teal glow accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
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
