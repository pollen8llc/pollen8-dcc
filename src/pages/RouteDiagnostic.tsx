import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const RouteDiagnostic = () => {
  const { currentUser, isLoading } = useUser();
  const { session } = useSession();
  const navigate = useNavigate();

  const testRoutes = [
    { path: '/modul8', label: 'Modul8 Dashboard' },
    { path: '/modul8/dashboard', label: 'Modul8 Dashboard Alt' },
    { path: '/labr8', label: 'Labr8 Landing' },
    { path: '/labr8/dashboard', label: 'Labr8 Dashboard' },
    { path: '/labr8/auth', label: 'Labr8 Auth' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Route Diagnostic Tool</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Authentication Status</h3>
              <div className="space-y-2">
                <p>Loading: <Badge variant={isLoading ? "destructive" : "outline"}>{isLoading ? "Yes" : "No"}</Badge></p>
                <p>Session: <Badge variant={session ? "default" : "destructive"}>{session ? "Active" : "None"}</Badge></p>
                <p>Current User: <Badge variant={currentUser ? "default" : "destructive"}>{currentUser ? "Loaded" : "None"}</Badge></p>
                {currentUser && (
                  <p>Role: <Badge variant="outline">{currentUser.role || "No Role"}</Badge></p>
                )}
                {currentUser && (
                  <p>Profile Complete: <Badge variant={currentUser.profile_complete ? "default" : "destructive"}>{currentUser.profile_complete ? "Yes" : "No"}</Badge></p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Test Routes</h3>
              <div className="grid gap-2">
                {testRoutes.map((route) => (
                  <Button
                    key={route.path}
                    variant="outline"
                    onClick={() => navigate(route.path)}
                    className="justify-start"
                  >
                    {route.label} → {route.path}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Debug Info</h3>
              <pre className="bg-muted p-4 rounded text-sm overflow-auto">
                {JSON.stringify({
                  session: session ? { user: session.user?.email, expires: session.expires_at } : null,
                  currentUser: currentUser ? {
                    id: currentUser.id,
                    email: currentUser.email,
                    role: currentUser.role,
                    profile_complete: currentUser.profile_complete
                  } : null,
                  isLoading
                }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RouteDiagnostic;