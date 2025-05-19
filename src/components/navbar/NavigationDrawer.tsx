import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { usePermissions } from "@/hooks/usePermissions";
import { 
  Layers, 
  Users, 
  Settings, 
  LogOut, 
  UserCircle, 
  GanttChart, 
  // Add new icons for CORE
  Bookmark,
  PlusCircle
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { User } from "@/models/types";
import { Separator } from "@/components/ui/separator";
import UserBadge from "./UserBadge";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  logout: () => Promise<void>;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ 
  open, 
  onOpenChange, 
  currentUser, 
  logout 
}) => {
  const navigate = useNavigate();
  const { isAdmin, isOrganizer } = usePermissions(currentUser);

  const renderAuthSection = () => {
    return (
      <div className="flex flex-col space-y-1.5 p-4">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center">
              <UserCircle className="mr-2 h-5 w-5" />
              {currentUser ? "User Profile" : "Authentication"}
            </div>
          </SheetTitle>
        </SheetHeader>
        
        {currentUser ? (
          <>
            <UserBadge currentUser={currentUser} />
            
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={async () => {
                await logout();
                navigate("/");
                onOpenChange(false);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            asChild
          >
            <Link to="/auth">
              Sign In / Sign Up
            </Link>
          </Button>
        )}
      </div>
    );
  };

  const renderRel8Navigation = () => {
    return (
      <div className="space-y-1 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          REL8
        </h2>
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          asChild
        >
          <Link to="/rel8/dashboard">
            <Layers className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          asChild
        >
          <Link to="/rel8/contacts">
            <Users className="mr-2 h-4 w-4" />
            Contacts
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          asChild
        >
          <Link to="/rel8/groups">
            <GanttChart className="mr-2 h-4 w-4" />
            Groups
          </Link>
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          asChild
        >
          <Link to="/rel8/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>
    );
  };

  // Add this function inside the NavigationDrawer component
  const renderCoreNavigation = () => {
    return (
      <div className="space-y-1 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-royal-blue-600 dark:text-royal-blue-400">
          CORE
        </h2>
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          asChild
        >
          <Link to="/core">
            <Bookmark className="mr-2 h-4 w-4" />
            Knowledge Base
          </Link>
        </Button>
        {(isOrganizer || isAdmin) && (
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            asChild
          >
            <Link to="/core/articles/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Article
            </Link>
          </Button>
        )}
      </div>
    );
  };

  const renderAdminNavigation = () => {
    if (!isAdmin && !isOrganizer) return null;

    return (
      <div className="space-y-1 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Admin
        </h2>
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          asChild
        >
          <Link to="/admin">
            <Layers className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[24rem] border-r pr-0">
        {renderAuthSection()}

        <Separator className="my-2" />

        {/* REL8 Module */}
        {renderRel8Navigation()}

		    {/* CORE Module */}
		    <Separator className="my-2" />
		    {renderCoreNavigation()}

        {/* Admin Module (visible to admins and organizers) */}
        {renderAdminNavigation()}

        <Separator className="my-2" />

        <div className="p-4">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
