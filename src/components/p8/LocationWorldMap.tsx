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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeEl = useRef<any>();
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  // Starry sky background effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star particles
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      twinkleSpeed: number;
      maxAlpha: number;
    }> = [];

    // Create stars
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        maxAlpha: Math.random() * 0.3 + 0.1,
      });
    }

    let animationFrame: number;
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars with twinkling effect
      stars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > star.maxAlpha || star.alpha < 0.05) {
          star.twinkleSpeed *= -1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(234, 234, 255, ${star.alpha})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

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
    <Card className={`relative overflow-hidden ${className}`}>
      {/* Starry sky background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(135deg, rgb(10, 10, 20) 0%, rgb(20, 20, 40) 100%)' }}
      />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-center gap-6">
          {/* Left: Mini Globe */}
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-background/5 backdrop-blur-sm">
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

          {/* Center: Title and Description */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-white mb-1">Locations</h2>
            <p className="text-sm text-white/70 mb-3">Your global presence</p>
            
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

          {/* Right: Stats */}
          <div className="shrink-0 text-right">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-3xl font-bold text-white mb-1">
                {selectedLocations.length}
              </div>
              <div className="text-xs text-white/60">
                Cities
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </Card>
  );
};

export default LocationWorldMap;
