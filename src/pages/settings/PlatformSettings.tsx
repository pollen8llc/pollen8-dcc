import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { SettingsLayout } from "@/components/settings/SettingsLayout";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Monitor, Key, Link, Smartphone, Laptop, Globe } from "lucide-react";
import { useEffect } from "react";

const PlatformSettings = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeSessions] = useState([
    { id: "1", device: "Chrome on MacOS", location: "San Francisco, CA", lastActive: "Now", current: true },
    { id: "2", device: "Safari on iPhone", location: "San Francisco, CA", lastActive: "2 hours ago", current: false },
    { id: "3", device: "Firefox on Windows", location: "New York, NY", lastActive: "1 day ago", current: false },
  ]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleRevokeSession = (sessionId: string) => {
    toast({
      title: "Session Revoked",
      description: "The session has been revoked successfully.",
    });
  };

  const handleRevokeAllSessions = () => {
    toast({
      title: "All Sessions Revoked",
      description: "All other sessions have been revoked.",
    });
  };

  const handleGenerateApiKey = () => {
    toast({
      title: "API Key Generated",
      description: "A new API key has been generated. Copy it now as it won't be shown again.",
    });
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes("iPhone") || device.includes("Android")) return Smartphone;
    if (device.includes("Mac") || device.includes("Windows")) return Laptop;
    return Globe;
  };

  return (
    <SettingsLayout 
      title="Platform Settings" 
      description="Manage your sessions, API access, and integrations"
    >
      {/* Active Sessions */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Active Sessions</CardTitle>
                <CardDescription>Manage your logged-in devices</CardDescription>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">Revoke All</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke all sessions?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log you out from all other devices. You'll need to log in again on those devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRevokeAllSessions}>
                    Revoke All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-5 pb-5">
          {activeSessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.device);
            return (
              <div 
                key={session.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{session.device}</span>
                      {session.current && (
                        <Badge variant="secondary" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session.location} · {session.lastActive}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRevokeSession(session.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* API Access */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">API Access</CardTitle>
              <CardDescription>Generate API keys for integrations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <p className="text-sm text-muted-foreground mb-4">
            API keys allow external applications to access your data. Keep them secure.
          </p>
          <Button onClick={handleGenerateApiKey} variant="outline">
            <Key className="h-4 w-4 mr-2" />
            Generate New API Key
          </Button>
        </CardContent>
      </Card>

      {/* Connected Apps */}
      <Card className="bg-card/40 backdrop-blur-md border-border/50">
        <CardHeader className="space-y-2 p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Link className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Connected Applications</CardTitle>
              <CardDescription>Third-party apps with access to your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <p className="text-sm text-muted-foreground">No connected applications</p>
        </CardContent>
      </Card>
    </SettingsLayout>
  );
};

export default PlatformSettings;
