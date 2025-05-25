import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import UserMenuDropdown from '@/components/navbar/UserMenuDropdown';
import { NavigationDrawer } from '@/components/navbar/NavigationDrawer';
import { Menu, Bell } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center px-4">
        {/* Logo */}
        <Link to="/welcome" className="mr-auto flex items-center space-x-2">
          <img 
            src="https://www.pollen8.app/wp-content/uploads/2024/03/POLLEN8-1trans.png" 
            alt="Pollen8" 
            className="max-w-full w-[100px]" 
          />
        </Link>
        
        <NavigationDrawer 
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          currentUser={currentUser}
          logout={logout}
        />
        
        <div className="flex items-center space-x-2">
          {/* Remove ThemeToggle */}
          {/* <ThemeToggle /> */}

          {/* Add Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/rel8/notifications')}
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          {currentUser ? (
            <UserMenuDropdown currentUser={currentUser} isAdmin={currentUser.role === 'ADMIN'} />
          ) : (
            <Button onClick={() => navigate('/auth')} variant="ghost" size="sm">
              Sign In
            </Button>
          )}
          
          {/* Menu button for drawer */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
