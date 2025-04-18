
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Users, Settings } from "lucide-react";

interface AdminNavigationProps {
  onNavigate: (path: string) => void;
}

const AdminNavigation = ({ onNavigate }: AdminNavigationProps) => {
  return (
    <>
      <h3 className="text-sm font-medium text-purple-500 mb-1">Admin</h3>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => onNavigate("/admin")}
      >
        <Shield className="mr-2 h-4 w-4" />
        Admin Dashboard
      </Button>
      
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => onNavigate("/admin?tab=users")}
      >
        <Users className="mr-2 h-4 w-4" />
        User Management
      </Button>
      
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => onNavigate("/admin?tab=settings")}
      >
        <Settings className="mr-2 h-4 w-4" />
        System Settings
      </Button>
    </>
  );
};

export default AdminNavigation;
