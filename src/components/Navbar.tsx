
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
  const { currentUser, logout, isLoading, recoverUserSession } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Add effect to handle authentication state tracking for UI
  useEffect(() => {
    // Once loading is complete, mark the auth check as done
    if (!isLoading) {
      setAuthCheckComplete(true);
      
      // Log the auth state for debugging
      console.log("Navbar auth state resolved:", {
        hasUser: !!currentUser,
        userRole: currentUser?.role || "none"
      });
    }
  }, [isLoading, currentUser]);

  // Add auto-recovery mechanism if we have unusual auth state
  useEffect(() => {
    if (authCheckComplete && !isLoading) {
      // Check if we might have a stale auth state in localStorage but no user
      const checkForStaleAuth = async () => {
        try {
          // Look for localStorage auth data
          const hasLocalAuth = 
            localStorage.getItem('sb-oltcuwvgdzszxshpfnre-auth') !== null;
            
          if (hasLocalAuth && !currentUser && !sessionStorage.getItem('navbar_recovery_attempted')) {
            console.log("Navbar detected potential auth mismatch - attempting recovery");
            sessionStorage.setItem('navbar_recovery_attempted', 'true');
            
            // Try to recover the session
            await recoverUserSession();
          }
        } catch (err) {
          console.error("Error in navbar auth check:", err);
        }
      };
      
      checkForStaleAuth();
    }
  }, [authCheckComplete, isLoading, currentUser, recoverUserSession]);

  return (
    <header className="border-b border-border/40 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">ECO8</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {authCheckComplete && !isLoading ? (
            currentUser ? (
              <UserActions 
                currentUser={currentUser} 
                logout={logout} 
              />
            ) : (
              <GuestActions />
            )
          ) : (
            // Show a placeholder during loading to prevent layout shift
            <div className="w-24 h-8 rounded-md bg-muted animate-pulse"></div>
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
        logout={logout}
      />
    </header>
  );
};

export default Navbar;
