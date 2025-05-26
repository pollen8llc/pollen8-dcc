
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';
import { 
  Bell,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  User
} from 'lucide-react';

interface NavigationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: any;
  logout: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onOpenChange,
  currentUser,
  logout
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 py-4">
          {/* Notifications */}
          <SheetClose asChild>
            <Link 
              to="/notifications" 
              className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Link>
          </SheetClose>

          {currentUser && (
            <>
              {/* Profile */}
              <SheetClose asChild>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </SheetClose>

              {/* REL8 Dashboard */}
              <SheetClose asChild>
                <Link 
                  to="/rel8" 
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  REL8 Dashboard
                </Link>
              </SheetClose>

              {/* Connections */}
              <SheetClose asChild>
                <Link 
                  to="/connections" 
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  <Users className="h-4 w-4" />
                  My Connections
                </Link>
              </SheetClose>

              {/* Settings */}
              <SheetClose asChild>
                <Link 
                  to="/settings" 
                  className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent rounded-md"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </SheetClose>

              {/* Logout */}
              <Button 
                variant="ghost" 
                className="justify-start gap-3 px-3 py-2 text-sm"
                onClick={() => {
                  logout();
                  onOpenChange(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
