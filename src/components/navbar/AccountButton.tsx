
import { Link } from "react-router-dom";
import { User, UserRole } from "@/models/types";
import { 
  UserCircle, 
  LogIn, 
  LogOut, 
  User as UserIcon, 
  Library,
  Settings,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AccountButtonProps {
  currentUser: User | null;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AccountButton = ({ currentUser, isAdmin, logout }: AccountButtonProps) => {
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser) return "?";
    
    const nameParts = currentUser.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3">
          {currentUser ? (
            <>
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentUser.imageUrl} alt={currentUser.name} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm font-medium">
                {currentUser.name} 
                {isAdmin && <span className="ml-1 text-blue-500">(Admin)</span>}
                {currentUser.role === UserRole.ORGANIZER && !isAdmin && <span className="ml-1 text-green-500">(Organizer)</span>}
                {currentUser.role === UserRole.MEMBER && !isAdmin && !currentUser.managedCommunities?.length && <span className="ml-1">(Member)</span>}
              </span>
            </>
          ) : (
            <>
              <UserCircle className="h-4 w-4" />
              <span className="text-sm">Account</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {currentUser ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {currentUser.email}
                </p>
                {isAdmin && (
                  <Badge className="mt-1 bg-blue-500 text-white w-fit">Admin</Badge>
                )}
                {currentUser.role === UserRole.ORGANIZER && !isAdmin && (
                  <Badge className="mt-1 bg-green-500 text-white w-fit">Organizer</Badge>
                )}
                {currentUser.role === UserRole.MEMBER && !isAdmin && !currentUser.managedCommunities?.length && (
                  <Badge className="mt-1 bg-gray-500 text-white w-fit">Member</Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer flex w-full items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/knowledge/7" className="cursor-pointer flex w-full items-center">
                <Library className="mr-2 h-4 w-4" />
                <span>Knowledge Base</span>
              </Link>
            </DropdownMenuItem>
            
            {/* Admin and Organizer Menu */}
            {(isAdmin || currentUser.role === UserRole.ORGANIZER) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  Management
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer flex w-full items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>{isAdmin ? "Admin Dashboard" : "Community Management"}</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin?tab=settings" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>System Settings</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer text-red-500 hover:text-red-600 font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/auth" className="cursor-pointer flex w-full items-center">
                <LogIn className="mr-2 h-4 w-4" />
                <span>Login / Sign up</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/documentation" className="cursor-pointer flex w-full items-center">
                <Library className="mr-2 h-4 w-4" />
                <span>Documentation</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountButton;
