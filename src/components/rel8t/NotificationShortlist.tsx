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
  X
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
        .limit(8);

      if (error) throw error;
      return (data || []) as SyncLogEntry[];
    },
    refetchOnMount: true,
    staleTime: 0
  });

  // Real-time subscription for sync log updates
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

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

  if (isLoading) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading calendar responses...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasResponses = syncLogs && syncLogs.length > 0;

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
                {syncLogs.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {syncLogs.length > 9 ? "9+" : syncLogs.length}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Calendar Responses</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Recent meeting invite responses
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
          {!hasResponses ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No calendar responses yet</p>
              <p className="text-xs mt-1 opacity-70">Responses to your meeting invites will appear here</p>
            </div>
          ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
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
                    transition={{ duration: 0.3, delay: index * 0.05 }}
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
