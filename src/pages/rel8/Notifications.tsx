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
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
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
      
      const getStatusColor = () => {
        if (item.status === 'sent') return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
        if (item.status === 'failed') return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
        if (item.status === 'pending') return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)] animate-pulse';
        return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]';
      };

      return (
        <div key={item.id} className="group">
          <Card 
            className={`glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 ${
              isOutreachEmail ? 'cursor-pointer' : ''
            }`}
            onClick={isOutreachEmail && outreachId ? () => toggleOutreachExpanded(outreachId) : undefined}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Status Indicator */}
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getStatusColor()}`} />
                
                {/* Status Icon */}
                <div className="mt-0.5 shrink-0">
                  {getStatusIcon(item.status)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm leading-tight text-foreground truncate flex-1">{item.subject}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(item.created_at), "h:mm a")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({ id: item.id, type: "email" });
                        }}
                        className={`h-6 w-6 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:bg-destructive/10 hover:text-destructive transition-opacity`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Metadata Line */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-primary/80 capitalize">{item.status}</span>
                    {item.has_ics_attachment && (
                      <>
                        <span className="text-muted-foreground/50">|</span>
                        <Calendar className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">Calendar</span>
                      </>
                    )}
                    {isOutreachEmail && (
                      <>
                        <span className="text-muted-foreground/50">|</span>
                        <span className="text-primary/80">Outreach</span>
                      </>
                    )}
                    <span className="text-muted-foreground/50">|</span>
                    <ReferenceIcon className="h-3 w-3 text-muted-foreground/70" />
                    <span className="text-muted-foreground/70 capitalize truncate">
                      {ref.type}: {ref.name}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {item.status === "failed" && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          retryEmailMutation.mutate(item.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Retry
                      </Button>
                    )}
                    {item.has_ics_attachment && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadICS(item);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    )}
                    {isOutreachEmail && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <List className="h-3 w-3" />
                        {isExpanded ? 'Hide' : 'View'} Timeline
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isExpanded && outreachId && (
            <OutreachTimelineAccordion outreachId={outreachId} />
          )}
        </div>
      );
    }

    if (item._type === 'calendar') {
      const isExpanded = expandedOutreachIds.has(item.outreach_id);
      const updateCount = item._updateCount || 1;
      
      const getStatusColor = () => {
        if (item.sync_type === 'create') return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]';
        if (item.sync_type === 'reschedule') return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]';
        if (item.sync_type === 'cancel') return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
        return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]';
      };

      return (
        <div key={item.id} className="group">
          <Card 
            className="glass-morphism border-0 bg-card/30 backdrop-blur-md hover:bg-card/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer"
            onClick={() => toggleOutreachExpanded(item.outreach_id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Status Indicator */}
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getStatusColor()}`} />
                
                {/* Sync Type Icon */}
                <div className="mt-0.5 shrink-0">
                  {getSyncTypeIcon(item.sync_type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm leading-tight text-foreground truncate flex-1">
                      {item.outreach?.title || "Calendar Update"}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(item.created_at), "h:mm a")}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({ id: item.id, type: "sync" });
                        }}
                        className={`h-6 w-6 ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} hover:bg-destructive/10 hover:text-destructive transition-opacity`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Metadata Line */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className={
                      item.sync_type === 'update' ? 'text-blue-500' :
                      item.sync_type === 'reschedule' ? 'text-yellow-500' :
                      item.sync_type === 'cancel' ? 'text-red-500' :
                      'text-green-500'
                    }>
                      {item.sync_type.charAt(0).toUpperCase() + item.sync_type.slice(1)}
                    </span>
                    {item.email_from && (
                      <>
                        <span className="text-muted-foreground/50">|</span>
                        <span className="text-muted-foreground/70 truncate">
                          {item.email_from.split('@')[0]}
                        </span>
                      </>
                    )}
                    {updateCount > 1 && (
                      <>
                        <span className="text-muted-foreground/50">|</span>
                        <span className="text-primary/80">{updateCount} updates</span>
                      </>
                    )}
                  </div>

                  {/* Action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <List className="h-3 w-3" />
                    {isExpanded ? 'Hide' : 'View'} Timeline
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isExpanded && (
            <OutreachTimelineAccordion outreachId={item.outreach_id} />
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
