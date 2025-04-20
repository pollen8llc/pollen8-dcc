
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/models/types";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

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
      <div className="container mx-auto px-4 py-10">
        <Card className="glass dark:glass-dark">
          <CardHeader>
            <CardTitle>Dot Connector Dashboard</CardTitle>
            <Separator className="my-3" />
          </CardHeader>
          <CardContent>
            <div className="text-lg mb-5">
              Welcome to the Dot Connector Dashboard! Here you can visualize and manage the connections between communities, members, and projects as an organizer.
            </div>
            <div className="text-muted-foreground mb-6">
              {/* This box provides a hint of intended future interactivity */}
              (Coming soon) You will be able to connect members from different communities, manage collaboration requests, and view relationship graphs here.
            </div>
            <div className="text-sm text-gray-400">
              If you have suggestions for features, please let us know!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DotConnectorDashboard;
