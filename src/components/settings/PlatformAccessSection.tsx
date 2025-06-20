
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Monitor, Key, Plug, LogOut } from "lucide-react";

export function PlatformAccessSection() {
  const { toast } = useToast();
  
  // Mock data for active sessions
  const [activeSessions] = useState([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, NY",
      lastActive: "Now",
      current: true,
      icon: Monitor
    },
    {
      id: "2", 
      device: "Mobile App on iPhone",
      location: "New York, NY",
      lastActive: "2 hours ago",
      current: false,
      icon: Smartphone
    }
  ]);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      // TODO: Implement session revocation
      toast({
        title: "Session revoked",
        description: "The session has been revoked successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      // TODO: Implement revoke all sessions
      toast({
        title: "All sessions revoked",
        description: "All other sessions have been revoked. You will remain logged in on this device."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke sessions. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      // TODO: Implement API key generation
      toast({
        title: "API key generated",
        description: "Your new API key has been generated. Please store it securely."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage your active login sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeSessions.map((session) => {
            const Icon = session.icon;
            return (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{session.device}</p>
                      {session.current && <Badge variant="secondary">Current</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{session.location}</p>
                    <p className="text-sm text-muted-foreground">Last active: {session.lastActive}</p>
                  </div>
                </div>
                {!session.current && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke session?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will sign out this device and require the user to log in again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRevokeSession(session.id)}>
                          Revoke Session
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            );
          })}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Revoke All Other Sessions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Revoke all other sessions?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will sign out all other devices. You will remain logged in on this device.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRevokeAllSessions}>
                  Revoke All Sessions
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Access
          </CardTitle>
          <CardDescription>
            Manage API keys for integrations and third-party access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No API keys generated</p>
            <p className="text-sm">Generate an API key to access the platform programmatically</p>
          </div>
          
          <Button onClick={handleGenerateApiKey} className="w-full flex items-center gap-2">
            <Key className="h-4 w-4" />
            Generate New API Key
          </Button>
        </CardContent>
      </Card>

      {/* Connected Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Connected Applications
          </CardTitle>
          <CardDescription>
            Manage third-party applications that have access to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Plug className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No connected applications</p>
            <p className="text-sm">Third-party applications you authorize will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
