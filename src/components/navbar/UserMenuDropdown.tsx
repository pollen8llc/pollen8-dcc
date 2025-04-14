
import { Link } from "react-router-dom";
import { User } from "@/models/types";
import { UserRole } from "@/models/types";
import { 
  Shield, 
  Library, 
  UserIcon, 
  FileText, 
  Users, 
  Settings 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserMenuDropdownProps {
  currentUser: User;
  isAdmin: boolean;
  isOrganizer: (communityId?: string) => boolean;
  logout: () => Promise<void>;
}

const UserMenuDropdown = ({ currentUser, isAdmin, isOrganizer, logout }: UserMenuDropdownProps) => {
  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser) return "?";
    
    const nameParts = currentUser.name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8 ring-1 ring-primary/20">
            <AvatarImage src={currentUser.imageUrl} alt={currentUser.name} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
            {isAdmin && (
              <Badge className="mt-1 bg-blue-500 text-white w-fit">Admin</Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer flex w-full items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/" className="cursor-pointer flex w-full items-center">
            Communities
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/knowledge/7" className="cursor-pointer flex w-full items-center">
            <Library className="mr-2 h-4 w-4" />
            <span>Knowledge Base</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/documentation" className="cursor-pointer flex w-full items-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </Link>
        </DropdownMenuItem>
        
        {/* Admin Menu */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
              Admin
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to="/admin" className="cursor-pointer flex w-full items-center">
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin?tab=users" className="cursor-pointer flex w-full items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>User Management</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin?tab=settings" className="cursor-pointer flex w-full items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>System Settings</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        {isOrganizer() && !isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer flex w-full items-center">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuDropdown;
