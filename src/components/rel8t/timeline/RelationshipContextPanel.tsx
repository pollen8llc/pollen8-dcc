import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  MockNetworkContact, 
  getConnectionStrength, 
  getWarmthLevel,
  getRelationshipType 
} from "@/data/mockNetworkData";
import { Target, TrendingUp, Calendar, Snowflake, Minus, Sun, Flame, Star } from "lucide-react";
import { differenceInDays } from "date-fns";

const warmthIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  cold: Snowflake,
  neutral: Minus,
  warm: Sun,
  enthusiastic: Flame,
};

interface RelationshipContextPanelProps {
  contact: MockNetworkContact;
}

export function RelationshipContextPanel({ contact }: RelationshipContextPanelProps) {
  const connectionStrengthData = getConnectionStrength(contact.connectionStrength);
  const relationshipTypeData = getRelationshipType(contact.relationshipType);
  const daysSinceLastContact = differenceInDays(new Date(), new Date(contact.lastInteraction));
  
  // Calculate average touchpoint frequency
  const interactions = contact.interactions || [];
  let avgFrequency = "N/A";
  if (interactions.length > 1) {
    const dates = interactions.map(i => new Date(i.date).getTime()).sort((a, b) => b - a);
    let totalDays = 0;
    for (let i = 0; i < dates.length - 1; i++) {
      totalDays += (dates[i] - dates[i + 1]) / (1000 * 60 * 60 * 24);
    }
    avgFrequency = `Every ${Math.round(totalDays / (dates.length - 1))} days`;
  }

  // Get most common warmth level from interactions
  const warmthCounts: Record<string, number> = {};
  interactions.forEach(i => {
    warmthCounts[i.warmth] = (warmthCounts[i.warmth] || 0) + 1;
  });
  const dominantWarmth = Object.entries(warmthCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';
  const warmthData = getWarmthLevel(dominantWarmth);
  const WarmthIcon = warmthIcons[dominantWarmth] || Minus;

  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Relationship Context
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Strength */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Connection Strength</span>
            <Badge 
              variant="outline" 
              style={{ 
                borderColor: connectionStrengthData?.color,
                color: connectionStrengthData?.color 
              }}
            >
              {connectionStrengthData?.label}
            </Badge>
          </div>
          <Progress 
            value={connectionStrengthData?.percentage || 0} 
            className="h-2"
          />
        </div>

        {/* Last Contact */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            Last Contact
          </span>
          <span className={`text-sm font-medium ${daysSinceLastContact > 30 ? 'text-destructive' : 'text-foreground'}`}>
            {daysSinceLastContact} days ago
          </span>
        </div>

        {/* Warmth Level */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Warmth Level</span>
          <div className="flex items-center gap-2">
            <WarmthIcon 
              className="h-4 w-4" 
              style={{ color: warmthData?.color }}
            />
            <span 
              className="text-sm font-medium"
              style={{ color: warmthData?.color }}
            >
              {warmthData?.label}
            </span>
          </div>
        </div>

        {/* Trust Rating */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Trust Rating</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= contact.trustRating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Relationship Type */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Relationship Type</span>
          <Badge 
            variant="secondary"
            style={{ 
              backgroundColor: `${relationshipTypeData?.color}20`,
              color: relationshipTypeData?.color 
            }}
          >
            {relationshipTypeData?.label}
          </Badge>
        </div>

        {/* Strategy/Intention */}
        {contact.strategy && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Relationship Goal</p>
                <p className="text-sm font-medium text-foreground">
                  {contact.strategy.intention}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-foreground">{interactions.length}</p>
            <p className="text-xs text-muted-foreground">Interactions</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <p className="text-sm font-bold text-foreground">{avgFrequency}</p>
            <p className="text-xs text-muted-foreground">Avg Frequency</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
