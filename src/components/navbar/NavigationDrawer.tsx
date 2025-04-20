
import React, { useEffect, useState } from 'react';
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
import { supabase } from "@/integrations/supabase/client";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
}

// A utility type for managed community info
type DrawerCommunity = { id: string; name: string | null };

const NavigationDrawer = ({
  open,
  onOpenChange,
  currentUser,
  isOrganizer,
  logout,
}: NavigationDrawerProps) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === UserRole.ADMIN;

  // Show for ORGANIZERs or any user with managed communities (even by id only)
  const showOrganizerNav =
    !!currentUser &&
    (currentUser.role === UserRole.ORGANIZER ||
      (currentUser.managedCommunities && currentUser.managedCommunities.length > 0) ||
      isOrganizer());

  // For actual community info display in the drawer
  const [drawerCommunities, setDrawerCommunities] = useState<DrawerCommunity[]>([]);

  // Fetch names when drawer opens and user has managed communities (string[])
  useEffect(() => {
    const fetchCommunities = async () => {
      if (
        open &&
        currentUser &&
        currentUser.managedCommunities &&
        currentUser.managedCommunities.length > 0
      ) {
        // Remove dupes and nulls; support both string and object for future-compat
        const ids = currentUser.managedCommunities
          .map((c) => typeof c === "string" ? c : c.id)
          .filter(Boolean);

        // Fetch their details (names)
        const { data, error } = await supabase
          .from('communities')
          .select('id, name')
          .in('id', ids);

        if (!error && Array.isArray(data)) {
          setDrawerCommunities(
            ids.map((id) => {
              const match = data.find((c) => c.id === id);
              return { id, name: match?.name || null };
            })
          );
        } else {
          // fallback: list the IDs
          setDrawerCommunities(ids.map((id) => ({ id, name: null })));
        }
      } else {
        setDrawerCommunities([]);
      }
    };

    fetchCommunities();
    // Only when open, relevant user, or managedCommunities changes
  }, [open, currentUser]);

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
            {showOrganizerNav && drawerCommunities.length > 0 && (
              <>
                <Separator className="my-4" />
                <div className="px-2 mb-2 text-sm font-semibold text-muted-foreground">
                  Manage Communities
                </div>
                <div className="flex flex-col gap-1 pb-2">
                  {drawerCommunities.map((community) => (
                    <Button
                      key={community.id}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation(`/organizer/community/${community.id}`)}
                    >
                      <span>{community.name || `Community ${community.id}`}</span>
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
