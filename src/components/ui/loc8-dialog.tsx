import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, X } from "lucide-react";
import Globe from "react-globe.gl";
import { toast } from "sonner";

// City coordinates mapping - Major US cities + international cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // Major US Cities (50+ largest metros)
  "New York": { lat: 40.7128, lng: -74.0060 },
  "Los Angeles": { lat: 34.0522, lng: -118.2437 },
  "Chicago": { lat: 41.8781, lng: -87.6298 },
  "Houston": { lat: 29.7604, lng: -95.3698 },
  "Phoenix": { lat: 33.4484, lng: -112.0740 },
  "Philadelphia": { lat: 39.9526, lng: -75.1652 },
  "San Antonio": { lat: 29.4241, lng: -98.4936 },
  "San Diego": { lat: 32.7157, lng: -117.1611 },
  "Dallas": { lat: 32.7767, lng: -96.7970 },
  "San Jose": { lat: 37.3382, lng: -121.8863 },
  "Austin": { lat: 30.2672, lng: -97.7431 },
  "Jacksonville": { lat: 30.3322, lng: -81.6557 },
  "Fort Worth": { lat: 32.7555, lng: -97.3308 },
  "Columbus": { lat: 39.9612, lng: -82.9988 },
  "San Francisco": { lat: 37.7749, lng: -122.4194 },
  "Charlotte": { lat: 35.2271, lng: -80.8431 },
  "Indianapolis": { lat: 39.7684, lng: -86.1581 },
  "Seattle": { lat: 47.6062, lng: -122.3321 },
  "Denver": { lat: 39.7392, lng: -104.9903 },
  "Washington": { lat: 38.9072, lng: -77.0369 },
  "Boston": { lat: 42.3601, lng: -71.0589 },
  "Nashville": { lat: 36.1627, lng: -86.7816 },
  "Detroit": { lat: 42.3314, lng: -83.0458 },
  "Portland": { lat: 45.5152, lng: -122.6784 },
  "Las Vegas": { lat: 36.1699, lng: -115.1398 },
  "Memphis": { lat: 35.1495, lng: -90.0490 },
  "Baltimore": { lat: 39.2904, lng: -76.6122 },
  "Milwaukee": { lat: 43.0389, lng: -87.9065 },
  "Albuquerque": { lat: 35.0844, lng: -106.6504 },
  "Tucson": { lat: 32.2226, lng: -110.9747 },
  "Fresno": { lat: 36.7378, lng: -119.7871 },
  "Mesa": { lat: 33.4152, lng: -111.8315 },
  "Sacramento": { lat: 38.5816, lng: -121.4944 },
  "Atlanta": { lat: 33.7490, lng: -84.3880 },
  "Kansas City": { lat: 39.0997, lng: -94.5786 },
  "Colorado Springs": { lat: 38.8339, lng: -104.8214 },
  "Miami": { lat: 25.7617, lng: -80.1918 },
  "Raleigh": { lat: 35.7796, lng: -78.6382 },
  "Omaha": { lat: 41.2565, lng: -95.9345 },
  "Long Beach": { lat: 33.7701, lng: -118.1937 },
  "Virginia Beach": { lat: 36.8529, lng: -75.9780 },
  "Oakland": { lat: 37.8044, lng: -122.2712 },
  "Minneapolis": { lat: 44.9778, lng: -93.2650 },
  "Tampa": { lat: 27.9506, lng: -82.4572 },
  "Tulsa": { lat: 36.1540, lng: -95.9928 },
  "New Orleans": { lat: 29.9511, lng: -90.0715 },
  "Cleveland": { lat: 41.4993, lng: -81.6944 },
  "Honolulu": { lat: 21.3099, lng: -157.8581 },
  "Santa Ana": { lat: 33.7455, lng: -117.8677 },
  "Anaheim": { lat: 33.8366, lng: -117.9143 },
  "Aurora": { lat: 39.7294, lng: -104.8319 },
  "Bakersfield": { lat: 35.3733, lng: -119.0187 },
  "Riverside": { lat: 33.9806, lng: -117.3755 },
  "Corpus Christi": { lat: 27.8006, lng: -97.3964 },
  "Lexington": { lat: 38.0406, lng: -84.5037 },
  "Pittsburgh": { lat: 40.4406, lng: -79.9959 },
  "Anchorage": { lat: 61.2181, lng: -149.9003 },
  "Stockton": { lat: 37.9577, lng: -121.2908 },
  "Cincinnati": { lat: 39.1031, lng: -84.5120 },
  "Saint Paul": { lat: 44.9537, lng: -93.0900 },
  "Toledo": { lat: 41.6528, lng: -83.5379 },
  "Newark": { lat: 40.7357, lng: -74.1724 },
  "Greensboro": { lat: 36.0726, lng: -79.7920 },
  "Buffalo": { lat: 42.8864, lng: -78.8784 },
  "Plano": { lat: 33.0198, lng: -96.6989 },
  "Lincoln": { lat: 40.8136, lng: -96.7026 },
  "Henderson": { lat: 36.0395, lng: -114.9817 },
  "Fort Wayne": { lat: 41.0793, lng: -85.1394 },
  "Jersey City": { lat: 40.7178, lng: -74.0431 },
  "St. Louis": { lat: 38.6270, lng: -90.1994 },
  "Norfolk": { lat: 36.8508, lng: -76.2859 },
  "Chandler": { lat: 33.3062, lng: -111.8413 },
  "Orlando": { lat: 28.5383, lng: -81.3792 },
  "Boise": { lat: 43.6150, lng: -116.2023 },
  "Cheyenne": { lat: 41.1400, lng: -104.8202 },
  "Montgomery": { lat: 32.3792, lng: -86.3077 },
  "Juneau": { lat: 58.3019, lng: -134.4197 },
  "Little Rock": { lat: 34.7465, lng: -92.2896 },
  "Hartford": { lat: 41.7658, lng: -72.6734 },
  "Dover": { lat: 39.1582, lng: -75.5244 },
  "Tallahassee": { lat: 30.4383, lng: -84.2807 },
  "Springfield": { lat: 39.7817, lng: -89.6501 },
  "Des Moines": { lat: 41.5868, lng: -93.6250 },
  "Topeka": { lat: 39.0473, lng: -95.6752 },
  "Wichita": { lat: 37.6872, lng: -97.3301 },
  "Louisville": { lat: 38.2527, lng: -85.7585 },
  "Frankfort": { lat: 38.2009, lng: -84.8733 },
  "Baton Rouge": { lat: 30.4515, lng: -91.1871 },
  "Augusta": { lat: 44.3106, lng: -69.7795 },
  "Annapolis": { lat: 38.9784, lng: -76.4922 },
  "Lansing": { lat: 42.7325, lng: -84.5555 },
  "Jackson": { lat: 32.2988, lng: -90.1848 },
  "Jefferson City": { lat: 38.5767, lng: -92.1735 },
  "Helena": { lat: 46.5891, lng: -112.0391 },
  "Billings": { lat: 45.7833, lng: -108.5007 },
  "Carson City": { lat: 39.1638, lng: -119.7674 },
  "Concord": { lat: 43.2081, lng: -71.5376 },
  "Trenton": { lat: 40.2206, lng: -74.7597 },
  "Santa Fe": { lat: 35.6870, lng: -105.9378 },
  "Albany": { lat: 42.6526, lng: -73.7562 },
  "Bismarck": { lat: 46.8083, lng: -100.7837 },
  "Fargo": { lat: 46.8772, lng: -96.7898 },
  "Oklahoma City": { lat: 35.4676, lng: -97.5164 },
  "Salem": { lat: 44.9429, lng: -123.0351 },
  "Harrisburg": { lat: 40.2732, lng: -76.8867 },
  "Providence": { lat: 41.8240, lng: -71.4128 },
  "Columbia": { lat: 34.0007, lng: -81.0348 },
  "Charleston": { lat: 32.7765, lng: -79.9311 },
  "Pierre": { lat: 44.3683, lng: -100.3510 },
  "Sioux Falls": { lat: 43.5446, lng: -96.7311 },
  "Salt Lake City": { lat: 40.7608, lng: -111.8910 },
  "Montpelier": { lat: 44.2601, lng: -72.5754 },
  "Burlington": { lat: 44.4759, lng: -73.2121 },
  "Richmond": { lat: 37.5407, lng: -77.4360 },
  "Olympia": { lat: 47.0379, lng: -122.9007 },
  "Charleston WV": { lat: 38.3498, lng: -81.6326 },
  "Madison": { lat: 43.0731, lng: -89.4012 },
  // International Cities
  "Vancouver": { lat: 49.2827, lng: -123.1207 },
  "Toronto": { lat: 43.6532, lng: -79.3832 },
  "Mexico City": { lat: 19.4326, lng: -99.1332 },
  "Tijuana": { lat: 32.5149, lng: -117.0382 },
  "Bogotá": { lat: 4.7110, lng: -74.0721 },
  "Lima": { lat: -12.0464, lng: -77.0428 },
  "São Paulo": { lat: -23.5505, lng: -46.6333 },
  "Buenos Aires": { lat: -34.6037, lng: -58.3816 },
  "Rio de Janeiro": { lat: -22.9068, lng: -43.1729 },
  "Santiago": { lat: -33.4489, lng: -70.6693 },
  "London": { lat: 51.5074, lng: -0.1278 },
  "Paris": { lat: 48.8566, lng: 2.3522 },
  "Berlin": { lat: 52.5200, lng: 13.4050 },
  "Rome": { lat: 41.9028, lng: 12.4964 },
  "Madrid": { lat: 40.4168, lng: -3.7038 },
  "Barcelona": { lat: 41.3851, lng: 2.1734 },
  "Amsterdam": { lat: 52.3676, lng: 4.9041 },
  "Brussels": { lat: 50.8503, lng: 4.3517 },
  "Vienna": { lat: 48.2082, lng: 16.3738 },
  "Athens": { lat: 37.9838, lng: 23.7275 },
  "Moscow": { lat: 55.7558, lng: 37.6173 },
  "Istanbul": { lat: 41.0082, lng: 28.9784 },
  "Dubai": { lat: 25.2048, lng: 55.2708 },
  "Lagos": { lat: 6.5244, lng: 3.3792 },
  "Accra": { lat: 5.6037, lng: -0.1870 },
  "Casablanca": { lat: 33.5731, lng: -7.5898 },
  "Dakar": { lat: 14.7167, lng: -17.4677 },
  "Cairo": { lat: 30.0444, lng: 31.2357 },
  "Johannesburg": { lat: -26.2041, lng: 28.0473 },
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
  "Shanghai": { lat: 31.2304, lng: 121.4737 },
  "Manila": { lat: 14.5995, lng: 120.9842 },
  "Tokyo": { lat: 35.6762, lng: 139.6503 },
  "Seoul": { lat: 37.5665, lng: 126.9780 },
  "Sydney": { lat: -33.8688, lng: 151.2093 },
  "Melbourne": { lat: -37.8136, lng: 144.9631 },
  "Brisbane": { lat: -27.4698, lng: 153.0251 },
  "Auckland": { lat: -36.8485, lng: 174.7633 },
  "Wellington": { lat: -41.2865, lng: 174.7762 },
  "Pago Pago": { lat: -14.2756, lng: -170.7025 },
  "Rarotonga": { lat: -21.2367, lng: -159.7777 },
  "Fiji": { lat: -17.7134, lng: 178.0650 },
  "Noumea": { lat: -22.2758, lng: 166.4572 },
};

interface Loc8DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: string[];
  onValueChange?: (cities: string[]) => void;
  mode?: 'single' | 'multiple';
  onConfirm?: (selectedCities: string[]) => void;
  title?: string;
  description?: string;
}

export const Loc8Dialog = ({
  open,
  onOpenChange,
  value = [],
  onValueChange,
  mode = 'multiple',
  onConfirm,
  title = "Select Location",
  description = "Choose your city or cities from the interactive globe"
}: Loc8DialogProps) => {
  const globeEl = useRef<any>();
  const [selectedCities, setSelectedCities] = useState<string[]>(value);
  const [isReady, setIsReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const MAX_LOCATIONS = 2;

  // Sync with external value
  useEffect(() => {
    setSelectedCities(value);
  }, [value]);

  // Memoized points data for selected cities
  const pointsData = useMemo(() => {
    return selectedCities.map(city => ({
      lat: cityCoordinates[city]?.lat || 0,
      lng: cityCoordinates[city]?.lng || 0,
      size: 0.8,
      color: 'hsl(var(--primary))',
      city: city
    }));
  }, [selectedCities]);

  useEffect(() => {
    if (!globeEl.current || !open) return;

    // Set initial camera position
    globeEl.current.pointOfView({ lat: 20, lng: -40, altitude: 2.5 }, 0);
    
    // Enable auto-rotation
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;
    
    setIsReady(true);
  }, [open]);

  const selectCity = (city: string) => {
    let newSelection: string[];
    
    if (mode === 'single') {
      newSelection = [city];
    } else {
      if (selectedCities.includes(city)) {
        newSelection = selectedCities.filter(c => c !== city);
      } else {
        if (selectedCities.length >= MAX_LOCATIONS) {
          toast.error(`Maximum ${MAX_LOCATIONS} locations allowed`);
          return;
        }
        newSelection = [...selectedCities, city];
      }
    }
    
    setSelectedCities(newSelection);
    onValueChange?.(newSelection);
    setSearchQuery("");
  };

  const removeCity = (city: string) => {
    const newSelection = selectedCities.filter(c => c !== city);
    setSelectedCities(newSelection);
    onValueChange?.(newSelection);
  };

  const handleConfirm = () => {
    onConfirm?.(selectedCities);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedCities(value);
    onOpenChange(false);
  };

  // Filter cities based on search query for mid-canvas display
  const allCities = Object.keys(cityCoordinates);
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allCities
      .filter(city => city.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 8); // Limit to 8 for clean mid-canvas display
  }, [searchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-full p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-border/50 bg-background/95 backdrop-blur-sm">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Globe Container */}
        <div className="relative flex-1 bg-gradient-to-br from-background/10 via-primary/5 to-primary/10 overflow-hidden">
          <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundColor="rgba(0,0,0,0)"
            showAtmosphere={true}
            atmosphereColor="hsl(var(--primary))"
            atmosphereAltitude={0.15}
            width={typeof window !== 'undefined' ? window.innerWidth : 800}
            height={typeof window !== 'undefined' ? window.innerHeight - 200 : 600}
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

          {/* Mid-Canvas Search Results */}
          {searchQuery.trim() && filteredCities.length > 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
              <div className="bg-background/20 backdrop-blur-md border border-primary/30 rounded-2xl p-3 md:p-4 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300 pointer-events-auto">
                <div className="flex flex-wrap gap-2 md:gap-2.5 justify-center max-w-xs md:max-w-md">
                  {filteredCities.map((city) => (
                    <Badge
                      key={city}
                      variant="secondary"
                      className="cursor-pointer bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/80 hover:text-primary-foreground border border-primary/20 transition-all duration-200 text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2 min-h-[44px] flex items-center justify-center"
                      onClick={() => selectCity(city)}
                    >
                      {city}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Bar - Prominent & Standalone */}
          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-lg">
            <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
              {/* Selected Cities Display */}
              {selectedCities.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center px-2">
                  {selectedCities.map((city) => (
                    <Badge
                      key={city}
                      variant="default"
                      className="bg-primary text-primary-foreground text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2 cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => removeCity(city)}
                    >
                      {city}
                      <X className="ml-1.5 h-3 w-3 md:h-4 md:w-4" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <div className="relative px-2">
                <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-primary z-10 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search for cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredCities.length > 0) {
                      selectCity(filteredCities[0]);
                    }
                  }}
                  className="w-full pl-12 md:pl-16 pr-4 md:pr-6 bg-background/90 backdrop-blur-lg border-2 border-primary/30 text-base md:text-xl h-14 md:h-16 font-medium focus:border-primary/60 rounded-xl shadow-2xl transition-all"
                  style={{ fontSize: '16px' }} // Prevent iOS zoom
                />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute top-4 left-4 text-xs md:text-sm text-muted-foreground/70 z-10 bg-background/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
            <p className="hidden md:block">Drag to rotate • Scroll to zoom</p>
            <p className="md:hidden">Drag to rotate</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/50 bg-background/95 backdrop-blur-sm flex justify-between gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={selectedCities.length === 0}
            className={selectedCities.length === 0 ? "opacity-40 cursor-not-allowed" : ""}
          >
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
