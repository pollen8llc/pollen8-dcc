
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
import {
  Home,
  LogOut,
  User as UserIcon,
  Settings,
  Users,
  ContactIcon,
  LayoutDashboard,
  Tag,
  Zap,
  UserSearch
} from "lucide-react";

interface Rel8NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  logout: () => Promise<void>;
}

export const Rel8NavigationDrawer: React.FC<Rel8NavigationDrawerProps> = ({
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
    try {
      await logout();
      onOpenChange(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[350px] flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl text-[#00eada]">REL8-T</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Main Platform
            </Button>

            {currentUser && (
              <>
                <Separator className="my-2" />
                <p className="px-4 py-2 text-sm font-medium opacity-70">
                  REL8-T - Relationship Management
                </p>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8t")}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8t/contacts")}
                >
                  <ContactIcon className="mr-2 h-4 w-4" />
                  Contacts
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8t/categories")}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Categories
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/rel8t/triggers")}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Triggers
                </Button>

                <Separator className="my-2" />
                <p className="px-4 py-2 text-sm font-medium opacity-70">
                  Account
                </p>

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
                  Find Profiles
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </>
            )}
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
