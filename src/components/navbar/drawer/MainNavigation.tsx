
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Users, Bug, Shield, Mail } from "lucide-react";

interface MainNavigationProps {
  onNavigate: (path: string) => void;
  currentUser?: boolean;
  isAdmin?: boolean;
  isOrganizer?: boolean;
}

const MainNavigation = ({ onNavigate, currentUser, isAdmin, isOrganizer }: MainNavigationProps) => {
  return (
    <>
      <h3 className="text-sm font-medium mb-1">Navigation</h3>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => onNavigate("/")}
      >
        <Home className="mr-2 h-4 w-4" />
        Home
      </Button>
      
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => onNavigate("/communities/join")}
      >
        <Users className="mr-2 h-4 w-4" />
        Join Communities
      </Button>
      
      {isOrganizer && !isAdmin && (
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => onNavigate("/organizer/dot-connector")}
        >
          <Users className="mr-2 h-4 w-4" />
          Manage Communities
        </Button>
      )}
      
      {isOrganizer && !isAdmin && (
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => onNavigate("/organizer/invites")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Manage Invites
        </Button>
      )}
      
      {isAdmin && (
        <>
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
            onClick={() => onNavigate("/admin/debug")}
          >
            <Bug className="mr-2 h-4 w-4" />
            Debug Console
          </Button>
        </>
      )}
    </>
  );
};

export default MainNavigation;
