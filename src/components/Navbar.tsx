
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@/contexts/UserContext";
import NavLinks from "./navbar/NavLinks";
import UserActions from "./navbar/UserActions";
import GuestActions from "./navbar/GuestActions";
import MobileMenu from "./navbar/MobileMenu";

const Navbar = () => {
  const { currentUser, isOrganizer, logout } = useUser();

  return (
    <header className="border-b border-border/40 sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">ECO8</span>
          </Link>
          <NavLinks currentUser={currentUser} isOrganizer={isOrganizer} />
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {currentUser ? (
            <UserActions 
              currentUser={currentUser} 
              isOrganizer={isOrganizer} 
              logout={logout} 
            />
          ) : (
            <GuestActions />
          )}
          
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
