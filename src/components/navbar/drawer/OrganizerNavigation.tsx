
import React from 'react';
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Shield } from "lucide-react";

interface OrganizerNavigationProps {
  onNavigate: (path: string) => void;
}

const OrganizerNavigation = ({ onNavigate }: OrganizerNavigationProps) => {
  return (
    <>
      <h3 className="text-sm font-medium text-blue-500 mb-1">Management</h3>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => onNavigate("/organizer")}
      >
        <Shield className="mr-2 h-4 w-4" />
        Community Management
      </Button>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => onNavigate("/organizer?tab=overview")}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Organizer Dashboard
      </Button>
    </>
  );
};

export default OrganizerNavigation;
