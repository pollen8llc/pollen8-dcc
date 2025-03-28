
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@/contexts/UserContext";
import { Shield, Library, UserCircle, Menu, User as UserIcon, FileText } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { currentUser, isOrganizer, logout } = useUser();

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
    <header className="border-b border-border/40 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">ECO8</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              to="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Communities
            </Link>
            {currentUser && (
              <>
                <Link
                  to="/profile"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Profile
                </Link>
                <Link
                  to="/knowledge/7"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Knowledge Base
                </Link>
                {isOrganizer() && (
                  <Link
                    to="/admin"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
            <Link
              to="/documentation"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Documentation
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* User badge for desktop */}
              <Badge variant="outline" className="hidden md:flex items-center gap-1 py-1 px-2 border-primary/30">
                <UserCircle className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs">{currentUser.name}</span>
              </Badge>
              
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
                  {isOrganizer() && (
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
            </div>
          ) : (
            <Button variant="default" className="flex items-center gap-2" asChild>
              <Link to="/auth">
                <UserCircle className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </Button>
          )}
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
