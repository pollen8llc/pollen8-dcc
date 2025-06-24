
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, Bell, Settings } from "lucide-react";

export function EmailNotificationSection() {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    primaryEmail: "",
    backupEmail: "",
    emailFrequency: "immediate",
    marketingEmails: true,
    systemNotifications: true,
    outreachNotifications: true,
    triggerNotifications: true,
    weeklyDigest: false
  });

  const handleSaveEmailSettings = async () => {
    try {
      // TODO: Implement email settings update
      toast({
        title: "Email settings updated",
        description: "Your email preferences have been saved."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTestEmail = async () => {
    try {
      // TODO: Implement test email functionality
      toast({
        title: "Test email sent",
        description: "A test email has been sent to your primary email address."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Routing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Routing
          </CardTitle>
          <CardDescription>
            Configure where different types of emails are sent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-email">Primary Email</Label>
            <Input
              id="primary-email"
              type="email"
              value={emailSettings.primaryEmail}
              onChange={(e) => setEmailSettings({ ...emailSettings, primaryEmail: e.target.value })}
              placeholder="your@email.com"
            />
            <p className="text-sm text-muted-foreground">
              Used for system notifications and important updates
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backup-email">Backup Email (Optional)</Label>
            <Input
              id="backup-email"
              type="email"
              value={emailSettings.backupEmail}
              onChange={(e) => setEmailSettings({ ...emailSettings, backupEmail: e.target.value })}
              placeholder="backup@email.com"
            />
            <p className="text-sm text-muted-foreground">
              Used for account recovery and critical notifications
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-frequency">Email Frequency</Label>
            <Select 
              value={emailSettings.emailFrequency} 
              onValueChange={(value) => setEmailSettings({ ...emailSettings, emailFrequency: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleTestEmail} variant="outline" size="sm">
            Send Test Email
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose which notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="system-notifications">System Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Account updates, security alerts, and system maintenance
              </p>
            </div>
            <Switch
              id="system-notifications"
              checked={emailSettings.systemNotifications}
              onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, systemNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="outreach-notifications">Outreach Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Updates about your outreach campaigns and responses
              </p>
            </div>
            <Switch
              id="outreach-notifications"
              checked={emailSettings.outreachNotifications}
              onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, outreachNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="trigger-notifications">Trigger Notifications</Label>
              <p className="text-sm text-muted-foreground">
                When your automation triggers are executed
              </p>
            </div>
            <Switch
              id="trigger-notifications"
              checked={emailSettings.triggerNotifications}
              onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, triggerNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Product updates, tips, and promotional content
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={emailSettings.marketingEmails}
              onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, marketingEmails: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest">Weekly Activity Digest</Label>
              <p className="text-sm text-muted-foreground">
                Summary of your platform activity and insights
              </p>
            </div>
            <Switch
              id="weekly-digest"
              checked={emailSettings.weeklyDigest}
              onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, weeklyDigest: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveEmailSettings} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Save Email Settings
        </Button>
      </div>
    </div>
  );
}
