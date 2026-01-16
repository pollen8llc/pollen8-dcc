import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, SkipForward, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useTierLabels } from "@/hooks/useRelationshipLevels";
import { formatDistanceToNow, format } from "date-fns";

interface PathInstance {
  id: string;
  path_id: string;
  status: "active" | "ended" | "skipped";
  started_at: string;
  ended_at: string | null;
  path?: {
    name: string;
    tier: number;
    description: string;
  };
}

interface CompletedPathsHistoryProps {
  actv8ContactId: string;
}

export function CompletedPathsHistory({ actv8ContactId }: CompletedPathsHistoryProps) {
  const tierLabels = useTierLabels();
  const [pathInstances, setPathInstances] = useState<PathInstance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("rms_actv8_path_instances")
          .select(`
            id,
            path_id,
            status,
            started_at,
            ended_at,
            rms_actv8_paths!inner (
              name,
              tier,
              description
            )
          `)
          .eq("actv8_contact_id", actv8ContactId)
          .in("status", ["ended", "skipped"])
          .order("ended_at", { ascending: false });

        if (error) throw error;

        const instances = (data || []).map((d: any) => ({
          id: d.id,
          path_id: d.path_id,
          status: d.status,
          started_at: d.started_at,
          ended_at: d.ended_at,
          path: d.rms_actv8_paths,
        }));

        setPathInstances(instances);
      } catch (error) {
        console.error("Error fetching path history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [actv8ContactId]);

  if (loading) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pathInstances.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completed Paths</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No completed paths yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete a development path to see your history here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Completed Paths</span>
          <Badge variant="secondary" className="text-xs">
            {pathInstances.length} paths
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pathInstances.map((instance) => {
          const isEnded = instance.status === "ended";
          const isSkipped = instance.status === "skipped";

          return (
            <div
              key={instance.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all",
                isEnded && "bg-blue-500/5 border-blue-500/30",
                isSkipped && "bg-amber-500/5 border-amber-500/30"
              )}
            >
              {/* Status Icon */}
              <div
                className={cn(
                  "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                  isEnded && "bg-blue-500/20 text-blue-400",
                  isSkipped && "bg-amber-500/20 text-amber-400"
                )}
              >
                {isEnded ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <SkipForward className="h-4 w-4" />
                )}
              </div>

              {/* Path Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">
                    {instance.path?.name || "Unknown Path"}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      isEnded && "border-blue-500/50 text-blue-400",
                      isSkipped && "border-amber-500/50 text-amber-400"
                    )}
                  >
                    {tierLabels[instance.path?.tier || 1] || `Tier ${instance.path?.tier}`}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px]",
                      isEnded && "bg-blue-500/20 text-blue-400",
                      isSkipped && "bg-amber-500/20 text-amber-400"
                    )}
                  >
                    {isEnded ? "Completed" : "Skipped"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {instance.path?.description}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {instance.ended_at ? (
                    <>
                      {isEnded ? "Completed" : "Skipped"}{" "}
                      {formatDistanceToNow(new Date(instance.ended_at), { addSuffix: true })}
                      {" · "}
                      {format(new Date(instance.ended_at), "MMM d, yyyy")}
                    </>
                  ) : (
                    `Started ${format(new Date(instance.started_at), "MMM d, yyyy")}`
                  )}
                </p>
              </div>

              {/* Visual indicator dot */}
              <div
                className={cn(
                  "h-3 w-3 rounded-full flex-shrink-0",
                  isEnded && "bg-blue-500",
                  isSkipped && "bg-amber-500"
                )}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
