
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
  ListTodo,
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
                  onClick={() => handleNavigation("/profile")}
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
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/connections")}
                >
                  <Network className="mr-2 h-4 w-4" />
                  My Connections
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
                  onClick={() => handleNavigation("/rel8t")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Rel8t Dashboard
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8t/relationships")}
                >
                  <ListTodo className="mr-2 h-4 w-4" />
                  Relationship builder
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
                  onClick={() => handleNavigation("/organizer/dot-connector")}
                >
                  <Network className="mr-2 h-4 w-4" />
                  Organizer Dashboard 
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
                  onClick={() => handleNavigation("/admin/debug")}
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
