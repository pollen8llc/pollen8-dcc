
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { UserRole } from "@/models/types";
import { Users, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const DotConnectorDashboard = () => {
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
      <div className="container mx-auto px-2 sm:px-4 py-6 max-w-5xl">
        <Card className={cn("glass dark:glass-dark px-2 py-1 md:px-4 md:py-2", "shadow-xl")}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold">
                  Dot Connector Dashboard
                </CardTitle>
                <Separator className="my-2" />
                <div className="text-muted-foreground mt-1 mb-2 text-base">
                  Manage your invites and user connections
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Configure your organizer settings and preferences
                </p>
                <Button asChild className="w-full">
                  <Link to="/rel8/settings">Go to Settings</Link>
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DotConnectorDashboard;
