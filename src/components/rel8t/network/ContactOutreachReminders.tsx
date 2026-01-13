import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, History, CheckCircle2, Clock, 
  AlertCircle, ChevronRight, Mail, Phone, MapPin, 
  Trophy, SkipForward, Calendar
} from "lucide-react";
import { format, parseISO, isPast, isToday, formatDistanceToNow } from "date-fns";
import { CompletedPathInstance } from "./TierProgressBar";

interface LinkedOutreach {
  stepIndex: number;
  outreach: {
    id: string;
    title: string;
    status: string;
    scheduled_at?: string;
    completed_at?: string;
    channel?: string;
    description?: string;
  };
}

interface ContactOutreachRemindersProps {
  contactId: string;
  actv8ContactId: string;
  pathInstanceId?: string | null;
  linkedOutreaches: LinkedOutreach[];
  completedPathInstances?: CompletedPathInstance[];
}

const tierLabels: Record<number, string> = {
  1: "Foundation",
  2: "Growth", 
  3: "Professional",
  4: "Advanced",
};

export function ContactOutreachReminders({
  contactId,
  actv8ContactId,
  pathInstanceId,
  linkedOutreaches,
  completedPathInstances = []
}: ContactOutreachRemindersProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"outreach" | "completed-paths">("outreach");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getChannelIcon = (channel?: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-3 w-3" />;
      case 'phone': return <Phone className="h-3 w-3" />;
      case 'in_person': return <MapPin className="h-3 w-3" />;
      default: return <MessageSquare className="h-3 w-3" />;
    }
  };

  const computeOutreachStatus = (outreach: LinkedOutreach['outreach']) => {
    if (outreach.status === 'completed') return 'completed';
    if (outreach.scheduled_at && isPast(parseISO(outreach.scheduled_at)) && !isToday(parseISO(outreach.scheduled_at))) {
      return 'overdue';
    }
    return 'pending';
  };

  const pendingOutreaches = linkedOutreaches.filter(o => o.outreach.status !== 'completed');
  const completedOutreaches = linkedOutreaches.filter(o => o.outreach.status === 'completed');

  // Separate completed and skipped paths
  const completedPaths = completedPathInstances.filter(p => p.status === 'ended');
  const skippedPaths = completedPathInstances.filter(p => p.status === 'skipped');

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "outreach" | "completed-paths")} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 bg-muted/30">
        <TabsTrigger value="outreach" className="gap-2 data-[state=active]:bg-primary/20">
          <MessageSquare className="h-4 w-4" />
          Outreach
          {linkedOutreaches.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1.5">{linkedOutreaches.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="completed-paths" className="gap-2 data-[state=active]:bg-primary/20">
          <History className="h-4 w-4" />
          Completed Paths
          {completedPathInstances.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1.5">{completedPathInstances.length}</Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="outreach" className="space-y-3 mt-4">
        {linkedOutreaches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium mb-1">No outreach tasks yet</p>
            <p className="text-xs opacity-70 mb-4">Plan a touchpoint to start building this relationship</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Pending Outreaches */}
            {pendingOutreaches.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Pending ({pendingOutreaches.length})</p>
                {pendingOutreaches.map(({ outreach }) => (
                  <Card 
                    key={outreach.id}
                    className="p-3 bg-card/50 hover:bg-card/80 cursor-pointer transition-all border-border/50 hover:border-primary/30"
                    onClick={() => navigate(`/rel8/outreach/${outreach.id}`)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {getChannelIcon(outreach.channel)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{outreach.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {outreach.scheduled_at 
                              ? format(parseISO(outreach.scheduled_at), 'MMM d, yyyy')
                              : 'Not scheduled'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getStatusBadge(computeOutreachStatus(outreach))}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Completed Outreaches */}
            {completedOutreaches.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Completed ({completedOutreaches.length})</p>
                {completedOutreaches.slice(0, 3).map(({ outreach }) => (
                  <Card 
                    key={outreach.id}
                    className="p-3 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all border-border/30"
                    onClick={() => navigate(`/rel8/outreach/${outreach.id}`)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate text-muted-foreground">{outreach.title}</p>
                          <p className="text-xs text-muted-foreground/70">
                            {outreach.completed_at 
                              ? `Completed ${format(parseISO(outreach.completed_at), 'MMM d')}`
                              : 'Completed'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  </Card>
                ))}
                {completedOutreaches.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center py-1">
                    +{completedOutreaches.length - 3} more completed
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed-paths" className="space-y-3 mt-4">
        {completedPathInstances.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium mb-1">No completed paths yet</p>
            <p className="text-xs opacity-70 mb-4">Complete your first development path to see it here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Completed Paths */}
            {completedPaths.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                  Completed ({completedPaths.length})
                </p>
                {completedPaths.map((instance) => (
                  <Card 
                    key={instance.id}
                    className="p-3 bg-card/50 border-[hsl(224,76%,48%)]/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[hsl(224,76%,48%)]/20 flex items-center justify-center shrink-0">
                        <Trophy className="h-5 w-5 text-[hsl(224,76%,48%)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{instance.path_name}</p>
                          <Badge variant="outline" className="bg-[hsl(224,76%,48%)]/10 text-[hsl(224,76%,48%)] border-[hsl(224,76%,48%)]/30 text-[10px]">
                            Tier {instance.tier} - {tierLabels[instance.tier]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(parseISO(instance.started_at), 'MMM d')}
                            {instance.ended_at && ` - ${format(parseISO(instance.ended_at), 'MMM d, yyyy')}`}
                          </span>
                          {instance.ended_at && (
                            <span className="text-emerald-500">
                              {formatDistanceToNow(parseISO(instance.started_at), { addSuffix: false })} duration
                            </span>
                          )}
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Skipped Paths */}
            {skippedPaths.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                  Skipped ({skippedPaths.length})
                </p>
                {skippedPaths.map((instance) => (
                  <Card 
                    key={instance.id}
                    className="p-3 bg-muted/20 border-amber-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                        <SkipForward className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-muted-foreground">{instance.path_name}</p>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[10px]">
                            Tier {instance.tier}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Skipped {instance.ended_at ? formatDistanceToNow(parseISO(instance.ended_at), { addSuffix: true }) : 'recently'}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}