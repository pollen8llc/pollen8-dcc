import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewLevel = "world" | "usa" | "state";

interface ViewState {
  level: ViewLevel;
  selectedState?: string;
}

interface Eco8WorldMapProps {
  communities?: any[];
  className?: string;
}

const Eco8WorldMap = ({ communities = [], className = "" }: Eco8WorldMapProps) => {
  const [viewState, setViewState] = useState<ViewState>({ level: "world" });
  
  // Filter communities with valid coordinates
  const communitiesWithCoords = communities.filter(
    c => c.latitude && c.longitude
  );
  
  const totalCommunities = communities.length;
  const totalMembers = communities.reduce((sum, c) => sum + (c.member_count || 0), 0);
  const uniqueLocations = new Set(communities.map(c => c.location)).size;

  const getMapConfig = () => {
    switch (viewState.level) {
      case "usa":
        return {
          projection: "geoAlbersUsa",
          scale: 800,
          center: [-96, 38] as [number, number],
          url: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
        };
      case "state":
        return {
          projection: "geoAlbersUsa",
          scale: 2500,
          center: [-96, 38] as [number, number],
          url: "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json",
        };
      default:
        return {
          projection: "geoMercator",
          scale: 130,
          center: [0, 10] as [number, number],
          url: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
        };
    }
  };

  const handleGeographyClick = (geo: any) => {
    if (viewState.level === "world" && geo.properties.name === "United States of America") {
      setViewState({ level: "usa" });
    } else if (viewState.level === "usa") {
      setViewState({ level: "state", selectedState: geo.properties.name });
    }
  };

  const handleBack = () => {
    if (viewState.level === "state") {
      setViewState({ level: "usa" });
    } else if (viewState.level === "usa") {
      setViewState({ level: "world" });
    }
  };

  const config = getMapConfig();

  return (
    <div className={`relative w-full h-[350px] md:h-[400px] rounded-2xl backdrop-blur-lg bg-card/60 border-0 overflow-hidden ${className}`}>
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--background)), hsl(var(--primary) / 0.05))'
        }}
      />
      
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50" />

      {/* Back Button */}
      {viewState.level !== "world" && (
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 z-10 backdrop-blur-md bg-card/60 border-primary/20 hover:bg-card/80"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}

      {/* Stats Overlay */}
      <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 z-10">
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-2.5 md:p-3 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Communities</p>
            <p className="text-base md:text-xl font-bold text-primary">{totalCommunities}</p>
          </div>
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-2.5 md:p-3 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Members</p>
            <p className="text-base md:text-xl font-bold text-primary">{totalMembers}</p>
          </div>
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-2.5 md:p-3 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Locations</p>
            <p className="text-base md:text-xl font-bold text-primary">{uniqueLocations}</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full h-full flex items-center justify-center py-12 md:py-8">
        <ComposableMap
          projection={config.projection as any}
          projectionConfig={{
            scale: config.scale,
            center: config.center,
          }}
          width={800}
          height={400}
          style={{ width: '100%', height: '100%', maxHeight: '100%' }}
        >
          <Geographies geography={config.url}>
            {({ geographies }) =>
              geographies
                .filter((geo) => {
                  if (viewState.level === "state") {
                    return geo.properties.name === viewState.selectedState;
                  }
                  return true;
                })
                .map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleGeographyClick(geo)}
                    style={{
                      default: {
                        fill: "hsl(var(--muted-foreground) / 0.15)",
                        stroke: "hsl(var(--border) / 0.5)",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: viewState.level !== "state" ? "pointer" : "default",
                      },
                      hover: {
                        fill: "hsl(var(--muted-foreground) / 0.2)",
                        stroke: "hsl(var(--border) / 0.7)",
                        strokeWidth: 0.75,
                        outline: "none",
                        cursor: viewState.level !== "state" ? "pointer" : "default",
                      },
                      pressed: {
                        fill: "hsl(var(--muted-foreground) / 0.15)",
                        stroke: "hsl(var(--border) / 0.5)",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                    }}
                  />
                ))
            }
          </Geographies>

          {/* Community Markers - White nodes */}
          {viewState.level === "world" && communitiesWithCoords.map((community) => (
            <Marker 
              key={community.id} 
              coordinates={[community.longitude, community.latitude]}
            >
              <g>
                {/* Outer glow - white pulse */}
                <circle
                  r={6}
                  fill="rgba(255, 255, 255, 0.2)"
                  className="animate-pulse"
                />
                {/* Main node - white */}
                <circle
                  r={4}
                  fill="white"
                  stroke="hsl(var(--primary))"
                  strokeWidth={1.5}
                />
                {/* Inner core - primary color */}
                <circle
                  r={1.5}
                  fill="hsl(var(--primary))"
                />
              </g>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
};

export default Eco8WorldMap;
