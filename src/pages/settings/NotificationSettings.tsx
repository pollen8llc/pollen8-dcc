import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Mail, Bell, Clock } from "lucide-react";
import { useEffect } from "react";

const NotificationSettings = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [primaryEmail, setPrimaryEmail] = useState(currentUser?.email || "");
  const [backupEmail, setBackupEmail] = useState("");
  const [emailFrequency, setEmailFrequency] = useState("daily");
  const [notifications, setNotifications] = useState({
    newContacts: true,
    triggers: true,
    outreach: true,
    system: true,
    marketing: false,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleSaveEmailSettings = () => {
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleTestEmail = () => {
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to your primary email address.",
    });
  };

  return (
    <SettingsLayout 
      title="Notification Settings" 
      description="Configure your email and notification preferences"
    >
      {/* Email Routing */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Email Routing</CardTitle>
              <CardDescription>Configure where notifications are sent</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5">
          <div className="space-y-2">
            <Label htmlFor="primaryEmail">Primary Email</Label>
            <Input
              id="primaryEmail"
              type="email"
              value={primaryEmail}
              onChange={(e) => setPrimaryEmail(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="backupEmail">Backup Email (optional)</Label>
            <Input
              id="backupEmail"
              type="email"
              value={backupEmail}
              onChange={(e) => setBackupEmail(e.target.value)}
              className="bg-background/50"
              placeholder="backup@example.com"
            />
          </div>
          <Button variant="outline" onClick={handleTestEmail}>
            Send Test Email
          </Button>
        </CardContent>
      </Card>

      {/* Email Frequency */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Email Frequency</CardTitle>
              <CardDescription>How often to receive email digests</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <Select value={emailFrequency} onValueChange={setEmailFrequency}>
            <SelectTrigger className="bg-background/50 w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Summary</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Notification Types</CardTitle>
              <CardDescription>Choose what notifications to receive</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New contact submissions</Label>
              <p className="text-sm text-muted-foreground">When someone submits via invite link</p>
            </div>
            <Switch 
              checked={notifications.newContacts} 
              onCheckedChange={(checked) => setNotifications({ ...notifications, newContacts: checked })} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Trigger reminders</Label>
              <p className="text-sm text-muted-foreground">Scheduled follow-up reminders</p>
            </div>
            <Switch 
              checked={notifications.triggers} 
              onCheckedChange={(checked) => setNotifications({ ...notifications, triggers: checked })} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Outreach updates</Label>
              <p className="text-sm text-muted-foreground">Calendar sync and task updates</p>
            </div>
            <Switch 
              checked={notifications.outreach} 
              onCheckedChange={(checked) => setNotifications({ ...notifications, outreach: checked })} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>System notifications</Label>
              <p className="text-sm text-muted-foreground">Important system updates</p>
            </div>
            <Switch 
              checked={notifications.system} 
              onCheckedChange={(checked) => setNotifications({ ...notifications, system: checked })} 
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing emails</Label>
              <p className="text-sm text-muted-foreground">Product updates and tips</p>
            </div>
            <Switch 
              checked={notifications.marketing} 
              onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })} 
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveEmailSettings} className="w-full sm:w-auto">
        Save Notification Settings
      </Button>
    </SettingsLayout>
  );
};

export default NotificationSettings;
