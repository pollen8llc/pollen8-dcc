import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { Eye, Share2, UserX } from "lucide-react";
import { useEffect } from "react";

const PrivacySettings = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [dataSharing, setDataSharing] = useState(false);
  const [allowContactRequests, setAllowContactRequests] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleSavePrivacySettings = () => {
    toast({
      title: "Privacy Settings Saved",
      description: "Your privacy preferences have been updated.",
    });
  };

  return (
    <SettingsLayout 
      title="Privacy Settings" 
      description="Control your privacy and security preferences"
    >
      {/* Profile Visibility */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Profile Visibility</CardTitle>
              <CardDescription>Choose who can see your profile</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5">
          <div className="space-y-2">
            <Label>Who can view your profile?</Label>
            <Select value={profileVisibility} onValueChange={setProfileVisibility}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone</SelectItem>
                <SelectItem value="connections">Connections Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Data Sharing</CardTitle>
              <CardDescription>Control how your data is shared</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-5 pb-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Share analytics data</Label>
              <p className="text-sm text-muted-foreground">Help us improve by sharing usage data</p>
            </div>
            <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow contact requests</Label>
              <p className="text-sm text-muted-foreground">Let others send you connection requests</p>
            </div>
            <Switch checked={allowContactRequests} onCheckedChange={setAllowContactRequests} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow direct messages</Label>
              <p className="text-sm text-muted-foreground">Receive messages from other users</p>
            </div>
            <Switch checked={allowMessages} onCheckedChange={setAllowMessages} />
          </div>
        </CardContent>
      </Card>

      {/* Blocked Users */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <UserX className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Blocked Users</CardTitle>
              <CardDescription>Manage users you've blocked</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <p className="text-sm text-muted-foreground">No blocked users</p>
        </CardContent>
      </Card>

      <Button onClick={handleSavePrivacySettings} className="w-full sm:w-auto">
        Save Privacy Settings
      </Button>
    </SettingsLayout>
  );
};

export default PrivacySettings;
