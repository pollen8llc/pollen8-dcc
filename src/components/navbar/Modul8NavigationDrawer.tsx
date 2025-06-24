
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { User } from "@/models/types";
import {
  LogOut,
  User as UserIcon,
  Settings,
  LayoutDashboard,
  Building2,
  Network,
  Users,
  MessageSquare,
  Search,
  Plus,
  FileText,
  TrendingUp,
  Bell,
  Handshake,
  Target,
  Globe
} from "lucide-react";

interface Modul8NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  logout: () => Promise<void>;
}

export const Modul8NavigationDrawer: React.FC<Modul8NavigationDrawerProps> = ({
  open,
  onOpenChange,
  currentUser,
  logout,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    navigate(route);
    onOpenChange(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onOpenChange(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[350px] flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl text-[#00eada]">Modul8</SheetTitle>
          <p className="text-sm text-muted-foreground">Ecosystem Hub</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {/* Main Dashboard */}
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            <Separator className="my-2" />
            
            {/* Service Requests */}
            <p className="px-4 py-2 text-sm font-medium opacity-70">
              Service Requests
            </p>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/request/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Request
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/requests")}
            >
              <FileText className="mr-2 h-4 w-4" />
              My Requests
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/negotiations")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Active Negotiations
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/partnerships")}
            >
              <Handshake className="mr-2 h-4 w-4" />
              Active Partnerships
            </Button>

            <Separator className="my-2" />
            
            {/* Ecosystem Discovery */}
            <p className="px-4 py-2 text-sm font-medium opacity-70">
              Discovery
            </p>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/providers")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Browse Providers
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/domains")}
            >
              <Globe className="mr-2 h-4 w-4" />
              Service Domains
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/search")}
            >
              <Search className="mr-2 h-4 w-4" />
              Advanced Search
            </Button>

            <Separator className="my-2" />
            
            {/* Network Management */}
            <p className="px-4 py-2 text-sm font-medium opacity-70">
              Network
            </p>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/network")}
            >
              <Network className="mr-2 h-4 w-4" />
              My Network
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/collaborators")}
            >
              <Users className="mr-2 h-4 w-4" />
              Collaborators
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/opportunities")}
            >
              <Target className="mr-2 h-4 w-4" />
              Opportunities
            </Button>

            <Separator className="my-2" />
            
            {/* Analytics */}
            <p className="px-4 py-2 text-sm font-medium opacity-70">
              Insights
            </p>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/analytics")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Ecosystem Analytics
            </Button>

            <Separator className="my-2" />
            
            {/* Account Management */}
            <p className="px-4 py-2 text-sm font-medium opacity-70">
              Account
            </p>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/setup/organizer")}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Organization Profile
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/setup/provider")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Become a Provider
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/notifications")}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>

            <Separator className="my-2" />

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/modul8/help")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Help & Guides
            </Button>
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 flex flex-col gap-2">
          {currentUser && (
            <div className="px-4 py-2 text-sm">
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">Ecosystem Organizer</p>
            </div>
          )}
          
          <Button
            variant="outline"
            className="justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
