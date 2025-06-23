import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Contact,
  Users,
  TrendingUp,
  Settings,
  Book,
  Zap,
  LayoutDashboard
} from 'lucide-react';

const Rel8tDashboard = () => {
  const { currentUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">REL8-T Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center"><Contact className="mr-2 h-4 w-4" /> Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Manage your contacts and relationships.</p>
                  <Button variant="outline" className="mt-2 w-full" onClick={() => window.location.href = '/rel8t/contacts'}>
                    View Contacts
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center"><Users className="mr-2 h-4 w-4" /> Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Organize your contacts into categories.</p>
                  <Button variant="outline" className="mt-2 w-full" onClick={() => window.location.href = '/rel8t/categories'}>
                    View Categories
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center"><Zap className="mr-2 h-4 w-4" /> Triggers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Automate actions based on contact interactions.</p>
                  <Button variant="outline" className="mt-2 w-full" onClick={() => window.location.href = '/rel8t/triggers'}>
                    View Triggers
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center"><Book className="mr-2 h-4 w-4" /> Smart Engage</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Engage with your contacts in a smart way.</p>
                  <Button variant="outline" className="mt-2 w-full" onClick={() => window.location.href = '/rel8t/smart-engage'}>
                    View Smart Engage
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-4 w-4" /> Build Rapport</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Build rapport with your contacts.</p>
                  <Button variant="outline" className="mt-2 w-full" onClick={() => window.location.href = '/rel8t/build-rapport'}>
                    View Rapport Tools
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center"><Settings className="mr-2 h-4 w-4" /> Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Configure your REL8-T settings.</p>
                  <Button variant="outline" className="mt-2 w-full" onClick={() => window.location.href = '/settings'}>
                    View Settings
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Rel8tDashboard;
