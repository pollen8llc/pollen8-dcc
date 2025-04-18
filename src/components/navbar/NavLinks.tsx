
import { Link } from "react-router-dom";
import { User, UserRole } from "@/models/types";

interface NavLinksProps {
  currentUser: User | null;
  isOrganizer: (communityId?: string) => boolean;
}

const NavLinks = ({ currentUser, isOrganizer }: NavLinksProps) => {
  const isAdmin = currentUser?.role === UserRole.ADMIN;
  
  // Log organizer status for debugging
  console.log("NavLinks - Navigation status:", { 
    isAdmin,
    isOrganizer: isOrganizer(),
    role: currentUser?.role,
    managedCommunities: currentUser?.managedCommunities
  });

  return (
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
          {isAdmin && (
            <Link
              to="/admin"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin Dashboard
            </Link>
          )}
          {/* Update the condition to check for both role and managed communities */}
          {!isAdmin && (currentUser.role === UserRole.ORGANIZER || (currentUser.managedCommunities && currentUser.managedCommunities.length > 0)) && (
            <Link
              to="/organizer"
              className="text-muted-foreground transition-colors hover:text-foreground font-medium text-blue-500 hover:text-blue-600"
            >
              Organizer Dashboard
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
  );
};

export default NavLinks;
