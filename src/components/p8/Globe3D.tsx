import { useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';

interface Globe3DProps {
  cities?: string[];
  width?: number;
  height?: number;
}

// City coordinates for selected cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Austin": { lat: 30.2672, lng: -97.7431 },
  "Seattle": { lat: 47.6062, lng: -122.3321 },
  "Boston": { lat: 42.3601, lng: -71.0589 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "Chicago": { lat: 41.8781, lng: -87.6298 },
  "Miami": { lat: 25.7617, lng: -80.1918 },
};

export const Globe3D = ({ cities = [], width = 140, height = 140 }: Globe3DProps) => {
  const globeEl = useRef<any>();

  const pointsData = useMemo(() => {
    return cities.map(city => ({
      lat: cityCoordinates[city]?.lat || 0,
      lng: cityCoordinates[city]?.lng || 0,
      size: 0.5,
      color: 'hsl(var(--primary))',
      city: city
    }));
  }, [cities]);

  useEffect(() => {
    if (!globeEl.current) return;
    
    globeEl.current.pointOfView({ lat: 20, lng: -40, altitude: 2.5 }, 0);
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;
    globeEl.current.controls().enableZoom = false;
  }, []);

  return (
    <div style={{ width, height }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="hsl(var(--primary))"
        atmosphereAltitude={0.15}
        width={width}
        height={height}
        pointsData={pointsData}
        pointAltitude={0.01}
        pointRadius={0.5}
        pointColor="color"
        pointsMerge={false}
      />
    </div>
  );
};
