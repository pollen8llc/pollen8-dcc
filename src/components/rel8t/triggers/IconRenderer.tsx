
import React from "react";
import { Mail, Calendar, Bell, AlertCircle } from "lucide-react";

export function renderTriggerIcon(action: string) {
  switch (action) {
    case "send_email":
      return <Mail className="h-5 w-5 text-blue-500" />;
    case "create_task":
      return <Calendar className="h-5 w-5 text-green-500" />;
    case "add_reminder":
      return <Bell className="h-5 w-5 text-amber-500" />;
    case "send_notification":
      return <AlertCircle className="h-5 w-5 text-purple-500" />;
    default:
      return <Mail className="h-5 w-5 text-blue-500" />;
  }
}
