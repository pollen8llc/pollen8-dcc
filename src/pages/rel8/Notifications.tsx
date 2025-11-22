import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, RefreshCw, ExternalLink, Mail, AlertCircle, CheckCircle2, Clock, Calendar, GitBranch, Bell } from "lucide-react";
import { downloadICS } from "@/utils/icsDownload";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CrossPlatformNotificationCard } from "@/components/rel8t/CrossPlatformNotificationCard";

type NotificationStatus = "all" | "sent" | "pending" | "failed";
type NotificationView = "platform" | "emails" | "calendar";

export default function Notifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<NotificationStatus>("all");
  const [activeView, setActiveView] = useState<NotificationView>("platform");

  // Fetch cross-platform notifications
  const { data: platformNotifications, isLoading: platformNotificationsLoading } = useQuery({
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
    }
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("cross_platform_notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Notification deleted",
        description: "The notification has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ["cross-platform-notifications"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete notification",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Fetch email notifications
  const { data: notifications, isLoading } = useQuery({
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
    }
  });

  // Fetch calendar sync logs
  const { data: syncLogs, isLoading: syncLogsLoading } = useQuery({
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
    }
  });

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
      <Badge variant={variants[status] || "outline"} className="capitalize">
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
      <Badge variant="outline" className={colors[syncType] || "border-border/30"}>
        {syncType}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5">
      <Rel8Header showProfileBanner={false} />
      
      <div className="container mx-auto max-w-4xl px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-muted-foreground">Track updates, emails, and calendar sync</p>
        </div>

        {/* Filters - Stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={activeView} onValueChange={(v) => setActiveView(v as NotificationView)}>
            <SelectTrigger className="w-full sm:w-[200px] bg-card/80 backdrop-blur-sm border-border/50">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
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
              <SelectTrigger className="w-full sm:w-[180px] bg-card/80 backdrop-blur-sm border-border/50">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
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
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Bell className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                    <p className="text-muted-foreground text-center text-sm mb-6">
                      Platform notifications will appear here
                    </p>
                    <Button onClick={() => navigate("/rel8/connect")} size="sm">
                      Go to REL8 Connect
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {activeView === "emails" && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredNotifications && filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <Card key={notification.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="mt-1 shrink-0">
                              {getStatusIcon(notification.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-semibold text-foreground truncate">{notification.subject}</h3>
                                {getStatusBadge(notification.status)}
                                {notification.notification_type === "outreach_created" && (
                                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                                    Outreach
                                  </Badge>
                                )}
                                {notification.has_ics_attachment && (
                                  <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-400/30 text-xs">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    ICS
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p className="text-xs">{format(new Date(notification.created_at), "PPP 'at' p")}</p>
                                {notification.sent_at && (
                                  <p className="text-xs">Sent: {format(new Date(notification.sent_at), "PPP 'at' p")}</p>
                                )}
                                {notification.notification_type === "outreach_created" && (notification.metadata as any)?.systemEmail && (
                                  <p className="font-mono text-xs truncate">{(notification.metadata as any).systemEmail}</p>
                                )}
                              </div>

                              {notification.error_message && (
                                <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                                  <p className="text-xs text-destructive font-medium">Error:</p>
                                  <p className="text-xs text-destructive/80 mt-1">{notification.error_message}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-row sm:flex-col gap-2 self-end sm:self-start">
                            {notification.has_ics_attachment && notification.ics_data && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadICS(notification)}
                                className="text-xs"
                              >
                                <Download className="h-3 w-3 sm:mr-2" />
                                <span className="hidden sm:inline">ICS</span>
                              </Button>
                            )}
                            
                            {notification.status === "failed" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => retryEmailMutation.mutate(notification.id)}
                                disabled={retryEmailMutation.isPending}
                                className="text-xs"
                              >
                                <RefreshCw className={`h-3 w-3 sm:mr-2 ${retryEmailMutation.isPending ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Retry</span>
                              </Button>
                            )}

                            {notification.trigger_id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/rel8/build-rapport")}
                                className="text-xs"
                              >
                                <ExternalLink className="h-3 w-3 sm:mr-2" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Mail className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No email notifications</h3>
                    <p className="text-muted-foreground text-center text-sm mb-6">
                      {statusFilter === "all" 
                        ? "Email notifications will appear here"
                        : `No ${statusFilter} notifications found`}
                    </p>
                    <Button onClick={() => navigate("/rel8/build-rapport")} size="sm">
                      Create Trigger
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {activeView === "calendar" && (
            <>
              {syncLogsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : syncLogs && syncLogs.length > 0 ? (
                <div className="space-y-3">
                  {syncLogs.map((log: any) => (
                    <Card key={log.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="mt-1 shrink-0">
                              {getSyncTypeIcon(log.sync_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-semibold text-foreground truncate">
                                  {log.outreach?.title || "Unknown Outreach"}
                                </h3>
                                {getSyncTypeBadge(log.sync_type)}
                              </div>
                              
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p className="text-xs">{format(new Date(log.created_at), "PPP 'at' p")}</p>
                                {log.email_from && <p className="text-xs truncate">From: {log.email_from}</p>}
                                {log.sequence !== null && <p className="text-xs">Sequence: {log.sequence}</p>}
                              </div>

                              {log.changes && Object.keys(log.changes).length > 0 && (
                                <div className="mt-3 p-3 bg-muted/30 border border-border/30 rounded-lg">
                                  <p className="text-xs font-medium mb-2">Changes:</p>
                                  <div className="space-y-1 text-xs text-muted-foreground">
                                    {Object.entries(log.changes).map(([key, value]: [string, any]) => (
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

                          <div className="flex flex-row sm:flex-col gap-2 self-end sm:self-start">
                            {log.outreach?.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate("/rel8/outreach")}
                                className="text-xs"
                              >
                                <ExternalLink className="h-3 w-3 sm:mr-2" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No calendar updates</h3>
                    <p className="text-muted-foreground text-center text-sm mb-6">
                      Calendar sync updates will appear here
                    </p>
                    <Button onClick={() => navigate("/rel8/outreach")} size="sm">
                      View Outreach
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
