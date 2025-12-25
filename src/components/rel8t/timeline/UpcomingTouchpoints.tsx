import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MockStrategyAction,
  getActionTemplate,
  getChannel,
  getTone
} from "@/data/mockNetworkData";
import { Calendar, Check, Edit2, Send, Trash2, Coffee, FileText, MessageSquare, PartyPopper, UserPlus, ThumbsUp, Lightbulb } from "lucide-react";
import { format, parseISO } from "date-fns";

const actionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  coffee: Coffee,
  send_resource: FileText,
  soft_checkin: MessageSquare,
  invite_mixer: PartyPopper,
  introduce: UserPlus,
  compliment: ThumbsUp,
  co_create: Lightbulb,
  attend_event: Calendar,
  post_event: Send,
};

interface UpcomingTouchpointsProps {
  actions: MockStrategyAction[];
  onEdit: (action: MockStrategyAction) => void;
  onComplete: (actionId: string) => void;
  onSendInvite: (action: MockStrategyAction) => void;
  onDelete: (actionId: string) => void;
}

export function UpcomingTouchpoints({ 
  actions, 
  onEdit, 
  onComplete, 
  onSendInvite,
  onDelete 
}: UpcomingTouchpointsProps) {
  // Filter to only planned actions, sorted by date
  const upcomingActions = actions
    .filter(a => a.status === 'planned')
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const ActionIcon = ({ type }: { type: string }) => {
    const Icon = actionIcons[type] || Calendar;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Upcoming Touchpoints
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingActions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No upcoming touchpoints planned. Create one above!
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingActions.map((action) => {
              const actionTemplate = getActionTemplate(action.type);
              const channel = getChannel(action.channel);
              const tone = getTone(action.tone);
              const scheduledDate = parseISO(action.scheduledDate);
              
              return (
                <div 
                  key={action.id}
                  className="p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-lg bg-primary/10">
                        <ActionIcon type={action.type} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {format(scheduledDate, 'MMM d')}
                          </span>
                          <span className="text-sm text-foreground">
                            {actionTemplate?.label || action.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {channel?.label || action.channel}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                            style={{ 
                              backgroundColor: `${tone?.color}20`,
                              color: tone?.color 
                            }}
                          >
                            {tone?.label || action.tone}
                          </Badge>
                          {action.notes && (
                            <span className="text-xs text-muted-foreground">
                              "{action.notes}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border/30">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => onEdit(action)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={() => onSendInvite(action)}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Invite
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-green-600 hover:text-green-700"
                      onClick={() => onComplete(action.id)}
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Done
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={() => onDelete(action.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
