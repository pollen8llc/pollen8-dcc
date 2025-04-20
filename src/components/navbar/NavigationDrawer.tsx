
import React from 'react';
import { useNavigate } from "react-router-dom";
import { User, UserRole } from "@/models/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import UserHeader from './drawer/UserHeader';
import MainNavigation from './drawer/MainNavigation';
import AdminNavigation from './drawer/AdminNavigation';
// Removed OrganizerNavigation import because the module is missing and this feature is removed
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
  
  const showOrganizerNav = currentUser && (
    currentUser.role === UserRole.ORGANIZER || 
    (currentUser.managedCommunities && currentUser.managedCommunities.length > 0) ||
    isOrganizer()
  );

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
              onNavigate={handleNavigation}
              currentUser={!!currentUser}
              isAdmin={isAdmin} 
            />

            {/* Admin section */}
            {isAdmin && (
              <>
                <Separator className="my-4" />
                <AdminNavigation onNavigate={handleNavigation} />
              </>
            )}

            {/* Organizer section */}
            {showOrganizerNav && currentUser.managedCommunities && currentUser.managedCommunities.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="px-2 mb-2 text-sm font-semibold text-muted-foreground">
                  Manage Communities
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  {currentUser.managedCommunities.map((community) => (
                    <Button 
                      key={community.id}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation(`/organizer/community/${community.id}`)}
                    >
                      {/* Optionally add an icon here if you like */}
                      <span>{community.name}</span>
                    </Button>
                  ))}
                </div>
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

