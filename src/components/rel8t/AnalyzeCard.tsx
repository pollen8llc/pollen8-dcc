import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BarChart3, Target, Zap, ArrowRight } from "lucide-react";
import { useContactAnalysis } from "@/hooks/useContactAnalysis";

interface AnalyzeCardProps {
  contactId: string;
  contactName: string;
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

export function AnalyzeCard({ contactId, contactName }: AnalyzeCardProps) {
  const navigate = useNavigate();
  const { data: analysis, isLoading } = useContactAnalysis(contactId);

  if (isLoading) {
    return (
      <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Analyze
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Relationship Summary */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {analysis?.summary || "No activity recorded yet."}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {/* Outreaches */}
          <div className="p-3 rounded-lg bg-muted/30 text-center">
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

          {/* Path Progress */}
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <ArrowRight className="h-3 w-3" />
              Path
            </div>
            {analysis?.actv8Status?.isActive ? (
              <>
                <div className="text-lg font-semibold">
                  Step {(analysis.actv8Status.currentStep || 0) + 1}
                </div>
                <div className="text-xs text-muted-foreground">
                  of {analysis.actv8Status.totalSteps}
                </div>
              </>
            ) : (
              <>
                <div className="text-lg font-semibold">—</div>
                <div className="text-xs text-muted-foreground">Not active</div>
              </>
            )}
          </div>

          {/* Connection Strength */}
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Zap className="h-3 w-3" />
              Strength
            </div>
            {analysis?.actv8Status?.connectionStrength ? (
              <Badge
                variant="outline"
                className={`mt-1 ${strengthColors[analysis.actv8Status.connectionStrength] || ""}`}
              >
                {strengthLabels[analysis.actv8Status.connectionStrength] || "—"}
              </Badge>
            ) : (
              <>
                <div className="text-lg font-semibold">—</div>
                <div className="text-xs text-muted-foreground">Unknown</div>
              </>
            )}
          </div>
        </div>

        {/* Evaluate Button */}
        <Button
          className="w-full mt-2"
          onClick={() => navigate(`/elavu8/contact/${contactId}`)}
        >
          Evaluate (Evalu8)
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
