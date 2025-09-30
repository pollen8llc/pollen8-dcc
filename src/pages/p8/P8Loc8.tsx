import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Globe from "react-globe.gl";

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

    // Rotate globe to center of new zone
    if (globeEl.current) {
      const centerLng = (newZone.range[0] + newZone.range[1]) / 2;
      globeEl.current.pointOfView({ lat: 20, lng: centerLng, altitude: 2.5 }, 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 1 of 4
          </Badge>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Target Locations</h1>
          <p className="text-muted-foreground">Rotate the globe to explore time zones</p>
        </div>

        {/* Globe Container with Overlays */}
        <Card className="p-4 md:p-8 bg-background/40 backdrop-blur-xl border-primary/20">
          <div className="relative w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10">
            {/* Globe */}
            <Globe
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              backgroundColor="rgba(0,0,0,0)"
              showAtmosphere={true}
              atmosphereColor="hsl(var(--primary))"
              atmosphereAltitude={0.15}
              width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 80, 1000) : 800}
              height={typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 600}
              animateIn={true}
              waitForGlobeReady={true}
              onGlobeReady={() => setIsReady(true)}
            />

            {/* Navigation Arrows - Overlaid like Windows Photos */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateToZone("prev")}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md hover:bg-background/90 border-primary/30 z-10"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateToZone("next")}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md hover:bg-background/90 border-primary/30 z-10"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Time Zone Badge - Top Center */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 max-w-[90%]">
              <Badge className="bg-background/80 backdrop-blur-md border-primary/30 text-primary px-4 py-2 text-sm md:text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {activeZone.name}
              </Badge>
              
              {/* City Selection - Below Time Zone Badge */}
              <div className="bg-background/80 backdrop-blur-md border border-primary/30 rounded-lg px-4 py-3 space-y-2 animate-fade-in">
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
                <div className="flex flex-wrap gap-2 max-w-[80vw] md:max-w-[600px]">
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
            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground/70 z-10">
              <p>Drag to rotate • Scroll to zoom</p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
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
