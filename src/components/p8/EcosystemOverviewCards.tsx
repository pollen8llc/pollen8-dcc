import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe3D } from "./Globe3D";
import { RadarChart } from "@/components/ui/radar-chart";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
      {/* Card 1: Locations */}
      <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Globe on left */}
            <div className="flex-shrink-0">
              <Globe3D cities={selectedCities} width={140} height={140} />
            </div>
            
            {/* Badges on right */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Locations</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCities.map((city, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20"
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
      <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Radar chart on left */}
            <div className="flex-shrink-0">
              <RadarChart 
                data={demographicsData} 
                width={140} 
                height={140}
                strokeColor="hsl(var(--primary))"
                fillColor="hsl(var(--primary))"
              />
            </div>
            
            {/* Badges on right */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Demographics</h3>
              </div>
              <div className="space-y-2">
                {demographicsData.map((demo, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      Age {demo.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{demo.importance}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Culture */}
      <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Psychographic chart on left */}
            <div className="flex-shrink-0">
              <RadarChart 
                data={cultureData} 
                width={140} 
                height={140}
                strokeColor="hsl(var(--primary))"
                fillColor="hsl(var(--primary))"
              />
            </div>
            
            {/* Badges on right */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Culture</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cultureBadges.map((badge, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 space-y-1">
                {cultureData.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground">
                    {item.category}: {item.importance}%
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Network */}
      <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Ring chart on left */}
            <div className="flex-shrink-0 relative" style={{ width: 140, height: 140 }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                <defs>
                  <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                
                {/* Background ring */}
                <circle
                  cx="70"
                  cy="70"
                  r="50"
                  fill="none"
                  stroke="hsl(var(--primary) / 0.1)"
                  strokeWidth="20"
                />
                
                {/* Active ring */}
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
                  style={{
                    filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))'
                  }}
                />
                
                {/* Center text */}
                <text
                  x="70"
                  y="65"
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {Math.round(activePercentage)}%
                </text>
                <text
                  x="70"
                  y="80"
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="10"
                >
                  Active
                </text>
              </svg>
            </div>
            
            {/* Stats on right */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Network className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Network</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Total Contacts</span>
                    <Badge variant="outline" className="border-primary/20">
                      {totalContacts.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Active Relations</span>
                    <Badge 
                      variant="secondary" 
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {activeRelationships.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    {Math.round(activePercentage)}% engagement rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcosystemOverviewCards;
