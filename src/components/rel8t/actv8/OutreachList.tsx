import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Clock, Plus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, format, isPast, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Outreach {
  id: string;
  title: string;
  status: string;
  due_date: string;
  outreach_channel: string | null;
  actv8_step_index: number | null;
  created_at: string;
}

interface OutreachListProps {
  actv8ContactId: string;
  contactId: string;
  pathInstanceId: string | null;
}

export function OutreachList({ actv8ContactId, contactId, pathInstanceId }: OutreachListProps) {
  const navigate = useNavigate();
  const [outreaches, setOutreaches] = useState<Outreach[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutreaches = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("rms_outreach")
          .select("id, title, status, due_date, outreach_channel, actv8_step_index, created_at")
          .eq("actv8_contact_id", actv8ContactId)
          .order("due_date", { ascending: true });

        // Filter by path instance if available
        if (pathInstanceId) {
          query = query.eq("path_instance_id", pathInstanceId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setOutreaches(data || []);
      } catch (error) {
        console.error("Error fetching outreaches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOutreaches();
  }, [actv8ContactId, pathInstanceId]);

  const handleCreateOutreach = () => {
    navigate(`/rel8/triggers/wizard?actv8=${actv8ContactId}&contact=${contactId}`);
  };

  const pendingOutreaches = outreaches.filter((o) => o.status === "pending");
  const completedOutreaches = outreaches.filter((o) => o.status === "completed");

  if (loading) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-muted/50 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (outreaches.length === 0) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Active Outreach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No active outreach tasks</p>
            <p className="text-xs text-muted-foreground mt-1">
              Plan your next touchpoint to stay connected
            </p>
            <Button size="sm" className="mt-4" onClick={handleCreateOutreach}>
              <Plus className="h-3 w-3 mr-1" />
              Plan Touchpoint
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Active Outreach
          </span>
          <div className="flex items-center gap-2">
            {pendingOutreaches.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {pendingOutreaches.length} pending
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={handleCreateOutreach}>
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Pending outreaches first */}
        {pendingOutreaches.map((outreach) => {
          const dueDate = new Date(outreach.due_date);
          const isOverdue = isPast(dueDate) && outreach.status === "pending";
          const isDueToday = isToday(dueDate);

          return (
            <div
              key={outreach.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-primary/5",
                isOverdue && "bg-red-500/5 border-red-500/30",
                isDueToday && !isOverdue && "bg-amber-500/5 border-amber-500/30",
                !isOverdue && !isDueToday && "bg-card/80 border-border"
              )}
              onClick={() => navigate(`/rel8/outreach/${outreach.id}`)}
            >
              <div
                className={cn(
                  "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                  isOverdue && "bg-red-500/20 text-red-400",
                  isDueToday && !isOverdue && "bg-amber-500/20 text-amber-400",
                  !isOverdue && !isDueToday && "bg-primary/20 text-primary"
                )}
              >
                <Clock className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{outreach.title}</span>
                  {outreach.actv8_step_index !== null && (
                    <Badge variant="outline" className="text-[10px]">
                      Step {outreach.actv8_step_index + 1}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {outreach.outreach_channel && <span className="capitalize">{outreach.outreach_channel}</span>}
                  <span>·</span>
                  {isOverdue ? (
                    <span className="text-red-400">
                      Overdue by {formatDistanceToNow(dueDate)}
                    </span>
                  ) : isDueToday ? (
                    <span className="text-amber-400">Due today</span>
                  ) : (
                    <span>Due {format(dueDate, "MMM d")}</span>
                  )}
                </div>
              </div>

              <Badge
                variant={isOverdue ? "destructive" : isDueToday ? "secondary" : "outline"}
                className="text-[10px] flex-shrink-0"
              >
                {isOverdue ? "Overdue" : isDueToday ? "Today" : format(dueDate, "MMM d")}
              </Badge>
            </div>
          );
        })}

        {/* Completed outreaches */}
        {completedOutreaches.length > 0 && (
          <>
            <div className="pt-2 pb-1">
              <span className="text-xs text-muted-foreground font-medium">
                Recently Completed
              </span>
            </div>
            {completedOutreaches.slice(0, 3).map((outreach) => (
              <div
                key={outreach.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-blue-500/5 border-blue-500/30 opacity-70"
              >
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-blue-500/20 text-blue-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm line-through">{outreach.title}</span>
                  {outreach.outreach_channel && (
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {outreach.outreach_channel}
                    </p>
                  )}
                </div>

                <Badge variant="secondary" className="text-[10px] flex-shrink-0 bg-blue-500/20 text-blue-400">
                  Done
                </Badge>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
