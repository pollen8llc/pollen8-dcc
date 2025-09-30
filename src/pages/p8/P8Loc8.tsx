import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Globe from "react-globe.gl";

// City coordinates mapping
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  "Honolulu": { lat: 21.3099, lng: -157.8581 },
  "Pago Pago": { lat: -14.2756, lng: -170.7025 },
  "Rarotonga": { lat: -21.2367, lng: -159.7777 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  "Seattle": { lat: 47.6062, lng: -122.3321 },
  "Vancouver": { lat: 49.2827, lng: -123.1207 },
  "Tijuana": { lat: 32.5149, lng: -117.0382 },
  "Denver": { lat: 39.7392, lng: -104.9903 },
  "Phoenix": { lat: 33.4484, lng: -112.0740 },
  "Chicago": { lat: 41.8781, lng: -87.6298 },
  "Mexico City": { lat: 19.4326, lng: -99.1332 },
  "Houston": { lat: 29.7604, lng: -95.3698 },
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Toronto": { lat: 43.6532, lng: -79.3832 },
  "Miami": { lat: 25.7617, lng: -80.1918 },
  "Bogotá": { lat: 4.7110, lng: -74.0721 },
  "Lima": { lat: -12.0464, lng: -77.0428 },
  "São Paulo": { lat: -23.5505, lng: -46.6333 },
  "Buenos Aires": { lat: -34.6037, lng: -58.3816 },
  "Rio de Janeiro": { lat: -22.9068, lng: -43.1729 },
  "Santiago": { lat: -33.4489, lng: -70.6693 },
  "London": { lat: 51.5074, lng: -0.1278 },
  "Lagos": { lat: 6.5244, lng: 3.3792 },
  "Accra": { lat: 5.6037, lng: -0.1870 },
  "Casablanca": { lat: 33.5731, lng: -7.5898 },
  "Dakar": { lat: 14.7167, lng: -17.4677 },
  "Paris": { lat: 48.8566, lng: 2.3522 },
  "Berlin": { lat: 52.5200, lng: 13.4050 },
  "Rome": { lat: 41.9028, lng: 12.4964 },
  "Cairo": { lat: 30.0444, lng: 31.2357 },
  "Johannesburg": { lat: -26.2041, lng: 28.0473 },
  "Athens": { lat: 37.9838, lng: 23.7275 },
  "Moscow": { lat: 55.7558, lng: 37.6173 },
  "Istanbul": { lat: 41.0082, lng: 28.9784 },
  "Dubai": { lat: 25.2048, lng: 55.2708 },
  "Nairobi": { lat: -1.2921, lng: 36.8219 },
  "Tehran": { lat: 35.6892, lng: 51.3890 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Karachi": { lat: 24.8607, lng: 67.0011 },
  "Dhaka": { lat: 23.8103, lng: 90.4125 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Bangkok": { lat: 13.7563, lng: 100.5018 },
  "Singapore": { lat: 1.3521, lng: 103.8198 },
  "Hong Kong": { lat: 22.3193, lng: 114.1694 },
  "Beijing": { lat: 39.9042, lng: 116.4074 },
  "Manila": { lat: 14.5995, lng: 120.9842 },
  "Tokyo": { lat: 35.6762, lng: 139.6503 },
  "Seoul": { lat: 37.5665, lng: 126.9780 },
  "Sydney": { lat: -33.8688, lng: 151.2093 },
  "Melbourne": { lat: -37.8136, lng: 144.9631 },
  "Brisbane": { lat: -27.4698, lng: 153.0251 },
  "Auckland": { lat: -36.8485, lng: 174.7633 },
  "Fiji": { lat: -17.7134, lng: 178.0650 },
  "Wellington": { lat: -41.2865, lng: 174.7762 },
  "Noumea": { lat: -22.2758, lng: 166.4572 },
};

// Time zone data with longitude ranges and major cities
const timeZones = [
  {
    name: "UTC-11 to UTC-10",
    range: [-165, -135],
    cities: ["Honolulu", "Pago Pago", "Rarotonga"],
  },
  {
    name: "UTC-9 to UTC-8",
    range: [-135, -105],
    cities: ["Los Angeles", "San Francisco", "Seattle", "Vancouver", "Tijuana"],
  },
  {
    name: "UTC-7 to UTC-6",
    range: [-105, -75],
    cities: ["Denver", "Phoenix", "Chicago", "Mexico City", "Houston"],
  },
  {
    name: "UTC-5 to UTC-4",
    range: [-75, -45],
    cities: ["New York", "Toronto", "Miami", "Bogotá", "Lima"],
  },
  {
    name: "UTC-3 to UTC-2",
    range: [-45, -15],
    cities: ["São Paulo", "Buenos Aires", "Rio de Janeiro", "Santiago"],
  },
  {
    name: "UTC-1 to UTC+1",
    range: [-15, 15],
    cities: ["London", "Lagos", "Accra", "Casablanca", "Dakar"],
  },
  {
    name: "UTC+1 to UTC+2",
    range: [15, 45],
    cities: ["Paris", "Berlin", "Rome", "Cairo", "Johannesburg", "Athens"],
  },
  {
    name: "UTC+3 to UTC+4",
    range: [45, 75],
    cities: ["Moscow", "Istanbul", "Dubai", "Nairobi", "Tehran"],
  },
  {
    name: "UTC+5 to UTC+6",
    range: [75, 105],
    cities: ["Mumbai", "Delhi", "Karachi", "Dhaka", "Kolkata"],
  },
  {
    name: "UTC+7 to UTC+8",
    range: [105, 135],
    cities: ["Bangkok", "Singapore", "Hong Kong", "Beijing", "Manila"],
  },
  {
    name: "UTC+9 to UTC+10",
    range: [135, 165],
    cities: ["Tokyo", "Seoul", "Sydney", "Melbourne", "Brisbane"],
  },
  {
    name: "UTC+11 to UTC+12",
    range: [165, 180],
    cities: ["Auckland", "Fiji", "Wellington", "Noumea"],
  },
];

const P8Loc8 = () => {
  const navigate = useNavigate();
  const globeEl = useRef<any>();
  const [activeZone, setActiveZone] = useState(timeZones[5]); // Default to UTC
  const [activeZoneIndex, setActiveZoneIndex] = useState(5);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Memoized points data for selected cities
  const pointsData = useMemo(() => {
    return selectedCities.map(city => ({
      lat: cityCoordinates[city]?.lat || 0,
      lng: cityCoordinates[city]?.lng || 0,
      size: 0.5,
      color: 'hsl(var(--primary))',
      city: city
    }));
  }, [selectedCities]);

  useEffect(() => {
    if (!globeEl.current) return;

    // Set initial camera position
    globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
    setIsReady(true);

    // Detect longitude changes
    const interval = setInterval(() => {
      if (globeEl.current) {
        const pov = globeEl.current.pointOfView();
        const lng = pov.lng;

        // Normalize longitude to -180 to 180
        const normalizedLng = ((lng + 180) % 360) - 180;

        // Find matching time zone
        const zoneIndex = timeZones.findIndex(
          (tz) => normalizedLng >= tz.range[0] && normalizedLng < tz.range[1]
        );

        if (zoneIndex !== -1 && zoneIndex !== activeZoneIndex) {
          setActiveZone(timeZones[zoneIndex]);
          setActiveZoneIndex(zoneIndex);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeZoneIndex]);

  const navigateToZone = (direction: "prev" | "next") => {
    let newIndex = direction === "next" ? activeZoneIndex + 1 : activeZoneIndex - 1;
    
    // Wrap around
    if (newIndex < 0) newIndex = timeZones.length - 1;
    if (newIndex >= timeZones.length) newIndex = 0;

    const newZone = timeZones[newIndex];
    setActiveZone(newZone);
    setActiveZoneIndex(newIndex);

    // Rotate globe to center of new zone with smooth animation
    if (globeEl.current) {
      const centerLng = (newZone.range[0] + newZone.range[1]) / 2;
      globeEl.current.pointOfView({ lat: 20, lng: centerLng, altitude: 2.5 }, 1500);
    }
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-2 md:p-4">
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4 animate-fade-in">
        {/* Progress */}
        <div className="flex items-center space-x-2 px-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 1 of 4
          </Badge>
        </div>

        {/* Globe Container with Overlays */}
        <Card className="p-2 md:p-4 bg-background/40 backdrop-blur-xl border-primary/20">
          <div className="relative w-full h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] max-h-[700px] rounded-lg overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10">
            {/* Globe */}
            <Globe
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              backgroundColor="rgba(0,0,0,0)"
              showAtmosphere={true}
              atmosphereColor="hsl(var(--primary))"
              atmosphereAltitude={0.15}
              width={typeof window !== 'undefined' ? window.innerWidth - 32 : 800}
              height={typeof window !== 'undefined' ? Math.min(window.innerHeight - 200, 700) : 600}
              animateIn={true}
              waitForGlobeReady={true}
              onGlobeReady={() => setIsReady(true)}
              // Selected city points
              pointsData={pointsData}
              pointAltitude={0.01}
              pointRadius={0.5}
              pointColor="color"
              pointLabel={(d: any) => d.city}
              pointsMerge={false}
            />
            
            {/* Pulsing animation for selected cities */}
            <style>{`
              @keyframes pulse-dot {
                0%, 100% {
                  opacity: 1;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.5;
                  transform: scale(1.5);
                }
              }
            `}</style>

            {/* Navigation Arrows - Overlaid like Windows Photos */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateToZone("prev")}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-md hover:bg-background border-primary/30 z-20 h-10 w-10 md:h-12 md:w-12"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateToZone("next")}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-md hover:bg-background border-primary/30 z-20 h-10 w-10 md:h-12 md:w-12"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>

            {/* Time Zone Badge - Top Center */}
            <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 md:gap-3 max-w-[90%]">
              <Badge className="bg-background/90 backdrop-blur-md border-primary/30 text-primary px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm flex items-center gap-2">
                <Clock className="h-3 w-3 md:h-4 md:w-4" />
                {activeZone.name}
              </Badge>
              
              {/* City Selection - Below Time Zone Badge */}
              <div className="bg-background/90 backdrop-blur-md border border-primary/30 rounded-lg px-3 py-2 md:px-4 md:py-3 space-y-2 animate-fade-in max-h-[30vh] overflow-y-auto">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    {selectedCities.length} selected
                  </p>
                  {selectedCities.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCities([])}
                      className="text-xs h-6 px-2"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 md:gap-2 max-w-[85vw] md:max-w-[600px]">
                  {activeZone.cities.map((city) => {
                    const isSelected = selectedCities.includes(city);
                    return (
                      <Badge
                        key={city}
                        variant={isSelected ? "default" : "secondary"}
                        className={`cursor-pointer transition-all text-xs ${
                          isSelected 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "bg-background/60 backdrop-blur-sm text-foreground hover:bg-primary/20 border-primary/20"
                        }`}
                        onClick={() => toggleCity(city)}
                      >
                        {city}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Instructions - Bottom Left */}
            <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-[10px] md:text-xs text-muted-foreground/70 z-10">
              <p>Drag to rotate • Scroll to zoom</p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between px-2">
          <Button variant="outline" onClick={() => navigate("/p8")} className="group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>
          <Button onClick={() => navigate("/p8/asl")} className="group">
            Continue
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default P8Loc8;
