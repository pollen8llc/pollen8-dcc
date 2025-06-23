
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  Book, 
  Contact,
  LayoutDashboard,
  UserSearch,
  PlusCircle
} from 'lucide-react';

const Welcome = () => {
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();

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
    return <Navigate to="/" replace />;
  }

  const isServiceProvider = currentUser.role === 'SERVICE_PROVIDER';
  const isOrganizer = currentUser.role === 'ORGANIZER' || currentUser.role === 'ADMIN';

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to ECO8</h1>
            <p className="text-xl text-muted-foreground">
              Your unified platform for knowledge, relationships, and collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Platform-specific cards */}
            {!isServiceProvider && (
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/modul8')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#00eada]" />
                    Modul8
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Connect with service providers and manage your projects
                  </p>
                  <Button className="w-full">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Open Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}

            {isServiceProvider && (
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/labr8/inbox')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#00eada]" />
                    LAB-R8
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Manage your service requests and client relationships
                  </p>
                  <Button className="w-full">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Open Inbox
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/rel8t')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Contact className="h-5 w-5 text-[#00eada]" />
                  REL8-T
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Manage your contacts and relationships effectively
                </p>
                <Button className="w-full">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Open Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/knowledge/resources')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5 text-[#00eada]" />
                  Knowledge Base
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Access and share knowledge resources
                </p>
                <Button className="w-full">
                  <Book className="h-4 w-4 mr-2" />
                  Browse Resources
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/profiles/search')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#00eada]" />
                  Find People
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Search and connect with other platform members
                </p>
                <Button className="w-full">
                  <UserSearch className="h-4 w-4 mr-2" />
                  Search Profiles
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/knowledge/create')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-[#00eada]" />
                  Create Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Share your knowledge by creating articles and resources
                </p>
                <Button className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Article
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <UserSearch className="h-4 w-4 mr-2" />
                View My Profile
              </Button>
              <Button variant="outline" onClick={() => navigate('/settings')}>
                <Building2 className="h-4 w-4 mr-2" />
                Settings
              </Button>
              {isOrganizer && (
                <Button variant="outline" onClick={() => navigate('/invites')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Invites
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
