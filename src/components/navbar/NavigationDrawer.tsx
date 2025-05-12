
import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  User,
  LogOut,
  Settings,
  Home,
  BarChart3,
  Bell
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: any;
  logout: () => void;
}

const NavigationDrawer = ({
  open,
  onOpenChange,
  currentUser,
  logout,
}: NavigationDrawerProps) => {
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("/");

  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/rel8t/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/rel8t/notifications", label: "Notifications", icon: Bell },
    { path: "/rel8t/settings", label: "Settings", icon: Settings },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="border-r border-border/40 p-0">
        <div className="flex flex-col h-full">
          {/* User section at the top */}
          <div className="p-4 border-b border-border/40">
            {currentUser ? (
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage src={currentUser.imageUrl} />
                  <AvatarFallback>
                    {currentUser.name
                      ? currentUser.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                      : "??"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{currentUser.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Navigation menu */}
          <div className="p-2 flex-1 overflow-auto">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link to={item.path} key={item.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      activeRoute === item.path
                        ? "bg-secondary text-secondary-foreground"
                        : ""
                    }`}
                    onClick={() => onOpenChange(false)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          {/* Account section at bottom */}
          {currentUser && (
            <div className="p-4 border-t border-border/40 mt-auto">
              <div className="space-y-1">
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => onOpenChange(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => {
                    logout();
                    onOpenChange(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationDrawer;
