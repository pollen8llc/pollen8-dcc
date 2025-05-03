
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@/contexts/UserContext";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavigationDrawer from "./navbar/NavigationDrawer";
import UserActions from "./navbar/UserActions";
import GuestActions from "./navbar/GuestActions";

const Navbar = () => {
  const { currentUser, isOrganizer, logout, isLoading } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="border-b border-border/40 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">ECO8</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {!isLoading && (
            currentUser ? (
              <UserActions 
                currentUser={currentUser} 
                isOrganizer={isOrganizer} 
                logout={logout} 
              />
            ) : (
              <GuestActions />
            )
          )}
          
          <ThemeToggle />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <NavigationDrawer 
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        currentUser={currentUser} 
        isOrganizer={isOrganizer} 
        logout={logout}
      />
    </header>
  );
};

export default Navbar;
