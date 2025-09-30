import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
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
        const zone = timeZones.find(
          (tz) => normalizedLng >= tz.range[0] && normalizedLng < tz.range[1]
        );

        if (zone && zone !== activeZone) {
          setActiveZone(zone);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeZone]);

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

        {/* Globe Container */}
        <Card className="p-4 md:p-8 bg-background/40 backdrop-blur-xl border-primary/20 space-y-6">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-black/20">
            <Globe
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              backgroundColor="rgba(0,0,0,0)"
              width={typeof window !== 'undefined' ? Math.min(window.innerWidth - 80, 1000) : 800}
              height={500}
              animateIn={true}
              waitForGlobeReady={true}
              onGlobeReady={() => setIsReady(true)}
            />
          </div>

          {/* Active Time Zone Display */}
          <div className="pt-6 border-t border-primary/20 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">{activeZone.name}</h3>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Major cities in this zone:</p>
              <div className="flex flex-wrap gap-2">
                {activeZone.cities.map((city) => (
                  <Badge
                    key={city}
                    variant="secondary"
                    className="bg-primary/10 text-foreground hover:bg-primary/20 transition-colors"
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Click and drag to rotate • Scroll to zoom</p>
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
