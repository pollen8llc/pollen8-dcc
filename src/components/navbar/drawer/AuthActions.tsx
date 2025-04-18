
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, UserIcon } from "lucide-react";

interface AuthActionsProps {
  currentUser: boolean;
  onNavigate: (path: string) => void;
  onLogout: () => Promise<void>;
}

const AuthActions = ({ currentUser, onNavigate, onLogout }: AuthActionsProps) => {
  return (
    <>
      {currentUser ? (
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" 
          onClick={onLogout}
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
