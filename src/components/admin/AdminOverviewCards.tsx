
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminOverviewCardsProps {
  onTabChange: (tab: string) => void;
}

const AdminOverviewCards = ({ onTabChange }: AdminOverviewCardsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card 
        className="hover:shadow-md hover:shadow-[#00eada]/20 cursor-pointer transition-all h-[180px]" 
        onClick={() => onTabChange("users")}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Users className="mr-2 h-5 w-5 text-[#00eada]" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, assign roles and permissions
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="hover:shadow-md hover:shadow-[#00eada]/20 cursor-pointer transition-all h-[180px]" 
        onClick={() => onTabChange("settings")}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Settings className="mr-2 h-5 w-5 text-[#00eada]" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Configure global settings and system preferences
          </p>
        </CardContent>
      </Card>

      <Card 
        className="hover:shadow-md hover:shadow-[#00eada]/20 cursor-pointer transition-all h-[180px]" 
        onClick={() => navigate("/admin/debugger")}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Bug className="mr-2 h-5 w-5 text-[#00eada]" />
            Component Debugger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Debug and test components
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewCards;
