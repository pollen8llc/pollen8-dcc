
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
  Home,
  LogOut,
  User as UserIcon,
  Settings,
  FileText,
  Building2,
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  MessageSquare,
  Trophy,
  LogIn
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

  const handleLogin = () => {
    navigate("/labr8/auth");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[300px] sm:w-[350px] flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-[#00eada]/20">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl text-[#00eada]">LAB-R8</SheetTitle>
          <p className="text-sm text-gray-300">Service Provider Portal</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {/* Main Navigation */}
            <Button
              variant="ghost"
              className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
              onClick={() => handleNavigation("/labr8")}
            >
              <Home className="mr-2 h-4 w-4" />
              LAB-R8 Home
            </Button>

            <Button
              variant="ghost"
              className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
              onClick={() => handleNavigation("/")}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Main Platform
            </Button>

            {currentUser && currentUser.role === 'SERVICE_PROVIDER' && (
              <>
                <Separator className="my-2 bg-white/20" />
                <p className="px-4 py-2 text-sm font-medium text-gray-400">
                  Service Provider
                </p>

                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
                  onClick={() => handleNavigation("/labr8/dashboard")}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
                  onClick={() => handleNavigation("/labr8/projects")}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  My Projects
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
                  onClick={() => handleNavigation("/labr8/proposals")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Proposals
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
                  onClick={() => handleNavigation("/labr8/messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Messages
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
                  onClick={() => handleNavigation("/labr8/profile")}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  My Profile
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
                  onClick={() => handleNavigation("/labr8/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </>
            )}

            <Separator className="my-2 bg-white/20" />

            <Button
              variant="ghost"
              className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
              onClick={() => handleNavigation("/docs")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Documentation
            </Button>

            <Button
              variant="ghost"
              className="justify-start text-white hover:bg-[#00eada]/20 hover:text-[#00eada]"
              onClick={() => handleNavigation("/labr8/help")}
            >
              <Trophy className="mr-2 h-4 w-4" />
              Help & Support
            </Button>
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-white/20 pt-4 flex flex-col gap-2">
          {currentUser && currentUser.role === 'SERVICE_PROVIDER' ? (
            <>
              <div className="px-2 py-2 text-xs text-gray-400">
                Signed in as {currentUser.first_name} {currentUser.last_name}
              </div>
              <Button
                variant="outline"
                className="justify-start border-[#00eada] text-[#00eada] hover:bg-[#00eada]/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              onClick={handleLogin}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to LAB-R8
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
