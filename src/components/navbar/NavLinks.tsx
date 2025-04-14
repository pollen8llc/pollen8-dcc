
import { Link } from "react-router-dom";
import { User, UserRole } from "@/models/types";

interface NavLinksProps {
  currentUser: User | null;
  isOrganizer: (communityId?: string) => boolean;
}

const NavLinks = ({ currentUser, isOrganizer }: NavLinksProps) => {
  const isAdmin = currentUser?.role === UserRole.ADMIN;

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
          {(isOrganizer() || isAdmin) && (
            <Link
              to="/admin"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {isAdmin ? "Admin Dashboard" : "Management"}
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
