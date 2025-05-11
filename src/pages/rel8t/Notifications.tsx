
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/rel8t/MetricCard";
import { Bell, Calendar, Clock, Check, AlertCircle, Mail, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { TriggerStatsCards } from "@/components/rel8t/triggers/TriggerStatsCards";
import { EmailNotificationsList } from "@/components/rel8t/triggers/EmailNotificationsList";
import { getEmailStatistics, getEmailNotifications } from "@/services/rel8t/emailService";
import { getActiveTriggerCount } from "@/services/rel8t/triggerService";
import { useNavigate } from "react-router-dom";

// Mock notification type - normally this would come from a service
type Notification = {
  id: string;
  type: 'email' | 'reminder' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
};

// Mock data for notifications - in a real app, this would come from an API
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'email',
    title: 'Monthly Newsletter',
    message: 'The monthly newsletter has been sent to your contacts.',
    date: '2025-05-05T10:30:00',
    read: false
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Follow-up with John Doe',
    message: 'Reminder to follow up with John Doe about the project proposal.',
    date: '2025-05-04T15:45:00',
    read: true
  },
  {
    id: '3',
    type: 'system',
    title: '3 New Contacts Added',
    message: 'You have successfully imported 3 new contacts from CSV.',
    date: '2025-05-03T09:15:00',
    read: true
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Check in with Sarah Smith',
    message: 'Time to send a follow-up message to Sarah Smith.',
    date: '2025-05-06T08:00:00',
    read: false
  },
  {
    id: '5',
    type: 'email',
    title: 'Welcome Email Sent',
    message: 'Welcome email has been sent to 2 new contacts.',
    date: '2025-05-01T11:20:00',
    read: true
  }
];

const NotificationCard = ({ notification }: { notification: Notification }) => {
  const [isRead, setIsRead] = useState(notification.read);
  
  const markAsRead = () => {
    setIsRead(true);
    // In a real app, you would call an API to mark the notification as read
  };
  
  const formattedDate = new Date(notification.date).toLocaleString();
  
  let icon;
  let bgColor = isRead ? 'bg-background' : 'bg-primary/5';
  
  switch (notification.type) {
    case 'email':
      icon = <Mail className="h-5 w-5 text-blue-500" />;
      break;
    case 'reminder':
      icon = <Clock className="h-5 w-5 text-amber-500" />;
      break;
    case 'system':
      icon = <AlertCircle className="h-5 w-5 text-purple-500" />;
      break;
  }
  
  return (
    <div className={`p-4 border rounded-md mb-3 ${bgColor} transition-colors`}>
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className={`text-base font-medium ${!isRead ? 'text-primary' : ''}`}>
              {notification.title}
            </h4>
            {!isRead && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2"
                onClick={markAsRead}
              >
                Mark read
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          <div className="text-xs text-muted-foreground mt-2">{formattedDate}</div>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch email statistics
  const { data: emailStats = { pending: 0, sent: 0, failed: 0, total: 0 } } = useQuery({
    queryKey: ["email-statistics"],
    queryFn: getEmailStatistics,
  });

  // Fetch active trigger count
  const { data: activeTriggerCount = 0 } = useQuery({
    queryKey: ["active-trigger-count"],
    queryFn: getActiveTriggerCount,
  });
  
  // Fetch email notifications
  const { data: emailNotifications = [] } = useQuery({
    queryKey: ["email-notifications"],
    queryFn: () => getEmailNotifications(),
  });
  
  // Filter notifications based on active tab
  const filteredNotifications = activeTab === "all" 
    ? mockNotifications 
    : activeTab === "unread"
    ? mockNotifications.filter(notification => !notification.read)
    : mockNotifications.filter(notification => notification.type === activeTab);

  // Count notifications by type
  const emailCount = mockNotifications.filter(n => n.type === 'email').length;
  const reminderCount = mockNotifications.filter(n => n.type === 'reminder').length;
  const systemCount = mockNotifications.filter(n => n.type === 'system').length;
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Track your outreach and notification activity
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate("/rel8t/wizard")}>
              <Plus className="mr-2 h-4 w-4" />
              Build a Relationship
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Unread Notifications"
            value={unreadCount}
            icon={<Bell className="h-5 w-5" />}
            color={unreadCount > 0 ? "warning" : "default"}
          />
          
          <MetricCard
            title="Email Notifications"
            value={emailCount}
            icon={<Mail className="h-5 w-5" />}
          />
          
          <MetricCard
            title="Reminders"
            value={reminderCount}
            icon={<Calendar className="h-5 w-5" />}
            color="success"
          />
          
          <MetricCard
            title="System Updates"
            value={systemCount}
            icon={<AlertCircle className="h-5 w-5" />}
          />
        </div>

        {/* Email Stats Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Email Activity</h2>
          <TriggerStatsCards
            pendingEmails={emailStats.pending}
            sentEmails={emailStats.sent}
            activeTriggers={activeTriggerCount}
          />
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Notifications</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/rel8t/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Manage Triggers
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex space-x-2 mb-4">
                <Button 
                  variant={activeTab === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("all")}
                >
                  All
                </Button>
                <Button 
                  variant={activeTab === "unread" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("unread")}
                  className="relative"
                >
                  Unread
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-[10px] text-primary-foreground px-1">
                      {unreadCount}
                    </span>
                  )}
                </Button>
                <Button 
                  variant={activeTab === "email" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("email")}
                >
                  Emails
                </Button>
                <Button 
                  variant={activeTab === "reminder" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("reminder")}
                >
                  Reminders
                </Button>
                <Button 
                  variant={activeTab === "system" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setActiveTab("system")}
                >
                  System
                </Button>
              </div>
              
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-2 font-semibold">No notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You don't have any {activeTab !== 'all' ? activeTab + ' ' : ''}notifications yet.
                  </p>
                </div>
              ) : (
                <div>
                  {filteredNotifications.map((notification) => (
                    <NotificationCard 
                      key={notification.id} 
                      notification={notification} 
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
              <EmailNotificationsList notifications={emailNotifications} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
