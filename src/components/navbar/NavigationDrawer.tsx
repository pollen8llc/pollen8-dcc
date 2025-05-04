
import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@/models/types";
import {
  Sheet,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import MainNavigation from "./drawer/MainNavigation";
import AuthActions from "./drawer/AuthActions";
import UserHeader from "./drawer/UserHeader";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  logout: () => Promise<void>;
}

const NavigationDrawer = ({
  open,
  onOpenChange,
  currentUser,
  logout,
}: NavigationDrawerProps) => {
  const navigate = useNavigate();

  // Add debug logging for drawer authentication state
  console.log("NavigationDrawer rendering with user:", currentUser?.id || "No user");

  const handleNavigate = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleLogout = async () => {
    await logout();
    handleNavigate("/auth");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <div className="flex-1 py-2 space-y-6">
          {currentUser && <UserHeader currentUser={currentUser} />}
          
          <div className="space-y-4">
            <MainNavigation 
              onNavigate={handleNavigate}
              currentUser={currentUser}
            />
          </div>
        </div>

        <SheetFooter className="mt-auto">
          <AuthActions 
            currentUser={!!currentUser} 
            onNavigate={handleNavigate} 
            onLogout={handleLogout} 
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
