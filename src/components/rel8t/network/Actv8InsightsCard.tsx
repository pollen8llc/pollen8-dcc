import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BarChart3, Target, Zap, MessageSquare, ThumbsUp, ThumbsDown, Minus, TrendingUp, TrendingDown } from "lucide-react";
import { useContactAnalysis } from "@/hooks/useContactAnalysis";
import { getOutreachesByActv8Contact } from "@/services/rel8t/outreachService";
import { format, parseISO } from "date-fns";

interface Actv8InsightsCardProps {
  actv8ContactId: string;
  contactId: string;
  intentionNotes?: string;
}

const strengthColors: Record<string, string> = {
  spark: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  ember: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  flame: "bg-red-500/20 text-red-600 border-red-500/30",
  star: "bg-purple-500/20 text-purple-600 border-purple-500/30",
};

const strengthLabels: Record<string, string> = {
  spark: "Spark",
  ember: "Ember",
  flame: "Flame",
  star: "Star",
};

const outcomeIcons: Record<string, React.ReactNode> = {
  positive: <ThumbsUp className="h-3 w-3 text-emerald-500" />,
  neutral: <Minus className="h-3 w-3 text-amber-500" />,
  negative: <ThumbsDown className="h-3 w-3 text-red-500" />,
};

const rapportIcons: Record<string, React.ReactNode> = {
  strengthened: <TrendingUp className="h-3 w-3 text-emerald-500" />,
  maintained: <Minus className="h-3 w-3 text-amber-500" />,
  declined: <TrendingDown className="h-3 w-3 text-red-500" />,
};

export function Actv8InsightsCard({ actv8ContactId, contactId, intentionNotes }: Actv8InsightsCardProps) {
  const { data: analysis, isLoading: analysisLoading } = useContactAnalysis(contactId);
  
  // Fetch completed outreaches with feedback
  const { data: outreaches = [], isLoading: outreachesLoading } = useQuery({
    queryKey: ['actv8-outreach-feedback', actv8ContactId],
    queryFn: async () => {
      const all = await getOutreachesByActv8Contact(actv8ContactId);
      // Filter to completed outreaches with structured notes
      return all.filter(o => 
        o.status === 'completed' && 
        o.structured_notes && 
        (o.structured_notes as any).interactionOutcome
      );
    },
    enabled: !!actv8ContactId,
  });

  const isLoading = analysisLoading || outreachesLoading;

  if (isLoading) {
    return (
      <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Get the latest 3 outreach feedbacks
  const recentFeedback = outreaches.slice(0, 3);

  return (
    <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-5 w-5 text-primary" />
          Relationship Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {analysis?.summary || "No activity recorded yet."}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Target className="h-3 w-3" />
              Outreaches
            </div>
            <div className="text-lg font-semibold">
              {analysis?.totalOutreaches || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              {analysis?.completedOutreaches || 0} done
            </div>
          </div>

          <div className="p-2 rounded-lg bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <MessageSquare className="h-3 w-3" />
              Notes
            </div>
            <div className="text-lg font-semibold">
              {analysis?.notesCount || 0}
            </div>
            <div className="text-xs text-muted-foreground">
              recorded
            </div>
          </div>

          <div className="p-2 rounded-lg bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Zap className="h-3 w-3" />
              Strength
            </div>
            {analysis?.actv8Status?.connectionStrength ? (
              <Badge
                variant="outline"
                className={`mt-1 text-xs ${strengthColors[analysis.actv8Status.connectionStrength] || ""}`}
              >
                {strengthLabels[analysis.actv8Status.connectionStrength] || "—"}
              </Badge>
            ) : (
              <div className="text-lg font-semibold">—</div>
            )}
          </div>
        </div>

        {/* Intention Notes */}
        {intentionNotes && (
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Intention</h4>
            <p className="text-sm">{intentionNotes}</p>
          </div>
        )}

        {/* Recent Outreach Feedback */}
        {recentFeedback.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent Feedback</h4>
            <div className="space-y-2">
              {recentFeedback.map((outreach) => {
                const notes = outreach.structured_notes as any;
                return (
                  <div 
                    key={outreach.id} 
                    className="p-2 rounded-lg bg-muted/30 border border-border/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate max-w-[60%]">
                        {outreach.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {outreach.updated_at && format(parseISO(outreach.updated_at), 'MMM d')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      {notes.interactionOutcome && (
                        <div className="flex items-center gap-1">
                          {outcomeIcons[notes.interactionOutcome]}
                          <span className="capitalize text-muted-foreground">{notes.interactionOutcome}</span>
                        </div>
                      )}
                      {notes.rapportProgress && (
                        <div className="flex items-center gap-1">
                          {rapportIcons[notes.rapportProgress]}
                          <span className="capitalize text-muted-foreground">{notes.rapportProgress}</span>
                        </div>
                      )}
                    </div>
                    {notes.keyTopics && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {notes.keyTopics}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Engagement Score */}
        {analysis?.engagementScore !== undefined && analysis.engagementScore > 0 && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20">
            <span className="text-xs font-medium">Engagement Score</span>
            <span className="text-sm font-semibold text-primary">{analysis.engagementScore}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}