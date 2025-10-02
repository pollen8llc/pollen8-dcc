import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Clock, ChevronLeft, ChevronRight, Search, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Memoized points data for selected cities with pulsing effect
  const pointsData = useMemo(() => {
    return selectedCities.map(city => ({
      lat: cityCoordinates[city]?.lat || 0,
      lng: cityCoordinates[city]?.lng || 0,
      size: 0.8,
      color: '#14b8a6', // teal color
      city: city
    }));
  }, [selectedCities]);

  useEffect(() => {
    if (!globeEl.current) return;

    // Set initial camera position - shifted left for desktop layout
    globeEl.current.pointOfView({ lat: 20, lng: -40, altitude: 2.5 }, 0);
    
    // Enable auto-rotation
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;
    
    setIsReady(true);
  }, []);

  const navigateToZone = (direction: "prev" | "next") => {
    let newIndex = direction === "next" ? activeZoneIndex + 1 : activeZoneIndex - 1;
    
    // Wrap around
    if (newIndex < 0) newIndex = timeZones.length - 1;
    if (newIndex >= timeZones.length) newIndex = 0;

    const newZone = timeZones[newIndex];
    setActiveZone(newZone);
    setActiveZoneIndex(newIndex);
    
    // Only update the overlay, globe keeps rotating
  };

  const toggleCity = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  // Filter all cities based on search query
  const allCities = Object.keys(cityCoordinates);
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allCities.filter(city => 
      city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="max-w-7xl mx-auto space-y-3 md:space-y-4 animate-fade-in p-2 md:p-4">
        {/* Progress */}
        <div className="flex items-center space-x-2 px-2">
          <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
            Step 1 of 4
          </Badge>
        </div>

        {/* Main Container - Full Width Canvas with Overlay Panels */}
        <Card className="p-2 md:p-4 bg-background/20 backdrop-blur-sm border-primary/10">
          <div className="relative w-full h-[calc(100vh-200px)] md:h-[calc(100vh-180px)] max-h-[700px] rounded-lg overflow-hidden bg-gradient-to-br from-background/10 via-primary/5 to-primary/10">
            {/* Globe - Full Canvas */}
            <Globe
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              backgroundColor="rgba(0,0,0,0)"
              showAtmosphere={true}
              atmosphereColor="hsl(var(--primary))"
              atmosphereAltitude={0.15}
              width={typeof window !== 'undefined' ? window.innerWidth - 64 : 800}
              height={typeof window !== 'undefined' ? Math.min(window.innerHeight - 200, 700) : 600}
              animateIn={true}
              waitForGlobeReady={true}
              onGlobeReady={() => setIsReady(true)}
              pointsData={pointsData}
              pointAltitude={0.01}
              pointRadius={0.8}
              pointColor="color"
              pointLabel={(d: any) => d.city}
              pointsMerge={false}
              pointsTransitionDuration={0}
            />

            {/* Bottom Overlay - Accordion Style (All Screens) */}
            <Collapsible
              open={isPanelOpen}
              onOpenChange={setIsPanelOpen}
              className="absolute bottom-0 left-0 right-0 z-20"
            >
              {/* Expandable Content - Opens Upward */}
              <CollapsibleContent className="animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="p-3 md:p-4 space-y-3 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-lg">
                  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3">
                    {/* Selected Cities - Always Visible */}
                    <div className="px-3 md:px-4 py-2.5 md:py-3 bg-background/30 backdrop-blur-lg border border-primary/10 rounded-lg shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs md:text-sm font-semibold text-foreground/90">
                          Selected ({selectedCities.length})
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
                      {selectedCities.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 md:gap-2 max-h-24 md:max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                          {selectedCities.map((city) => (
                            <Badge
                              key={city}
                              variant="default"
                              className="cursor-pointer bg-primary text-primary-foreground text-xs"
                              onClick={() => toggleCity(city)}
                            >
                              {city}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs md:text-sm text-muted-foreground/60 text-center py-4">
                          No cities selected yet
                        </p>
                      )}
                    </div>

                    {/* Search Bar - Centered */}
                    <div className="relative flex items-center justify-center">
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                        <Input
                          type="text"
                          placeholder="Search cities..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9 bg-background/30 backdrop-blur-lg border-primary/10 shadow-lg text-sm"
                        />
                      </div>
                    </div>

                    {/* Cities Badge Cloud */}
                    <div className="px-3 md:px-4 py-2.5 md:py-3 bg-background/30 backdrop-blur-lg border border-primary/10 rounded-lg max-h-32 md:max-h-40 overflow-y-auto shadow-lg scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                      <h3 className="text-xs md:text-sm font-semibold text-foreground/90 mb-2">
                        {searchQuery ? 'Search Results' : 'Suggested Cities'}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {(searchQuery ? filteredCities.slice(0, 20) : activeZone.cities).map((city) => {
                          const isSelected = selectedCities.includes(city);
                          return (
                            <Badge
                              key={city}
                              variant={isSelected ? "default" : "secondary"}
                              className={`cursor-pointer transition-all text-xs ${
                                isSelected 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-background/60 text-foreground hover:bg-primary/20 border-primary/20"
                              }`}
                              onClick={() => {
                                toggleCity(city);
                                if (searchQuery) setSearchQuery("");
                              }}
                            >
                              {city}
                            </Badge>
                          );
                        })}
                        {searchQuery && filteredCities.length === 0 && (
                          <p className="text-xs md:text-sm text-muted-foreground">No cities found</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>

              {/* Timezone Switch - Always Visible at Bottom as Trigger */}
              <CollapsibleTrigger asChild>
                <div className="p-3 md:p-4 bg-gradient-to-t from-background/95 to-transparent backdrop-blur-lg">
                  <div className="max-w-6xl mx-auto flex items-center justify-between px-3 md:px-6 py-2 md:py-3 bg-background/30 backdrop-blur-lg border border-primary/10 rounded-lg shadow-lg cursor-pointer hover:bg-background/40 transition-all">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToZone("prev");
                      }}
                      className="h-8 w-8 md:h-9 md:w-9"
                    >
                      <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                    
                    <div className="flex items-center gap-2 md:gap-3">
                      <Badge className="bg-background/80 backdrop-blur-md border-primary/10 text-primary px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm flex items-center gap-2">
                        <Clock className="h-3 w-3 md:h-4 md:w-4" />
                        {activeZone.name}
                      </Badge>
                      <ChevronUp 
                        className={`h-4 w-4 md:h-5 md:w-5 text-muted-foreground transition-transform duration-200 ${
                          isPanelOpen ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToZone("next");
                      }}
                      className="h-8 w-8 md:h-9 md:w-9"
                    >
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </div>
                </div>
              </CollapsibleTrigger>
            </Collapsible>

            {/* Instructions - Bottom Left */}
            <div className="absolute bottom-3 left-3 text-[10px] md:text-xs text-muted-foreground/60 z-10 bg-background/40 backdrop-blur-sm px-2 py-1 rounded">
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
