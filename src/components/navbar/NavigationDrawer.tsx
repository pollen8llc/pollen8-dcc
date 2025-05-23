
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
  FileText,
  Shield,
  BookOpen,
  Book,
  FileTextIcon,
  Tag,
  ContactIcon,
  LayoutDashboard,
  Grid3x3,
  CalendarClock,
  Import,
  Bell,
  Folder,
  PlusCircle,
  UserSearch
} from "lucide-react";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  logout: () => Promise<void>;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
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

  // Check user roles safely
  const isAdmin = currentUser?.role === 'ADMIN';
  const isOrganizer = currentUser?.role === 'ORGANIZER' || isAdmin;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[350px] flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl">ECO8</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {/* Main Navigation */}
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>

            {currentUser && (
              <>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/welcome")}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>

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
                  onClick={() => handleNavigation("/profile/search")}
                >
                  <UserSearch className="mr-2 h-4 w-4" />
                  Find Profiles
                </Button>

                {/* Knowledge Section */}
                <Separator className="my-2" />
                <p className="px-4 py-2 text-sm font-medium opacity-70">
                  Knowledge
                </p>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/knowledge")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Knowledge Base
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/knowledge/resources")}
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  My Resources
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/knowledge/topics")}
                >
                  <Book className="mr-2 h-4 w-4" />
                  Browse Topics
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation("/knowledge/create")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Article
                </Button>

                {/* Organizer Section */}
                {isOrganizer && (
                  <>
                    <Separator className="my-2" />
                    <p className="px-4 py-2 text-sm font-medium opacity-70">
                      REL8
                    </p>

                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/rel8")}
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
                      onClick={() => handleNavigation("/rel8/categories")}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      Categories
                    </Button>

                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => handleNavigation("/rel8/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>

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

                {/* Admin Section */}
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
              </>
            )}

            <Separator className="my-2" />

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/docs")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Documentation
            </Button>
          </nav>
        </div>

        {/* Footer */}
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
