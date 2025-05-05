
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, UserRole } from "@/models/types";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Users, 
  Shield, 
  LogOut, 
  Settings, 
  User as UserIcon,
  FolderKanban,
  Mail,
  Bug
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  logout: () => Promise<void>;
}

const NavigationDrawer = ({
  open,
  onOpenChange,
  currentUser,
  logout,
}: NavigationDrawerProps) => {
  const navigate = useNavigate();
  const { isAdmin, isOrganizer } = usePermissions(currentUser);

  // Add debug logging for drawer authentication state
  console.log("NavigationDrawer rendering with user:", currentUser?.id || "No user", {
    role: currentUser?.role,
    isAdmin: isAdmin(),
    isOrganizer: isOrganizer(),
    managedCommunities: currentUser?.managedCommunities || []
  });

  const handleNavigate = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  const handleLogout = async () => {
    await logout();
    handleNavigate("/auth");
  };

  const getInitials = (user: User) => {
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        {currentUser ? (
          <SheetHeader className="pb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.imageUrl} alt={currentUser.name} />
                <AvatarFallback>{getInitials(currentUser)}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-sm font-medium">{currentUser.name}</SheetTitle>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>
          </SheetHeader>
        ) : (
          <SheetHeader className="pb-4">
            <SheetTitle>Welcome</SheetTitle>
          </SheetHeader>
        )}

        <div className="flex-1 py-2 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Navigation</h3>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigate("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            
            {currentUser && (
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => handleNavigate("/profile")}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                My Profile
              </Button>
            )}

            {currentUser && (
              <Button 
                variant="ghost" 
                className="w-full justify-start" 
                onClick={() => handleNavigate("/communities/join")}
              >
                <Users className="mr-2 h-4 w-4" />
                Join Communities
              </Button>
            )}
          </div>

          {isOrganizer() && (
            <>
              <Separator />
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-blue-500">Organizer</h3>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigate("/organizer/dot-connector")}
                >
                  <FolderKanban className="mr-2 h-4 w-4" />
                  Manage Communities
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigate("/organizer/invites")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Manage Invites
                </Button>
              </div>
            </>
          )}

          {isAdmin() && (
            <>
              <Separator />
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-purple-500">Admin</h3>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigate("/admin")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigate("/admin?tab=users")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigate("/admin?tab=settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigate("/admin/debug")}
                >
                  <Bug className="mr-2 h-4 w-4" />
                  Debug Console
                </Button>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="mt-auto">
          {currentUser ? (
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigate("/auth")}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Login / Sign up
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
