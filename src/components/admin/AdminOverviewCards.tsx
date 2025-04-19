
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminOverviewCardsProps {
  onTabChange: (tab: string) => void;
}

const AdminOverviewCards = ({ onTabChange }: AdminOverviewCardsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="hover:shadow-md cursor-pointer transition-all" onClick={() => onTabChange("users")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, assign roles and permissions
          </p>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md cursor-pointer transition-all" onClick={() => onTabChange("settings")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">System Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure global settings and system preferences
          </p>
        </CardContent>
      </Card>

      <Card 
        className="hover:shadow-md cursor-pointer transition-all" 
        onClick={() => navigate("/admin/debug")}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Component Debugger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            <p className="text-sm text-muted-foreground">
              Debug and test components
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewCards;
