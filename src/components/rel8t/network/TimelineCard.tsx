import { MockInteraction, MockStrategyAction, getActionTemplate, getChannel, getTone, getWarmthLevel } from "@/data/mockNetworkData";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { 
  Calendar, MapPin, MessageSquare, CheckCircle2, Circle, 
  Clock, Flame, Sun, Minus, Snowflake, ArrowUpRight
} from "lucide-react";

interface TimelineCardProps {
  type: 'past' | 'future';
  data: MockInteraction | MockStrategyAction;
}

export function TimelineCard({ type, data }: TimelineCardProps) {
  if (type === 'past') {
    const interaction = data as MockInteraction;
    const warmthData = getWarmthLevel(interaction.warmth);
    
    const warmthIcons: Record<string, React.ComponentType<{ className?: string }>> = {
      cold: Snowflake,
      neutral: Minus,
      warm: Sun,
      enthusiastic: Flame
    };
    const WarmthIcon = warmthIcons[interaction.warmth] || Minus;

    return (
      <div className="glass-card p-4 border-l-4" style={{ borderLeftColor: warmthData?.color }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {format(parseISO(interaction.date), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-1" style={{ color: warmthData?.color }}>
            <WarmthIcon className="h-4 w-4" />
            <span className="text-xs">{warmthData?.label}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">{interaction.location}</span>
        </div>
        
        <div className="flex items-start gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-sm text-muted-foreground">{interaction.topics}</p>
        </div>
        
        {interaction.strengthened && (
          <Badge variant="outline" className="text-green-400 border-green-400/30 bg-green-400/10">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            Relationship Strengthened
          </Badge>
        )}
      </div>
    );
  }

  // Future action
  const action = data as MockStrategyAction;
  const actionTemplate = getActionTemplate(action.type);
  const channel = getChannel(action.channel);
  const tone = getTone(action.tone);

  return (
    <div className={cn(
      "glass-card p-4 border-l-4",
      action.status === 'completed' ? "border-l-green-500 opacity-60" : "border-l-primary"
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {format(parseISO(action.scheduledDate), 'MMM d, yyyy')}
          </span>
        </div>
        {action.status === 'completed' ? (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-primary" />
        )}
      </div>
      
      <h4 className="font-medium mb-2">{actionTemplate?.label}</h4>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="text-xs">
          {channel?.label}
        </Badge>
        <Badge 
          variant="outline" 
          className="text-xs"
          style={{ 
            borderColor: `${tone?.color}50`,
            color: tone?.color 
          }}
        >
          {tone?.label}
        </Badge>
      </div>
    </div>
  );
}
