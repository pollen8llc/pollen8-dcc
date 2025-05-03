
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole } from "@/models/types";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import MainNavigation from "./drawer/MainNavigation";
import AuthActions from "./drawer/AuthActions";
import UserHeader from "./drawer/UserHeader";
import { usePermissions } from "@/hooks/usePermissions";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
}

const NavigationDrawer = ({
  open,
  onOpenChange,
  currentUser,
  isOrganizer,
  logout,
}: NavigationDrawerProps) => {
  const navigate = useNavigate();
  const { checkPermission } = usePermissions(currentUser);

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

  // Determine admin status from current user role
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  
  // Determine organizer status - either has ORGANIZER role or manages communities
  const hasOrganizerRole = currentUser?.role === UserRole.ORGANIZER || 
    (currentUser?.managedCommunities && currentUser.managedCommunities.length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <div className="flex-1 py-2 space-y-6">
          {currentUser && <UserHeader currentUser={currentUser} />}
          
          <div className="space-y-4">
            <MainNavigation 
              onNavigate={handleNavigate} 
              currentUser={!!currentUser} 
              isAdmin={isAdmin}
              isOrganizer={hasOrganizerRole}
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
