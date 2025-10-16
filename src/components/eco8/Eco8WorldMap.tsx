import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

interface Eco8WorldMapProps {
  communities?: any[];
  className?: string;
}

const Eco8WorldMap = ({ communities = [], className = "" }: Eco8WorldMapProps) => {
  // Filter communities with valid coordinates
  const communitiesWithCoords = communities.filter(
    c => c.latitude && c.longitude
  );
  
  const totalCommunities = communities.length;
  const totalMembers = communities.reduce((sum, c) => sum + (c.member_count || 0), 0);
  const uniqueLocations = new Set(communities.map(c => c.location)).size;

  return (
    <div className={`relative w-full h-[300px] md:h-[400px] rounded-2xl backdrop-blur-lg bg-card/60 border-0 overflow-hidden ${className}`}>
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-50"
        style={{
          background: 'linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--background)), hsl(var(--primary) / 0.05))'
        }}
      />
      
      {/* Glassmorphic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50" />

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-10">
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-3 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Communities</p>
            <p className="text-base md:text-xl font-bold text-primary">{totalCommunities}</p>
          </div>
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-3 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Members</p>
            <p className="text-base md:text-xl font-bold text-primary">{totalMembers}</p>
          </div>
          <div className="backdrop-blur-md bg-card/60 rounded-xl p-3 border border-primary/20 transition-all duration-300 hover:scale-105">
            <p className="text-xs text-muted-foreground">Locations</p>
            <p className="text-base md:text-xl font-bold text-primary">{uniqueLocations}</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full h-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 130,
            center: [0, 10],
          }}
          width={800}
          height={400}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: "hsl(var(--muted-foreground) / 0.15)",
                      stroke: "hsl(var(--border) / 0.5)",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "hsl(var(--muted-foreground) / 0.15)",
                      stroke: "hsl(var(--border) / 0.5)",
                      strokeWidth: 0.5,
                      outline: "none",
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
          {communitiesWithCoords.map((community) => (
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
