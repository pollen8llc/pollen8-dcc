import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe3D } from "./Globe3D";
import { CompactRadarChart } from "@/components/ui/compact-radar-chart";
import { MapPin, Users, Brain, Network } from "lucide-react";

const EcosystemOverviewCards = () => {
  // Mock data for locations
  const selectedCities = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
  ];

  // Mock data for demographics radar
  const demographicsData = [
    { category: "18-24", importance: 35, color: "hsl(var(--primary))" },
    { category: "25-34", importance: 45, color: "hsl(var(--primary))" },
    { category: "35-44", importance: 15, color: "hsl(var(--primary))" },
    { category: "45+", importance: 5, color: "hsl(var(--primary))" },
  ];

  // Mock data for culture/psychographics
  const cultureData = [
    { category: "Interest", importance: 75, color: "hsl(var(--primary))" },
    { category: "Lifestyle", importance: 60, color: "hsl(var(--primary))" },
    { category: "Values", importance: 85, color: "hsl(var(--primary))" },
    { category: "Attitudes", importance: 70, color: "hsl(var(--primary))" },
    { category: "Personality", importance: 65, color: "hsl(var(--primary))" },
  ];

  const cultureBadges = ["Innovation", "Community", "Sustainability", "Growth"];

  // Mock data for network ring chart
  const totalContacts = 1247;
  const activeRelationships = 856;
  const activePercentage = (activeRelationships / totalContacts) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {/* Card 1: Locations */}
      <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Globe on left */}
            <div className="flex-shrink-0">
              <Globe3D cities={selectedCities} width={140} height={140} />
            </div>
            
            {/* Content on right */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Locations</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCities.map((city, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5"
                  >
                    {city.split(',')[0]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Demographics */}
      <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Radar chart on left */}
            <div className="flex-shrink-0">
              <CompactRadarChart 
                data={demographicsData} 
                width={140} 
                height={140}
                strokeColor="hsl(var(--primary))"
                fillColor="hsl(var(--primary))"
              />
            </div>
            
            {/* Content on right */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Demographics</h3>
              </div>
              <div className="space-y-1.5">
                {demographicsData.map((demo, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5"
                    >
                      {demo.category}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">{demo.importance}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Culture */}
      <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Psychographic chart on left */}
            <div className="flex-shrink-0">
              <CompactRadarChart 
                data={cultureData} 
                width={140} 
                height={140}
                strokeColor="hsl(var(--primary))"
                fillColor="hsl(var(--primary))"
              />
            </div>
            
            {/* Content on right */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Culture</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cultureBadges.map((badge, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {cultureData.slice(0, 3).map((item, idx) => (
                  <span key={idx}>{item.category} {item.importance}%</span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Network */}
      <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Ring chart on left */}
            <div className="flex-shrink-0 relative" style={{ width: 140, height: 140 }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <defs>
                  <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                
                <circle
                  cx="70"
                  cy="70"
                  r="50"
                  fill="none"
                  stroke="hsl(var(--primary) / 0.1)"
                  strokeWidth="20"
                />
                
                <circle
                  cx="70"
                  cy="70"
                  r="50"
                  fill="none"
                  stroke="url(#ring-gradient)"
                  strokeWidth="20"
                  strokeDasharray={`${(activePercentage / 100) * 2 * Math.PI * 50} ${2 * Math.PI * 50}`}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                  style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' }}
                />
                
                <text
                  x="70"
                  y="70"
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="24"
                  fontWeight="bold"
                  dominantBaseline="middle"
                >
                  {Math.round(activePercentage)}%
                </text>
              </svg>
            </div>
            
            {/* Content on right */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Network</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <Badge variant="outline" className="border-primary/20 text-xs px-2 py-0.5">
                    {totalContacts.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Active</span>
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 text-xs px-2 py-0.5"
                  >
                    {activeRelationships.toLocaleString()}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                {Math.round(activePercentage)}% engagement rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcosystemOverviewCards;
