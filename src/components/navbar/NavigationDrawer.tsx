
import { useNavigate } from "react-router-dom";
import { User, UserRole } from "@/models/types";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Library, 
  UserIcon, 
  FileText, 
  Users, 
  Settings,
  LogOut,
  Home,
  BookOpen
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const getUserInitials = () => {
    if (!currentUser) return "?";
    
    const nameParts = currentUser.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const getBadgeColor = () => {
    if (isAdmin) {
      return "bg-purple-500";
    }
    
    if (!currentUser) return "bg-gray-500";
    
    switch (currentUser?.role) {
      case UserRole.ORGANIZER:
        return "bg-blue-500";
      case UserRole.MEMBER:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBadgeText = () => {
    if (isAdmin) {
      return "Admin";
    }
    
    if (!currentUser) return "Guest";
    
    switch (currentUser.role) {
      case UserRole.ORGANIZER:
        return "Organizer";
      case UserRole.MEMBER:
        return "Member";
      default:
        return "Guest";
    }
  };

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
              <SheetHeader className="text-left mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-1 ring-primary/20">
                    <AvatarImage src={currentUser.imageUrl} alt={currentUser.name} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <SheetTitle className="text-lg">{currentUser.name}</SheetTitle>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    <Badge className={`${getBadgeColor()} text-white`}>
                      {getBadgeText()}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>
              <Separator className="my-4" />
            </>
          ) : (
            <SheetHeader className="text-left mb-6">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
          )}

          <div className="grid gap-2 py-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Main Navigation</h3>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/")}
            >
              <Home className="mr-2 h-4 w-4" />
              Communities
            </Button>

            {currentUser && (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation("/profile")}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation("/knowledge/7")}
                >
                  <Library className="mr-2 h-4 w-4" />
                  Knowledge Base
                </Button>
              </>
            )}

            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => handleNavigation("/documentation")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Documentation
            </Button>

            {/* Admin section */}
            {isAdmin && (
              <>
                <Separator className="my-4" />
                <h3 className="text-sm font-medium text-purple-500 mb-1">Admin</h3>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation("/admin")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation("/admin?tab=users")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation("/admin?tab=settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  System Settings
                </Button>
              </>
            )}

            {/* Organizer section */}
            {!isAdmin && (isOrganizer() || currentUser?.managedCommunities?.length > 0) && (
              <>
                <Separator className="my-4" />
                <h3 className="text-sm font-medium text-blue-500 mb-1">Management</h3>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => handleNavigation("/organizer")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Community Management
                </Button>
              </>
            )}

            {/* Auth actions */}
            <Separator className="my-4" />
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
                onClick={() => handleNavigation("/auth")}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Login / Sign up
              </Button>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
