import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MockInteraction, getWarmthLevel } from "@/data/mockNetworkData";
import { Clock, ChevronDown, ChevronUp, MapPin, MessageSquare, CheckCircle2, Snowflake, Minus, Sun, Flame } from "lucide-react";
import { format, parseISO } from "date-fns";

const warmthIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  cold: Snowflake,
  neutral: Minus,
  warm: Sun,
  enthusiastic: Flame,
};

interface PastInteractionsProps {
  interactions: MockInteraction[];
}

export function PastInteractions({ interactions }: PastInteractionsProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Sort by date descending (most recent first)
  const sortedInteractions = [...interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="bg-card/60 backdrop-blur-md border-border/50">
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
            >
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Past Interactions
                <Badge variant="secondary" className="ml-2">
                  {interactions.length}
                </Badge>
              </CardTitle>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {sortedInteractions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No past interactions logged yet.
              </p>
            ) : (
              <div className="space-y-3">
                {sortedInteractions.map((interaction) => {
                  const warmthData = getWarmthLevel(interaction.warmth);
                  const WarmthIcon = warmthIcons[interaction.warmth] || Minus;
                  const date = parseISO(interaction.date);
                  
                  return (
                    <div 
                      key={interaction.id}
                      className="p-3 rounded-lg bg-muted/20 border border-border/20"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {format(date, 'MMM d, yyyy')}
                          </span>
                          <WarmthIcon 
                            className="h-4 w-4" 
                            style={{ color: warmthData?.color }}
                          />
                        </div>
                        {interaction.strengthened && (
                          <Badge 
                            variant="outline" 
                            className="text-xs text-green-600 border-green-600/30 bg-green-600/10"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Strengthened
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {interaction.location}
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MessageSquare className="h-3 w-3 mt-0.5" />
                          <span>{interaction.topics}</span>
                        </div>
                      </div>
                      
                      {interaction.followUp && (
                        <div className="mt-2 pt-2 border-t border-border/20">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Follow-up:</span> {interaction.followUp}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
