
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
  Briefcase,
  MessageSquare,
  DollarSign,
  TrendingUp,
  FileText,
  Bell,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

interface Labr8NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User | null;
  logout: () => Promise<void>;
}

export const Labr8NavigationDrawer: React.FC<Labr8NavigationDrawerProps> = ({
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
      navigate("/labr8");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[350px] flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl text-[#00eada]">LAB-R8</SheetTitle>
          <p className="text-sm text-muted-foreground">Service Provider Portal</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {/* Main Dashboard */}
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>

            <Separator className="my-2" />
            
            {/* Business Management */}
            <p className="px-4 py-2 text-sm font-medium opacity-70">
              Business Management
            </p>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/requests")}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Available Requests
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/negotiations")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Active Negotiations
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/projects")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Active Projects
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/earnings")}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Earnings & Payments
            </Button>

            <Separator className="my-2" />
            
            {/* Analytics & Performance */}
            <p className="px-4 py-2 text-sm font-medium opacity-70">
              Performance
            </p>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/analytics")}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/reviews")}
            >
              <Users className="mr-2 h-4 w-4" />
              Reviews & Ratings
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/schedule")}
            >
              <Clock className="mr-2 h-4 w-4" />
              Schedule & Availability
            </Button>

            <Separator className="my-2" />
            
            {/* Account Management */}
            <p className="px-4 py-2 text-sm font-medium opacity-70">
              Account
            </p>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/profile")}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Business Profile
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/notifications")}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>

            <Separator className="my-2" />

            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleNavigation("/labr8/help")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Help & Support
            </Button>
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t pt-4 flex flex-col gap-2">
          {currentUser && (
            <div className="px-4 py-2 text-sm">
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">Service Provider</p>
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
