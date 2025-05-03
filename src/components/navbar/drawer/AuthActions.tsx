
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, UserIcon } from "lucide-react";

interface AuthActionsProps {
  currentUser: boolean;
  onNavigate: (path: string) => void;
  onLogout: () => Promise<void>;
}

const AuthActions = ({ currentUser, onNavigate, onLogout }: AuthActionsProps) => {
  const handleLogout = async () => {
    try {
      await onLogout();
      // Navigation is handled in the parent component
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      {currentUser ? (
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={() => onNavigate("/auth")}
        >
          <UserIcon className="mr-2 h-4 w-4" />
          Login / Sign up
        </Button>
      )}
    </>
  );
};

export default AuthActions;
