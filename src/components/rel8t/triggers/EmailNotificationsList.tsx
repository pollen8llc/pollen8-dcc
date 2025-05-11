
import React from "react";
import { format } from "date-fns";
import { Mail } from "lucide-react";
import { EmailNotification } from "@/services/rel8t/emailService";

interface EmailNotificationsListProps {
  notifications: EmailNotification[];
}

export function EmailNotificationsList({ notifications }: EmailNotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <Mail className="mx-auto h-10 w-10 text-muted-foreground/50" />
        <h3 className="mt-2 text-lg font-semibold">No email notifications</h3>
        <p className="text-muted-foreground mt-1">
          No outreach emails have been scheduled yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="border rounded-lg p-4"
        >
          <div className="flex items-start">
            <Mail className="h-5 w-5 mr-3 text-blue-500" />
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-medium">{notification.subject}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  notification.status === "sent" 
                    ? "bg-green-100 text-green-800" 
                    : notification.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {notification.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                To: {notification.recipient_name || notification.recipient_email}
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {notification.sent_at 
                  ? `Sent on ${format(new Date(notification.sent_at), "PPP 'at' p")}`
                  : notification.scheduled_for
                  ? `Scheduled for ${format(new Date(notification.scheduled_for), "PPP 'at' p")}`
                  : "Not scheduled"
                }
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
