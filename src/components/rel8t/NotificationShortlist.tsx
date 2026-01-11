import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  Bell, 
  User, 
  Building2, 
  ArrowRight,
  UserPlus,
  Mail,
  Calendar,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
  metadata: Record<string, any> | null;
}

const NotificationShortlist = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ["dashboard-notifications-shortlist"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("cross_platform_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;
      return data as Notification[];
    },
    refetchOnMount: true,
    staleTime: 0
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-notifications-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cross_platform_notifications'
        },
        () => refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "invite_contact":
        return UserPlus;
      case "email":
        return Mail;
      case "calendar":
        return Calendar;
      case "message":
        return MessageSquare;
      default:
        return Bell;
    }
  };

  const getReference = (notification: Notification) => {
    const metadata = notification.metadata;
    if (!metadata) return null;
    
    if (metadata.contactName || metadata.contact_name) {
      return { type: 'contact', name: metadata.contactName || metadata.contact_name };
    }
    if (metadata.userName || metadata.user_name) {
      return { type: 'user', name: metadata.userName || metadata.user_name };
    }
    if (metadata.communityName || metadata.community_name) {
      return { type: 'community', name: metadata.communityName || metadata.community_name };
    }
    return null;
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.is_read) {
      await supabase
        .from("cross_platform_notifications")
        .update({ is_read: true })
        .eq("id", notification.id);
      
      queryClient.invalidateQueries({ queryKey: ["dashboard-notifications-shortlist"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications"] });
    }
    
    // Navigate to notifications page
    navigate("/rel8/notifications");
  };

  if (isLoading) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border-primary/20 mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading notifications...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!notifications || notifications.length === 0) {
    return null;
  }

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
                <Bell className="w-6 h-6 text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Recent Notifications</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
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
          <div className="space-y-2">
            {notifications.map((notification, index) => {
              const Icon = getNotificationIcon(notification.notification_type);
              const reference = getReference(notification);
              const ReferenceIcon = reference?.type === 'community' ? Building2 : User;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full rounded-xl border-2 overflow-hidden transition-all duration-300 text-left",
                      "hover:bg-muted/30",
                      notification.is_read
                        ? "bg-card/40 border-border/50"
                        : "bg-primary/5 border-primary/30"
                    )}
                  >
                    <div className="px-4 py-3 flex items-center gap-4">
                      {/* Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        notification.is_read
                          ? "bg-muted/50 text-muted-foreground"
                          : "bg-primary/20 text-primary"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={cn(
                            "font-semibold text-sm truncate",
                            notification.is_read && "text-muted-foreground"
                          )}>
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {notification.message}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {reference && (
                          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                            <ReferenceIcon className="w-3 h-3" />
                            <span className="max-w-[80px] truncate">{reference.name}</span>
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(notification.created_at), "MMM d")}
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationShortlist;
