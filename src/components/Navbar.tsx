
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@/contexts/UserContext";
import { Shield, Library, UserCircle } from "lucide-react";

const Navbar = () => {
  const { currentUser, isOrganizer, logout } = useUser();

  return (
    <header className="border-b border-border/40 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">DCC</span>
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
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {currentUser ? (
            <div className="flex items-center gap-2">
              {isOrganizer() && (
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" asChild>
                <Link to="/knowledge/7">
                  <Library className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" onClick={() => logout()}>
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="default" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
