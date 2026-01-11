import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getTriggersByContactId, Trigger } from "@/services/rel8t/triggerService";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, Bell, Calendar, CheckCircle2, Clock, 
  AlertCircle, ChevronRight, Plus, Loader2, Mail, Phone, MapPin
} from "lucide-react";
import { format, parseISO, isPast, isToday } from "date-fns";

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
}

export function ContactOutreachReminders({
  contactId,
  actv8ContactId,
  pathInstanceId,
  linkedOutreaches
}: ContactOutreachRemindersProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"outreach" | "reminders">("outreach");

  // Fetch reminders/triggers for this contact
  const { data: triggers = [], isLoading: triggersLoading, refetch: refetchTriggers } = useQuery({
    queryKey: ['contact-triggers', contactId],
    queryFn: () => getTriggersByContactId(contactId),
    enabled: !!contactId,
    refetchOnMount: true,
    staleTime: 0
  });

  // Real-time subscription for trigger updates
  useEffect(() => {
    if (!contactId) return;

    const channel = supabase
      .channel(`contact-triggers-${contactId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rms_triggers'
        },
        () => {
          refetchTriggers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rms_trigger_contacts'
        },
        () => {
          refetchTriggers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contactId, refetchTriggers]);

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

  const activeReminders = triggers.filter(t => t.is_active);
  const pausedReminders = triggers.filter(t => !t.is_active);

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "outreach" | "reminders")} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 bg-muted/30">
        <TabsTrigger value="outreach" className="gap-2 data-[state=active]:bg-primary/20">
          <MessageSquare className="h-4 w-4" />
          Outreach
          {linkedOutreaches.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1.5">{linkedOutreaches.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="reminders" className="gap-2 data-[state=active]:bg-primary/20">
          <Bell className="h-4 w-4" />
          Reminders
          {triggers.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1.5">{triggers.length}</Badge>
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

      <TabsContent value="reminders" className="space-y-3 mt-4">
        {triggersLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : triggers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium mb-1">No reminders set</p>
            <p className="text-xs opacity-70 mb-4">Create a reminder to stay on top of this relationship</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate('/rel8/triggers/wizard')}
            >
              <Plus className="h-4 w-4" />
              Create Reminder
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Active Reminders */}
            {activeReminders.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Active ({activeReminders.length})</p>
                {activeReminders.map((trigger) => (
                  <Card 
                    key={trigger.id}
                    className="p-3 bg-card/50 hover:bg-card/80 cursor-pointer transition-all border-border/50 hover:border-primary/30"
                    onClick={() => navigate('/rel8/triggers')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Bell className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{trigger.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {trigger.next_execution_at 
                              ? `Next: ${format(parseISO(trigger.next_execution_at), 'MMM d, yyyy')}`
                              : 'No schedule'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">Active</Badge>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Paused Reminders */}
            {pausedReminders.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Paused ({pausedReminders.length})</p>
                {pausedReminders.map((trigger) => (
                  <Card 
                    key={trigger.id}
                    className="p-3 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-all border-border/30"
                    onClick={() => navigate('/rel8/triggers')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate text-muted-foreground">{trigger.name}</p>
                          <p className="text-xs text-muted-foreground/70">Paused</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
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