
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Users, Bug } from "lucide-react";

interface MainNavigationProps {
  onNavigate: (path: string) => void;
  currentUser?: boolean;
  isAdmin?: boolean;
}

const MainNavigation = ({ onNavigate, currentUser, isAdmin }: MainNavigationProps) => {
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
      
      {isAdmin && (
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => onNavigate("/admin/debug")}
        >
          <Bug className="mr-2 h-4 w-4" />
          Debug Console
        </Button>
      )}
    </>
  );
};

export default MainNavigation;
