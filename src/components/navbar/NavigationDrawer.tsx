
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
import { Folder } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
}

// Type for items in managedCommunities (string IDs or objects)
type ManagedCommunityItem = string | { id: string; [key: string]: any };

// Community info for display
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

  // Organizers/owners only
  const showOrganizerNav =
    !!currentUser &&
    (currentUser.role === UserRole.ORGANIZER ||
      (currentUser.managedCommunities && currentUser.managedCommunities.length > 0) ||
      isOrganizer());

  const [drawerCommunities, setDrawerCommunities] = useState<DrawerCommunity[]>([]);

  // Load communities if drawer open & user manages them
  useEffect(() => {
    const fetchCommunities = async () => {
      if (
        open &&
        currentUser?.managedCommunities &&
        currentUser.managedCommunities.length > 0
      ) {
        // Normalize IDs from managedCommunities
        const ids: string[] = currentUser.managedCommunities.map((community: ManagedCommunityItem) => {
          if (typeof community === "string") return community;
          if (community && typeof community === "object" && "id" in community) return community.id;
          return "";
        }).filter(Boolean);

        if (ids.length === 0) {
          setDrawerCommunities([]);
          return;
        }

        // Fetch community names via IDs
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
          setDrawerCommunities(ids.map((id) => ({ id, name: null })));
        }
      } else {
        setDrawerCommunities([]);
      }
    };

    fetchCommunities();
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
            {/* Main site navigation */}
            <MainNavigation
              onNavigate={handleNavigation}
              currentUser={!!currentUser}
              isAdmin={isAdmin}
            />

            {/* ADMIN section */}
            {isAdmin && (
              <>
                <Separator className="my-4" />
                <AdminNavigation onNavigate={handleNavigation} />
              </>
            )}

            {/* ORGANIZER menu, if any managed communities */}
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
                      className="justify-start flex gap-2 items-center"
                      onClick={() => handleNavigation(`/organizer/community/${community.id}`)}
                    >
                      <Folder className="w-4 h-4 mr-1" />
                      <span>
                        {community.name ? community.name : `Community ${community.id}`}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">Manage</span>
                    </Button>
                  ))}
                </div>
              </>
            )}

            {/* Auth (login/logout) actions */}
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
