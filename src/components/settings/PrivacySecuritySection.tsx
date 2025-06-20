
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, UserX, Lock } from "lucide-react";

export function PrivacySecuritySection() {
  const { toast } = useToast();
  const [profileVisibility, setProfileVisibility] = useState("connections");
  const [allowDataSharing, setAllowDataSharing] = useState(false);
  const [allowContactRequests, setAllowContactRequests] = useState(true);
  const [allowMessageNotifications, setAllowMessageNotifications] = useState(true);

  const handleSavePrivacySettings = async () => {
    try {
      // TODO: Implement privacy settings update
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
          <CardDescription>
            Control who can see your profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visibility">Who can see your profile</Label>
            <Select value={profileVisibility} onValueChange={setProfileVisibility}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Everyone (Public)</SelectItem>
                <SelectItem value="connections">Direct Connections Only</SelectItem>
                <SelectItem value="connections2">Up to 2nd Degree Connections</SelectItem>
                <SelectItem value="connections3">Up to 3rd Degree Connections</SelectItem>
                <SelectItem value="private">Only Me (Private)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Sharing
          </CardTitle>
          <CardDescription>
            Manage how your data is shared within the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-sharing">Allow data sharing for platform improvements</Label>
              <p className="text-sm text-muted-foreground">
                Help improve the platform by sharing anonymized usage data
              </p>
            </div>
            <Switch
              id="data-sharing"
              checked={allowDataSharing}
              onCheckedChange={setAllowDataSharing}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="contact-requests">Allow contact requests</Label>
              <p className="text-sm text-muted-foreground">
                Let other users send you contact requests
              </p>
            </div>
            <Switch
              id="contact-requests"
              checked={allowContactRequests}
              onCheckedChange={setAllowContactRequests}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="message-notifications">Message notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when someone messages you
              </p>
            </div>
            <Switch
              id="message-notifications"
              checked={allowMessageNotifications}
              onCheckedChange={setAllowMessageNotifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Blocked Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Blocked Users
          </CardTitle>
          <CardDescription>
            Manage users you have blocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <UserX className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No blocked users</p>
            <p className="text-sm">Users you block will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSavePrivacySettings} className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Save Privacy Settings
        </Button>
      </div>
    </div>
  );
}
