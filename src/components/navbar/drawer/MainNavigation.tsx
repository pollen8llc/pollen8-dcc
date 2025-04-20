
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Users, Plus } from "lucide-react";

interface MainNavigationProps {
  onNavigate: (path: string) => void;
  currentUser?: boolean;
}

const MainNavigation = ({ onNavigate, currentUser }: MainNavigationProps) => {
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
      {currentUser && (
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => onNavigate("/community-creation-test")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Test Community Creation
        </Button>
      )}
    </>
  );
};

export default MainNavigation;
