import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { OutreachTimelineAccordion } from "@/components/rel8t/OutreachTimelineAccordion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, ExternalLink, Mail, AlertCircle, CheckCircle2, Clock, Calendar, GitBranch, Bell, User, Building2, Trash2, List } from "lucide-react";
import { downloadICS } from "@/utils/icsDownload";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CrossPlatformNotificationCard } from "@/components/rel8t/CrossPlatformNotificationCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type NotificationStatus = "all" | "sent" | "pending" | "failed";
type NotificationView = "all" | "platform" | "emails" | "calendar";

export default function Notifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<NotificationStatus>("all");
  const [activeView, setActiveView] = useState<NotificationView>("all");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: "email" | "sync" } | null>(null);
  const [expandedOutreachIds, setExpandedOutreachIds] = useState<Set<string>>(new Set());

  // Fetch cross-platform notifications
  const { data: platformNotifications, isLoading: platformNotificationsLoading, refetch: refetchPlatform } = useQuery({
    queryKey: ["cross-platform-notifications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("cross_platform_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchOnMount: true,
    staleTime: 0
  });

  // Real-time subscription for platform notifications
  useEffect(() => {
    const channel = supabase
      .channel('platform-notifications-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cross_platform_notifications'
        },
        () => refetchPlatform()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchPlatform]);

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log("Attempting to delete notification:", notificationId);
      const { error } = await supabase
        .from("cross_platform_notifications")
        .delete()
        .eq("id", notificationId);

      if (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
      console.log("Successfully deleted notification:", notificationId);
    },
    onSuccess: () => {
      toast({
        title: "Notification deleted",
        description: "The notification has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ["cross-platform-notifications"] });
    },
    onError: (error) => {
      console.error("Delete notification mutation error:", error);
      toast({
        title: "Failed to delete notification",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete email notification mutation
  const deleteEmailMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log("Attempting to delete email notification:", notificationId);
      const { error } = await supabase
        .from("rms_email_notifications")
        .delete()
        .eq("id", notificationId);

      if (error) {
        console.error("Error deleting email notification:", error);
        throw error;
      }
      console.log("Successfully deleted email notification:", notificationId);
    },
    onSuccess: () => {
      toast({
        title: "Email notification deleted"
      });
      queryClient.invalidateQueries({ queryKey: ["email-notifications"] });
      setDeleteTarget(null);
    },
    onError: (error) => {
      console.error("Delete email mutation error:", error);
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Delete sync log mutation
  const deleteSyncLogMutation = useMutation({
    mutationFn: async (logId: string) => {
      console.log("Attempting to delete sync log:", logId);
      const { error} = await supabase
        .from("rms_outreach_sync_log")
        .delete()
        .eq("id", logId);

      if (error) {
        console.error("Error deleting sync log:", error);
        throw error;
      }
      console.log("Successfully deleted sync log:", logId);
    },
    onSuccess: () => {
      toast({
        title: "Calendar update deleted"
      });
      queryClient.invalidateQueries({ queryKey: ["calendar-sync-logs"] });
      setDeleteTarget(null);
    },
    onError: (error) => {
      console.error("Delete sync log mutation error:", error);
      toast({
        title: "Failed to delete",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Fetch email notifications
  const { data: notifications, isLoading, refetch: refetchEmails } = useQuery({
    queryKey: ["email-notifications"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("rms_email_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchOnMount: true,
    staleTime: 0
  });

  // Real-time subscription for email notifications
  useEffect(() => {
    const channel = supabase
      .channel('email-notifications-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rms_email_notifications'
        },
        () => refetchEmails()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchEmails]);

  // Fetch calendar sync logs
  const { data: syncLogs, isLoading: syncLogsLoading, refetch: refetchSyncLogs } = useQuery({
    queryKey: ["calendar-sync-logs"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("rms_outreach_sync_log")
        .select(`
          *,
          outreach:rms_outreach(id, title, due_date)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchOnMount: true,
    staleTime: 0
  });

  // Real-time subscription for sync logs
  useEffect(() => {
    const channel = supabase
      .channel('sync-logs-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rms_outreach_sync_log'
        },
        () => refetchSyncLogs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchSyncLogs]);

  // Retry email mutation
  const retryEmailMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const notification = notifications?.find(n => n.id === notificationId);
      if (!notification) throw new Error("Notification not found");

      const { data: emailData, error: emailError } = await supabase.functions.invoke("send-email", {
        body: {
          to: (notification.metadata as any)?.userEmail || "",
          subject: notification.subject,
          html: notification.body,
          icsAttachment: notification.has_ics_attachment && notification.ics_data
            ? {
                content: notification.ics_data,
                filename: `event-${notificationId}.ics`
              }
            : undefined
        }
      });

      if (emailError) throw emailError;

      // Update notification status
      await supabase
        .from("rms_email_notifications")
        .update({ 
          status: "sent", 
          sent_at: new Date().toISOString(),
          error_message: null 
        })
        .eq("id", notificationId);

      return emailData;
    },
    onSuccess: () => {
      toast({
        title: "Email sent successfully",
        description: "The notification has been resent."
      });
      queryClient.invalidateQueries({ queryKey: ["email-notifications"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send email",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleDownloadICS = (notification: any) => {
    if (notification.ics_data) {
      downloadICS(notification.ics_data, `event-${notification.id}.ics`);
      toast({
        title: "Calendar file downloaded",
        description: "Import this file into your calendar app."
      });
    }
  };

  // Group sync logs by outreach_id, keeping only the latest per outreach
  const groupedSyncLogs = Object.values(
    (syncLogs || []).reduce((acc, log) => {
      if (!acc[log.outreach_id] || new Date(log.created_at) > new Date(acc[log.outreach_id].created_at)) {
        // Count how many logs exist for this outreach_id
        const count = (syncLogs || []).filter(l => l.outreach_id === log.outreach_id).length;
        acc[log.outreach_id] = { ...log, _updateCount: count };
      }
      return acc;
    }, {} as Record<string, any>)
  );

  // Combined notifications for "all" view
  const allNotifications = [
    ...(platformNotifications || []).map(n => ({ ...n, _type: 'platform' as const, _date: new Date(n.created_at) })),
    ...(notifications || []).map(n => ({ ...n, _type: 'email' as const, _date: new Date(n.created_at) })),
    ...groupedSyncLogs.map(n => ({ ...n, _type: 'calendar' as const, _date: new Date(n.created_at) }))
  ].sort((a, b) => b._date.getTime() - a._date.getTime());

  const filteredNotifications = notifications?.filter(n => {
    if (statusFilter === "all") return true;
    return n.status === statusFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Mail className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      sent: "default",
      failed: "destructive",
      pending: "secondary"
    };
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize text-xs">
        {status}
      </Badge>
    );
  };

  const getSyncTypeIcon = (syncType: string) => {
    switch (syncType) {
      case "update":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "reschedule":
        return <Calendar className="h-4 w-4 text-yellow-500" />;
      case "cancel":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "create":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <GitBranch className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSyncTypeBadge = (syncType: string) => {
    const colors: Record<string, string> = {
      update: "bg-blue-900/30 text-blue-400 border-blue-400/30",
      reschedule: "bg-yellow-900/30 text-yellow-400 border-yellow-400/30",
      cancel: "bg-red-900/30 text-red-400 border-red-400/30",
      create: "bg-green-900/30 text-green-400 border-green-400/30"
    };
    return (
      <Badge variant="outline" className={`${colors[syncType] || "border-border/30"} text-xs`}>
        {syncType}
      </Badge>
    );
  };

  const getReference = (notification: any) => {
    if (notification.metadata?.contactName) return { type: 'contact', name: notification.metadata.contactName };
    if (notification.metadata?.contact_name) return { type: 'contact', name: notification.metadata.contact_name };
    if (notification.metadata?.userName) return { type: 'user', name: notification.metadata.userName };
    if (notification.metadata?.user_name) return { type: 'user', name: notification.metadata.user_name };
    if (notification.metadata?.communityName) return { type: 'community', name: notification.metadata.communityName };
    if (notification.metadata?.community_name) return { type: 'community', name: notification.metadata.community_name };
    return { type: 'general', name: 'N/A' };
  };

  const toggleOutreachExpanded = (outreachId: string) => {
    setExpandedOutreachIds(prev => {
      const next = new Set(prev);
      if (next.has(outreachId)) {
        next.delete(outreachId);
      } else {
        next.add(outreachId);
      }
      return next;
    });
  };

  const renderUnifiedNotification = (item: any) => {
    const ref = getReference(item);
    const ReferenceIcon = ref.type === 'user' ? User : ref.type === 'community' ? Building2 : User;

    if (item._type === 'platform') {
      return (
        <CrossPlatformNotificationCard
          key={item.id}
          notification={item}
          onDelete={(id) => deleteNotificationMutation.mutate(id)}
        />
      );
    }

    if (item._type === 'email') {
      const isOutreachEmail = item.notification_type === "outreach_created";
      const outreachId = item.metadata?.outreachId;
      const isExpanded = outreachId && expandedOutreachIds.has(outreachId);

      return (
        <div key={item.id}>
          <Card 
            className={`glass-morphism border-0 backdrop-blur-md hover:bg-card/60 transition-all ${
              isOutreachEmail ? 'cursor-pointer' : ''
            }`}
            onClick={isOutreachEmail && outreachId ? () => toggleOutreachExpanded(outreachId) : undefined}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-1 shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground truncate">{item.subject}</h3>
                      {getStatusBadge(item.status)}
                      {item.notification_type === "outreach_created" && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                          Outreach
                        </Badge>
                      )}
                      {item.has_ics_attachment && (
                        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-400/30 text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          ICS
                        </Badge>
                      )}
                      {isOutreachEmail && (
                        <Badge variant="outline" className="text-xs">
                          {isExpanded ? '▼' : '▶'} Timeline
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="text-xs">{format(new Date(item.created_at), "PPP 'at' p")}</p>
                      {item.sent_at && (
                        <p className="text-xs">Sent: {format(new Date(item.sent_at), "PPP 'at' p")}</p>
                      )}
                    </div>

                    {item.error_message && (
                      <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-xs text-destructive font-medium">Error:</p>
                        <p className="text-xs text-destructive/80 mt-1">{item.error_message}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.has_ics_attachment && item.ics_data && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadICS(item);
                      }}
                      className="flex-1 sm:flex-none min-w-[120px]"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                  )}
                  
                  {item.status === "failed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        retryEmailMutation.mutate(item.id);
                      }}
                      disabled={retryEmailMutation.isPending}
                      className="flex-1 sm:flex-none min-w-[120px]"
                    >
                      <RefreshCw className={`h-3 w-3 mr-2 ${retryEmailMutation.isPending ? 'animate-spin' : ''}`} />
                      Retry
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({ id: item.id, type: "email" });
                    }}
                    className="flex-1 sm:flex-none min-w-[120px] hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 py-3 bg-muted/20 border-t border-border/20 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
              <span className="font-mono">#{item.id.slice(0, 8)}</span>
              <div className="flex items-center gap-1">
                <ReferenceIcon className="h-3 w-3" />
                <span className="capitalize">{ref.type}: {ref.name}</span>
              </div>
            </CardFooter>
          </Card>
          
          {/* Inline timeline accordion */}
          {isExpanded && outreachId && (
            <div className="glass-morphism border-0 backdrop-blur-md border-t-0 rounded-t-none">
              <OutreachTimelineAccordion outreachId={outreachId} />
            </div>
          )}
        </div>
      );
    }

    if (item._type === 'calendar') {
      const isExpanded = expandedOutreachIds.has(item.outreach_id);
      
      return (
        <div key={item.id}>
          <Card 
            className="glass-morphism border-0 backdrop-blur-md hover:bg-card/60 transition-all cursor-pointer"
            onClick={() => toggleOutreachExpanded(item.outreach_id)}
          >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="mt-1 shrink-0">
                  {getSyncTypeIcon(item.sync_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {item.outreach?.title || "Unknown Outreach"}
                    </h3>
                    {getSyncTypeBadge(item.sync_type)}
                    {item._updateCount > 1 && (
                      <Badge variant="outline" className="text-xs">
                        {item._updateCount} updates
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {isExpanded ? '▼' : '▶'} Timeline
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="text-xs">{format(new Date(item.created_at), "PPP 'at' p")}</p>
                    {item.email_from && <p className="text-xs truncate">From: {item.email_from}</p>}
                    {item.sequence !== null && <p className="text-xs">Sequence: {item.sequence}</p>}
                  </div>

                  {item.changes && Object.keys(item.changes).length > 0 && (
                    <div className="mt-3 p-3 bg-muted/30 border border-border/30 rounded-lg">
                      <p className="text-xs font-medium mb-2">Changes:</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {Object.entries(item.changes).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex gap-2 flex-wrap">
                            <span className="font-medium capitalize">{key}:</span>
                            <span className="line-through">{JSON.stringify(value.old)}</span>
                            <span>→</span>
                            <span className="text-foreground">{JSON.stringify(value.new)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {item.outreach?.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/rel8/outreach");
                    }}
                    className="flex-1 sm:flex-none min-w-[120px]"
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    View
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({ id: item.id, type: "sync" });
                  }}
                  className="flex-1 sm:flex-none min-w-[120px] hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="px-6 py-3 bg-muted/20 border-t border-border/20 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
            <span className="font-mono">#{item.id.slice(0, 8)}</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Outreach: {item.outreach?.title || 'N/A'}</span>
            </div>
          </CardFooter>
        </Card>
        
        {/* Inline timeline accordion */}
        {isExpanded && item.outreach_id && (
          <div className="glass-morphism border-0 backdrop-blur-md border-t-0 rounded-t-none">
            <OutreachTimelineAccordion outreachId={item.outreach_id} />
          </div>
        )}
      </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Rel8OnlyNavigation />
        
        {/* Header */}
        <div className="mt-8 mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-muted-foreground">Track all updates, emails, and calendar sync</p>
        </div>

        {/* Filters - Stack on mobile */}
        <Card className="glass-morphism border-0 backdrop-blur-md mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={activeView} onValueChange={(v) => setActiveView(v as NotificationView)}>
                <SelectTrigger className="w-full sm:w-[200px] bg-background/50 backdrop-blur-sm border-border/50">
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-md border-border z-50">
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <List className="h-4 w-4" />
                      <span>All</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="platform">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Platform</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="emails">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Emails</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="calendar">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Calendar</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {activeView === "emails" && (
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as NotificationStatus)}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-background/50 backdrop-blur-sm border-border/50">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-md border-border z-50">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="space-y-3">
          {/* ALL VIEW */}
          {activeView === "all" && (
            <>
              {(platformNotificationsLoading || isLoading || syncLogsLoading) ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : allNotifications.length > 0 ? (
                allNotifications.map(renderUnifiedNotification)
              ) : (
                <Card className="glass-morphism border-0 backdrop-blur-md">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                    <p className="text-muted-foreground text-center text-sm mb-6">
                      All notifications will appear here
                    </p>
                    <Button onClick={() => navigate("/rel8/connect")} size="sm">
                      Go to REL8
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* PLATFORM VIEW */}
          {activeView === "platform" && (
            <>
              {platformNotificationsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : platformNotifications && platformNotifications.length > 0 ? (
                <div className="space-y-3">
                  {platformNotifications.map((notification) => (
                    <CrossPlatformNotificationCard
                      key={notification.id}
                      notification={notification}
                      onDelete={(id) => deleteNotificationMutation.mutate(id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="glass-morphism border-0 backdrop-blur-md">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No platform notifications</h3>
                    <p className="text-muted-foreground text-center text-sm mb-6">
                      Platform notifications will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* EMAILS VIEW */}
          {activeView === "emails" && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredNotifications && filteredNotifications.length > 0 ? (
                filteredNotifications.map((item) => renderUnifiedNotification({ ...item, _type: 'email' as const, _date: new Date(item.created_at) }))
              ) : (
                <Card className="glass-morphism border-0 backdrop-blur-md">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Mail className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No email notifications</h3>
                    <p className="text-muted-foreground text-center text-sm mb-6">
                      {statusFilter === "all" 
                        ? "Email notifications will appear here"
                        : `No ${statusFilter} notifications found`}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* CALENDAR VIEW */}
          {activeView === "calendar" && (
            <>
              {syncLogsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : groupedSyncLogs && groupedSyncLogs.length > 0 ? (
                groupedSyncLogs.map((item) => renderUnifiedNotification({ ...item, _type: 'calendar' as const, _date: new Date(item.created_at) }))
              ) : (
                <Card className="glass-morphism border-0 backdrop-blur-md">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No calendar updates</h3>
                    <p className="text-muted-foreground text-center text-sm mb-6">
                      Calendar sync updates will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="glass-morphism border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Notification?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this notification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteTarget?.type === "email") {
                  deleteEmailMutation.mutate(deleteTarget.id);
                } else if (deleteTarget?.type === "sync") {
                  deleteSyncLogMutation.mutate(deleteTarget.id);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
