
import React from 'react';
import { useNavigate } from "react-router-dom";
import { User, UserRole } from "@/models/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import UserHeader from './drawer/UserHeader';
import MainNavigation from './drawer/MainNavigation';
import AdminNavigation from './drawer/AdminNavigation';
import OrganizerNavigation from './drawer/OrganizerNavigation';
import AuthActions from './drawer/AuthActions';

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
  logout 
}: NavigationDrawerProps) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  const handleNavigation = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onOpenChange(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[350px] px-0">
        <ScrollArea className="h-full px-4">
          {currentUser ? (
            <>
              <UserHeader currentUser={currentUser} />
              <Separator className="my-4" />
            </>
          ) : (
            <SheetHeader className="text-left mb-6">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
          )}

          <div className="grid gap-2 py-2">
            <MainNavigation 
              currentUser={!!currentUser} 
              onNavigate={handleNavigation} 
            />

            {/* Admin section */}
            {isAdmin && (
              <>
                <Separator className="my-4" />
                <AdminNavigation onNavigate={handleNavigation} />
              </>
            )}

            {/* Organizer section */}
            {!isAdmin && (isOrganizer() || currentUser?.managedCommunities?.length > 0) && (
              <>
                <Separator className="my-4" />
                <OrganizerNavigation onNavigate={handleNavigation} />
              </>
            )}

            {/* Auth actions */}
            <Separator className="my-4" />
            <AuthActions 
              currentUser={!!currentUser}
              onNavigate={handleNavigation}
              onLogout={handleLogout}
            />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
