
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import UserMenuDropdown from '@/components/navbar/UserMenuDropdown';
import { NavigationDrawer } from '@/components/navbar/NavigationDrawer';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center px-4">
        {/* Menu button for drawer */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDrawerOpen(true)}
          className="mr-3"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo */}
        <Link to="/welcome" className="mr-auto flex items-center space-x-2">
          <span className="font-bold text-xl">Lovable</span>
        </Link>
        
        <NavigationDrawer 
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          currentUser={currentUser}
          logout={logout}
        />
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {currentUser ? (
            <UserMenuDropdown currentUser={currentUser} isAdmin={currentUser.role === 'ADMIN'} />
          ) : (
            <Button onClick={() => navigate('/auth')} variant="ghost" size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
