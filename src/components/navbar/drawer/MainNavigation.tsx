
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, UserIcon, Library, BookOpen } from "lucide-react";

interface MainNavigationProps {
  currentUser: boolean;
  onNavigate: (path: string) => void;
}

const MainNavigation = ({ currentUser, onNavigate }: MainNavigationProps) => {
  return (
    <>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">Main Navigation</h3>
      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => onNavigate("/")}
      >
        <Home className="mr-2 h-4 w-4" />
        Communities
      </Button>

      {currentUser && (
        <>
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => onNavigate("/profile")}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => onNavigate("/knowledge/7")}
          >
            <Library className="mr-2 h-4 w-4" />
            Knowledge Base
          </Button>
        </>
      )}

      <Button 
        variant="ghost" 
        className="w-full justify-start" 
        onClick={() => onNavigate("/documentation")}
      >
        <BookOpen className="mr-2 h-4 w-4" />
        Documentation
      </Button>
    </>
  );
};

export default MainNavigation;
