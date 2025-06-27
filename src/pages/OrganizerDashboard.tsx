
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { UserRole } from "@/models/types";
import { 
  Users, 
  Bell, 
  Settings, 
  Briefcase, 
  Network, 
  BookOpen, 
  Building2,
  MessageSquare,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

const OrganizerDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Only allow ORGANIZER or ADMIN
  if (!currentUser || ![UserRole.ORGANIZER, UserRole.ADMIN].includes(currentUser.role)) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-2 sm:px-4 py-6 max-w-6xl">
        <Card className={cn("glass dark:glass-dark px-2 py-1 md:px-4 md:py-2", "shadow-xl")}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold">
                  Organizer Dashboard
                </CardTitle>
                <Separator className="my-2" />
                <div className="text-muted-foreground mt-1 mb-2 text-base">
                  Access all platform services and manage your organization
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-6 space-y-8">
            {/* Platform Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="shadow hover:shadow-lg transition-all duration-300 border-l-4 border-l-[#00eada]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Briefcase className="mr-2 h-5 w-5 text-[#00eada]" />
                      Modul8
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Service marketplace for finding and managing providers
                    </p>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to="/modul8/dashboard">Dashboard</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/modul8/request/new">New Request</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Network className="mr-2 h-5 w-5 text-blue-500" />
                      REL8T
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Relationship management and networking platform
                    </p>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to="/rel8/dashboard">Dashboard</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/rel8/contacts">Contacts</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Building2 className="mr-2 h-5 w-5 text-purple-500" />
                      LAB-R8
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Project management and service provider workspace
                    </p>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to="/labr8/dashboard">Dashboard</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/labr8/projects">Projects</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-green-500" />
                      Knowledge Base
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Share knowledge, articles, and best practices
                    </p>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to="/knowledge">Browse</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/knowledge/create">Create</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow hover:shadow-lg transition-all duration-300 border-l-4 border-l-orange-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="mr-2 h-5 w-5 text-orange-500" />
                      Smart Engage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Automated outreach and engagement management
                    </p>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to="/rel8/triggers">Triggers</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/rel8/outreach">Outreach</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow hover:shadow-lg transition-all duration-300 border-l-4 border-l-pink-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="mr-2 h-5 w-5 text-pink-500" />
                      Dot Connector
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect people and opportunities across your network
                    </p>
                    <div className="flex gap-2">
                      <Button asChild className="flex-1" size="sm">
                        <Link to="/dot-connector">Dashboard</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/connections">Connections</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Management Tools */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Management Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      Manage Invites
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Create and manage invitation links for new users
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/invites">View Invites</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="shadow hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Bell className="mr-2 h-5 w-5 text-primary" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      View system notifications and alerts
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/rel8/notifications">View Notifications</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="shadow hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Settings className="mr-2 h-5 w-5 text-primary" />
                      Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure your account settings and preferences
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/settings">Account Settings</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
