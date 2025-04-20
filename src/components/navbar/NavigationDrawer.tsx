
import React from 'react';
import { useNavigate } from "react-router-dom";
import { User, UserRole } from "@/models/types";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import UserHeader from './drawer/UserHeader';
import MainNavigation from './drawer/MainNavigation';
import AdminNavigation from './drawer/AdminNavigation';
import AuthActions from './drawer/AuthActions';

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
}

// Define a type for the community structure that could be in managedCommunities
type CommunityReference = string | { id: string; name: string };

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
            {showOrganizerNav && currentUser && currentUser.managedCommunities && currentUser.managedCommunities.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="px-2 mb-2 text-sm font-semibold text-muted-foreground">
                  Manage Communities
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  {currentUser.managedCommunities.map((community: CommunityReference) => {
                    // Check if it's a string or an object with id and name properties
                    const communityId = typeof community === 'string' ? community : community.id;
                    const communityName = typeof community === 'string' ? community : community.name;
                    
                    return (
                      <Button 
                        key={communityId}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => handleNavigation(`/organizer/community/${communityId}`)}
                      >
                        <span>{communityName}</span>
                      </Button>
                    );
                  })}
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
