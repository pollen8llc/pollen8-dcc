import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
  const [rotation, setRotation] = useState(0);

  // Auto-rotate the SVG globe
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`relative overflow-hidden bg-card/40 backdrop-blur-md border-0 ${className}`}>
      {/* Leaflet World Map Background */}
      <div className="absolute inset-0 opacity-20 z-0">
        <MapContainer
          center={[20, 0]}
          zoom={1.5}
          style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          keyboard={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
            className="leaflet-teal-tiles"
          />
        </MapContainer>
      </div>

      {/* Glassmorphic overlay with teal tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-background/80 to-background/90 z-0" />
      
      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start gap-6">
          {/* Left: SVG Grid Globe */}
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-background/20 backdrop-blur-sm border border-teal-500/30 flex items-center justify-center">
              <svg width="96" height="96" viewBox="0 0 100 100" className="transform" style={{ transform: `rotateY(${rotation}deg)` }}>
                {/* Globe circle */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(20, 184, 166, 0.3)" strokeWidth="0.5" />
                
                {/* Latitude lines */}
                <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="0.5" />
                <ellipse cx="50" cy="50" rx="45" ry="30" fill="none" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="0.5" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(20, 184, 166, 0.5)" strokeWidth="0.5" />
                
                {/* Longitude lines */}
                <ellipse cx="50" cy="50" rx="15" ry="45" fill="none" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="0.5" />
                <ellipse cx="50" cy="50" rx="30" ry="45" fill="none" stroke="rgba(20, 184, 166, 0.4)" strokeWidth="0.5" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(20, 184, 166, 0.5)" strokeWidth="0.5" />
                
                {/* Location dots */}
                {selectedLocations.map((loc, i) => {
                  const angle = (i / selectedLocations.length) * 360 + rotation;
                  const x = 50 + 35 * Math.cos((angle * Math.PI) / 180);
                  const y = 50 + 35 * Math.sin((angle * Math.PI) / 180);
                  return (
                    <circle
                      key={loc.name}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#14b8a6"
                      className="animate-pulse"
                    />
                  );
                })}
                
                {/* Atmosphere glow */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(20, 184, 166, 0.6)" strokeWidth="1" opacity="0.5" />
              </svg>
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
