
import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, Users, Bug, Shield, Mail, FolderKanban } from "lucide-react";
import { User } from "@/models/types";
import { usePermissions } from "@/hooks/usePermissions";

interface MainNavigationProps {
  onNavigate: (path: string) => void;
  currentUser: User | null;
}

const MainNavigation = ({ onNavigate, currentUser }: MainNavigationProps) => {
  const { isAdmin, isOrganizer } = usePermissions(currentUser);
  
  // Add debug logging
  console.log("MainNavigation rendering with:", {
    user: currentUser?.id || "No user",
    isAdmin: isAdmin(),
    isOrganizer: isOrganizer(),
    role: currentUser?.role || "No role",
    managedCommunities: currentUser?.managedCommunities || []
  });

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
      
      {currentUser && (
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => onNavigate("/communities/join")}
        >
          <Users className="mr-2 h-4 w-4" />
          Join Communities
        </Button>
      )}
      
      {isOrganizer() && (
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => onNavigate("/organizer/dot-connector")}
        >
          <FolderKanban className="mr-2 h-4 w-4" />
          Manage Communities
        </Button>
      )}
      
      {isOrganizer() && (
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => onNavigate("/organizer/invites")}
        >
          <Mail className="mr-2 h-4 w-4" />
          Manage Invites
        </Button>
      )}
      
      {isAdmin() && (
        <>
          <h3 className="text-sm font-medium text-purple-500 mt-4 mb-1">Admin</h3>
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
