
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { User } from "@/models/types";
import { UserRole } from "@/models/types";
import {
  Home,
  LogOut,
  User as UserIcon,
  Settings,
  Users,
  PlusCircle,
  FileText,
  UserSearch,
  Shield,
  Network,
  ContactIcon,
  Bell,
  Import,
  Grid3x3,
  LayoutDashboard,
  CalendarClock,
  Folder,
  BookOpen,
  Book,
  FileTextIcon
} from "lucide-react";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  logout: () => Promise<void>;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onOpenChange,
  currentUser,
  logout,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    navigate(route);
    onOpenChange(false);
  };

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
    navigate("/");
  };

  const isAdmin = currentUser?.role === UserRole.ADMIN;
  const isOrganizer = currentUser?.role === UserRole.ORGANIZER || 
                      (currentUser?.managedCommunities && currentUser.managedCommunities.length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[350px] flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl">ECO8</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>

            {/* Authenticated user menu items */}
            {currentUser && (
              <>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation(`/profile/${currentUser.id}`)}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  My Profile
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/profiles/search")}
                >
                  <UserSearch className="mr-2 h-4 w-4" />
                  Find People
                </Button>
                
                {isOrganizer && (
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => handleNavigation("/community/create")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Community
                  </Button>
                )}

                {/* CORE section */}
                <Separator className="my-2" />
                <p className="px-4 py-2 text-sm font-medium opacity-70">
                  CORE
                </p>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/core")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Knowledge Base
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/core/articles")}
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Browse Articles
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/core/latest")}
                >
                  <Book className="mr-2 h-4 w-4" />
                  Latest Articles
                </Button>
              </>
            )}

            {/* REL8 menu items (for organizers) */}
            {isOrganizer && (
              <>
                <Separator className="my-2" />
                <p className="px-4 py-2 text-sm font-medium opacity-70">
                  REL8T
                </p>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8/dashboard")}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8/contacts")}
                >
                  <ContactIcon className="mr-2 h-4 w-4" />
                  Contacts
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8/relationships")}
                >
                  <CalendarClock className="mr-2 h-4 w-4" />
                  Relationships
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8/groups")}
                >
                  <Grid3x3 className="mr-2 h-4 w-4" />
                  Groups
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8/contacts/import")}
                >
                  <Import className="mr-2 h-4 w-4" />
                  Import
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </>
            )}

            {/* Organizer-specific menu items */}
            {isOrganizer && (
              <>
                <Separator className="my-2" />
                <p className="px-4 py-2 text-sm font-medium opacity-70">
                  Organizer
                </p>      
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/organizer")}
                >
                  <Folder className="mr-2 h-4 w-4" />
                  Organizer Dashboard 
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/invites")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Invites
                </Button>
              </>
            )}

            {/* Admin-specific menu items */}
            {isAdmin && (
              <>
                <Separator className="my-2" />
                <p className="px-4 py-2 text-sm font-medium opacity-70">
                  Admin
                </p>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/admin")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/admin/debugger")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Debug Tools
                </Button>
              </>
            )}

            <Separator className="my-2" />

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/documentation")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Documentation
            </Button>
          </nav>
        </div>

        <div className="border-t pt-4 flex flex-col gap-2">
          {currentUser ? (
            <Button
              variant="outline"
              className="justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          ) : (
            <Button 
              className="w-full"
              onClick={() => handleNavigation("/auth")}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
