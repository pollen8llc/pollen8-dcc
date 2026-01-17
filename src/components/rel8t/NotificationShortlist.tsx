import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  Calendar, 
  ArrowRight,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  Ban,
  X,
  AlertTriangle,
  Trophy
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface SyncLogEntry {
  id: string;
  outreach_id: string;
  sync_type: string;
  changes: Record<string, any> | null;
  email_from: string | null;
  email_subject: string | null;
  created_at: string;
  outreach: {
    id: string;
    title: string;
    due_date: string;
  } | null;
}

interface OverdueOutreach {
  id: string;
  title: string;
  due_date: string;
  priority: string | null;
  status: string;
  rms_outreach_contacts: Array<{
    rms_contacts: {
      id: string;
      name: string | null;
      email: string | null;
    } | null;
  }>;
}

interface PathCompletionNotification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  metadata: {
    actv8ContactId?: string;
    pathName?: string;
    contactName?: string;
    newLevel?: number;
    previousLevel?: number;
  } | null;
}

const NotificationShortlist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: syncLogs = [], isLoading, refetch } = useQuery({
    queryKey: ["outreach-sync-logs-shortlist"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("rms_outreach_sync_log")
        .select(`
          *,
          outreach:rms_outreach(id, title, due_date)
        `)
        .eq("user_id", user.id)
        .in("sync_type", ["accepted", "declined", "tentative", "rescheduled", "cancelled"])
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return (data || []) as SyncLogEntry[];
    },
    refetchOnMount: true,
    staleTime: 0
  });

  // Query for overdue outreach
  const { data: overdueOutreach = [], refetch: refetchOverdue } = useQuery({
    queryKey: ["overdue-outreach-shortlist"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("rms_outreach")
        .select(`
          id, 
          title, 
          due_date, 
          priority, 
          status,
          rms_outreach_contacts(
            rms_contacts(id, name, email)
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "pending")
        .lt("due_date", today.toISOString())
        .order("due_date", { ascending: true })
        .limit(5);

      if (error) throw error;
      return (data || []) as OverdueOutreach[];
    },
    refetchOnMount: true,
    staleTime: 0
  });

  // Query for path completion notifications
  const { data: pathCompletions = [], refetch: refetchPathCompletions } = useQuery({
    queryKey: ["path-completions-shortlist"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("cross_platform_notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("notification_type", "actv8_path_complete")
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return (data || []) as PathCompletionNotification[];
    },
    refetchOnMount: true,
    staleTime: 0
  });

  // Real-time subscription for sync log, outreach, and notification updates
  useEffect(() => {
    const channel = supabase
      .channel('sync-log-shortlist-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rms_outreach_sync_log'
        },
        () => refetch()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rms_outreach'
        },
        () => refetchOverdue()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cross_platform_notifications'
        },
        () => refetchPathCompletions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, refetchOverdue, refetchPathCompletions]);

  const getSyncIcon = (syncType: string) => {
    switch (syncType) {
      case "accepted":
        return CheckCircle;
      case "declined":
        return XCircle;
      case "tentative":
        return HelpCircle;
      case "rescheduled":
        return Clock;
      case "cancelled":
        return Ban;
      default:
        return Calendar;
    }
  };

  const getSyncIconColor = (syncType: string) => {
    switch (syncType) {
      case "accepted":
        return "text-green-500";
      case "declined":
      case "cancelled":
        return "text-red-500";
      case "tentative":
        return "text-yellow-500";
      case "rescheduled":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getSyncTitle = (syncType: string) => {
    switch (syncType) {
      case "accepted":
        return "Meeting Accepted";
      case "declined":
        return "Meeting Declined";
      case "tentative":
        return "Tentative Response";
      case "rescheduled":
        return "Meeting Rescheduled";
      case "cancelled":
        return "Meeting Cancelled";
      default:
        return "Calendar Update";
    }
  };

  const getResponder = (entry: SyncLogEntry): string | null => {
    if (entry.changes?.responder?.email) {
      return entry.changes.responder.email;
    }
    if (entry.email_from) {
      return entry.email_from;
    }
    return null;
  };

  // Delete sync log mutation
  const deleteSyncLogMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("rms_outreach_sync_log")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Response cleared",
      });
      queryClient.invalidateQueries({ queryKey: ["outreach-sync-logs-shortlist"] });
      queryClient.invalidateQueries({ queryKey: ["outreach-sync-logs"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to clear response",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleEntryClick = (entry: SyncLogEntry) => {
    if (entry.outreach_id) {
      navigate(`/rel8/outreach/${entry.outreach_id}`);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSyncLogMutation.mutate(id);
  };

  // Helper to calculate days overdue
  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get primary contact from outreach
  const getPrimaryContact = (outreach: OverdueOutreach) => {
    const contacts = outreach.rms_outreach_contacts;
    if (!contacts || contacts.length === 0) return null;
    const contact = contacts[0]?.rms_contacts;
    return contact?.name || contact?.email || null;
  };

  if (isLoading) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading alerts...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasResponses = syncLogs && syncLogs.length > 0;
  const hasOverdue = overdueOutreach && overdueOutreach.length > 0;
  const hasPathCompletions = pathCompletions && pathCompletions.length > 0;
  const totalAlerts = syncLogs.length + overdueOutreach.length + pathCompletions.length;

  // Handle path completion click - navigate to network profile
  const handlePathCompletionClick = (notification: PathCompletionNotification) => {
    const actv8ContactId = notification.metadata?.actv8ContactId;
    if (actv8ContactId) {
      navigate(`/rel8/actv8/${actv8ContactId}/profile`);
    }
  };

  // Mark path completion as read
  const markPathCompletionRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await supabase
      .from("cross_platform_notifications")
      .update({ is_read: true })
      .eq("id", id);
    refetchPathCompletions();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="mb-8"
    >
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
                {totalAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {totalAlerts > 9 ? "9+" : totalAlerts}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Activity Alerts</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Overdue tasks, completions & responses
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/rel8/notifications")}
              className="gap-2"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {!hasResponses && !hasOverdue && !hasPathCompletions ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No alerts</p>
              <p className="text-xs mt-1 opacity-70">Overdue tasks and calendar responses will appear here</p>
            </div>
          ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {/* Path completion notifications first - with celebration gradient border */}
              {pathCompletions.map((notification, index) => (
                <motion.div
                  key={`path-complete-${notification.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <div
                    className={cn(
                      "w-full rounded-xl border-2 overflow-hidden transition-all duration-300 text-left group cursor-pointer",
                      "hover:bg-primary/10 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5",
                      "animate-gradient-border-celebration"
                    )}
                    onClick={() => handlePathCompletionClick(notification)}
                  >
                    <div className="px-4 py-3 flex items-center gap-4">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary/20 via-accent/20 to-violet-500/20">
                        <Trophy className="w-5 h-5 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm truncate bg-gradient-to-r from-primary via-accent to-violet-400 bg-clip-text text-transparent">
                            Path Completed!
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-foreground truncate max-w-[180px]">
                            {notification.metadata?.pathName || "Development Path"}
                          </span>
                        </div>
                        {notification.metadata?.contactName && (
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                              {notification.metadata.contactName} → Level {notification.metadata?.newLevel || "?"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Dismiss button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={(e) => markPathCompletionRead(e, notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Overdue outreach items */}
              {overdueOutreach.map((outreach, index) => {
                const daysOverdue = getDaysOverdue(outreach.due_date);
                const contactName = getPrimaryContact(outreach);
                
                return (
                  <motion.div
                    key={`overdue-${outreach.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: (pathCompletions.length + index) * 0.05 }}
                    layout
                  >
                    <div
                      className={cn(
                        "w-full rounded-xl border-2 overflow-hidden transition-all duration-300 text-left group cursor-pointer",
                        "hover:bg-destructive/10 bg-destructive/5 border-destructive/30"
                      )}
                      onClick={() => navigate(`/rel8/outreach/${outreach.id}`)}
                    >
                      <div className="px-4 py-3 flex items-center gap-4">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-destructive/10">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm truncate text-destructive">
                              Overdue
                            </h4>
                            <span className="text-xs text-destructive/70">
                              {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-foreground truncate max-w-[180px]">
                              {outreach.title}
                            </span>
                          </div>
                          {contactName && (
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {contactName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Calendar response items */}
              {syncLogs.map((entry, index) => {
                const Icon = getSyncIcon(entry.sync_type);
                const iconColor = getSyncIconColor(entry.sync_type);
                const responder = getResponder(entry);

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3, delay: (pathCompletions.length + overdueOutreach.length + index) * 0.05 }}
                    layout
                  >
                    <div
                      className={cn(
                        "w-full rounded-xl border-2 overflow-hidden transition-all duration-300 text-left group cursor-pointer",
                        "hover:bg-muted/30 bg-card/40 border-border/50"
                      )}
                      onClick={() => handleEntryClick(entry)}
                    >
                      <div className="px-4 py-3 flex items-center gap-4">
                        {/* Icon */}
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-muted/50"
                          )}
                        >
                          <Icon className={cn("w-5 h-5", iconColor)} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm truncate">
                              {getSyncTitle(entry.sync_type)}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {responder && (
                              <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {responder}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground/60">
                              {format(new Date(entry.created_at), "MMM d")}
                            </span>
                          </div>
                        </div>

                        {/* Outreach title on right */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {entry.outreach?.title && (
                            <span className="hidden sm:block text-xs text-muted-foreground max-w-[150px] truncate">
                              {entry.outreach.title}
                            </span>
                          )}
                          
                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => handleDelete(e, entry.id)}
                            disabled={deleteSyncLogMutation.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationShortlist;