import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, RefreshCw, ExternalLink, Mail, AlertCircle, CheckCircle2, Clock, Calendar, GitBranch, Bell } from "lucide-react";
import { downloadICS } from "@/utils/icsDownload";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CrossPlatformNotificationCard } from "@/components/rel8t/CrossPlatformNotificationCard";

type NotificationStatus = "all" | "sent" | "pending" | "failed";
type NotificationTab = "platform" | "emails" | "calendar";

export default function Notifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<NotificationStatus>("all");
  const [activeTab, setActiveTab] = useState<NotificationTab>("platform");

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
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Track email notifications and calendar synchronization updates</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NotificationTab)} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
            <TabsTrigger value="platform">
              <Bell className="h-4 w-4 mr-2" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="emails">
              <Mail className="h-4 w-4 mr-2" />
              Emails
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="mt-6">
            {platformNotificationsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : platformNotifications && platformNotifications.length > 0 ? (
              <div className="space-y-4">
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
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Platform notifications will appear here when you receive updates
                  </p>
                  <Button onClick={() => navigate("/rel8/connect")}>
                    Go to REL8 Connect
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="emails" className="mt-6">
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as NotificationStatus)} className="mb-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredNotifications && filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card key={notification.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(notification.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground truncate">{notification.subject}</h3>
                          {getStatusBadge(notification.status)}
                          {notification.notification_type === "outreach_created" && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                              Outreach Task
                            </Badge>
                          )}
                          {notification.has_ics_attachment && (
                            <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-400/30">
                              <Calendar className="h-3 w-3 mr-1" />
                              ICS
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Created: {format(new Date(notification.created_at), "PPP 'at' p")}</p>
                          {notification.sent_at && (
                            <p>Sent: {format(new Date(notification.sent_at), "PPP 'at' p")}</p>
                          )}
                          {notification.scheduled_at && (
                            <p>Scheduled: {format(new Date(notification.scheduled_at), "PPP 'at' p")}</p>
                          )}
                          {notification.notification_type === "outreach_created" && (notification.metadata as any)?.systemEmail && (
                            <p className="font-mono text-xs">System: {(notification.metadata as any).systemEmail}</p>
                          )}
                        </div>

                        {notification.error_message && (
                          <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p className="text-sm text-destructive font-medium">Error:</p>
                            <p className="text-sm text-destructive/80 mt-1">{notification.error_message}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {notification.has_ics_attachment && notification.ics_data && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadICS(notification)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          ICS
                        </Button>
                      )}
                      
                      {notification.status === "failed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => retryEmailMutation.mutate(notification.id)}
                          disabled={retryEmailMutation.isPending}
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${retryEmailMutation.isPending ? 'animate-spin' : ''}`} />
                          Retry
                        </Button>
                      )}

                      {notification.trigger_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate("/rel8/build-rapport")}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
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
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                {statusFilter === "all" 
                  ? "Email notifications will appear here when you create triggers"
                  : `No ${statusFilter} notifications found`}
              </p>
              <Button onClick={() => navigate("/rel8/build-rapport")}>
                Create Your First Trigger
              </Button>
            </CardContent>
          </Card>
        )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            {syncLogsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : syncLogs && syncLogs.length > 0 ? (
              <div className="space-y-4">
                {syncLogs.map((log: any) => (
                  <Card key={log.id} className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">
                            {getSyncTypeIcon(log.sync_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground truncate">
                                {log.outreach?.title || "Unknown Outreach"}
                              </h3>
                              {getSyncTypeBadge(log.sync_type)}
                            </div>
                            
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Updated: {format(new Date(log.created_at), "PPP 'at' p")}</p>
                              {log.email_from && <p>From: {log.email_from}</p>}
                              {log.email_subject && <p>Subject: {log.email_subject}</p>}
                              {log.sequence !== null && <p>Sequence: {log.sequence}</p>}
                            </div>

                            {log.changes && Object.keys(log.changes).length > 0 && (
                              <div className="mt-3 p-3 bg-muted/30 border border-border/30 rounded-lg">
                                <p className="text-sm font-medium mb-2">Changes:</p>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  {Object.entries(log.changes).map(([key, value]: [string, any]) => (
                                    <div key={key} className="flex gap-2">
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

                        <div className="flex flex-col gap-2">
                          {log.outreach?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate("/rel8/outreach")}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
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
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No calendar updates yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Calendar synchronization updates will appear here when you modify outreach events in your calendar app
                  </p>
                  <Button onClick={() => navigate("/rel8/outreach")}>
                    View Outreach Tasks
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
