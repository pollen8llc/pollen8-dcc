import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewLevel = "world" | "usa" | "state";

interface ViewState {
  level: ViewLevel;
  selectedCountry?: string;
  selectedState?: string;
}

interface Eco8WorldMapProps {
  communities?: any[];
  className?: string;
}

const majorCities = [
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "London", coordinates: [-0.1276, 51.5074] },
  { name: "Tokyo", coordinates: [139.6917, 35.6895] },
  { name: "Sydney", coordinates: [151.2093, -33.8688] },
  { name: "Dubai", coordinates: [55.2708, 25.2048] },
];

const cityConnections = [
  [[-74.006, 40.7128], [-0.1276, 51.5074]], // NY to London
  [[-0.1276, 51.5074], [55.2708, 25.2048]], // London to Dubai
  [[55.2708, 25.2048], [139.6917, 35.6895]], // Dubai to Tokyo
  [[139.6917, 35.6895], [151.2093, -33.8688]], // Tokyo to Sydney
];

const Eco8WorldMap = ({ communities = [], className = "" }: Eco8WorldMapProps) => {
  const [viewState, setViewState] = useState<ViewState>({ level: "world" });

  const getMapConfig = () => {
    switch (viewState.level) {
      case "usa":
        return {
          projection: "geoAlbersUsa",
          scale: 1000,
          center: [-96, 38] as [number, number],
          url: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
        };
      case "state":
        return {
          projection: "geoAlbersUsa",
          scale: 3000,
          center: [-96, 38] as [number, number],
          url: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
        };
      default:
        return {
          projection: "geoMercator",
          scale: 147,
          center: [0, 20] as [number, number],
          url: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
        };
    }
  };

  const handleGeographyClick = (geo: any) => {
    if (viewState.level === "world" && geo.properties.name === "United States of America") {
      setViewState({ level: "usa", selectedCountry: "United States of America" });
    } else if (viewState.level === "usa") {
      setViewState({
        level: "state",
        selectedCountry: "United States of America",
        selectedState: geo.properties.name,
      });
    }
  };

  const handleBack = () => {
    if (viewState.level === "state") {
      setViewState({ level: "usa", selectedCountry: "United States of America" });
    } else if (viewState.level === "usa") {
      setViewState({ level: "world" });
    }
  };

  const getTitle = () => {
    if (viewState.level === "state") return viewState.selectedState;
    if (viewState.level === "usa") return "United States";
    return "Global Community Network";
  };

  const getSubtitle = () => {
    if (viewState.level === "state") return "State View";
    if (viewState.level === "usa") return "Click on a state to zoom in";
    return "Click on USA to explore";
  };

  const config = getMapConfig();
  const totalCommunities = communities.length;
  const totalMembers = communities.reduce((sum, c) => sum + (c.memberCount || 0), 0);

  return (
    <div className={`relative w-full h-[300px] md:h-[400px] rounded-2xl backdrop-blur-md bg-card/40 border-0 overflow-hidden ${className}`}>
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
          className="absolute top-4 right-4 md:top-8 md:right-8 z-10 backdrop-blur-md bg-card/60 border-primary/20 hover:bg-card/80"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}

      {/* Title Overlay */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
          {getTitle()}
        </h2>
        <p className="text-xs md:text-base text-muted-foreground mt-1">
          {getSubtitle()}
        </p>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 z-10">
        <div className="flex flex-wrap gap-2 md:gap-6 justify-center">
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-2 md:p-4 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Communities</p>
            <p className="text-lg md:text-2xl font-bold text-primary">{totalCommunities}</p>
          </div>
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-2 md:p-4 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Active Members</p>
            <p className="text-lg md:text-2xl font-bold text-primary">{totalMembers}</p>
          </div>
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-2 md:p-4 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Global Reach</p>
            <p className="text-lg md:text-2xl font-bold text-primary">
              {viewState.level === "world" ? "5" : viewState.level === "usa" ? "50" : "1"}
            </p>
          </div>
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-2 md:p-4 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Growth</p>
            <p className="text-lg md:text-2xl font-bold text-primary">+12%</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full h-full p-2 md:p-0">
        <ComposableMap
          projection={config.projection as any}
          projectionConfig={{
            scale: config.scale,
            center: config.center,
          }}
          className="w-full h-full"
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
                        fill: "hsl(var(--primary) / 0.95)",
                        stroke: "hsl(var(--primary) / 0.3)",
                        strokeWidth: 0.5,
                        outline: "none",
                        transition: "all 0.2s ease-in-out",
                      },
                      hover: {
                        fill: "hsl(var(--primary))",
                        stroke: "hsl(var(--primary) / 0.5)",
                        strokeWidth: 0.75,
                        outline: "none",
                        cursor: viewState.level !== "state" ? "pointer" : "default",
                      },
                      pressed: {
                        fill: "hsl(var(--primary) / 0.8)",
                        stroke: "hsl(var(--primary) / 0.3)",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                    }}
                  />
                ))
            }
          </Geographies>

          {/* City Markers and Connections - World View Only */}
          {viewState.level === "world" && (
            <>
              {/* Connection Lines */}
              {cityConnections.map((connection, i) => (
                <Line
                  key={`line-${i}`}
                  from={connection[0]}
                  to={connection[1]}
                  stroke="hsl(var(--primary) / 0.4)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              ))}

              {/* City Markers */}
              {majorCities.map((city) => (
                <Marker key={city.name} coordinates={city.coordinates as [number, number]}>
                  <g>
                    {/* Pulse Ring */}
                    <circle
                      r={8}
                      fill="hsl(var(--primary) / 0.3)"
                      className="animate-pulse"
                    />
                    {/* Outer Ring */}
                    <circle
                      r={5}
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                    {/* Inner Core */}
                    <circle
                      r={2}
                      fill="hsl(var(--background))"
                    />
                  </g>
                </Marker>
              ))}
            </>
          )}
        </ComposableMap>
      </div>
    </div>
  );
};

export default Eco8WorldMap;
