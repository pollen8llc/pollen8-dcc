
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import UserMenuDropdown from '@/components/navbar/UserMenuDropdown';
import { NavigationDrawer } from '@/components/navbar/NavigationDrawer';
import { Menu } from 'lucide-react';

const navigationItems = [
  { name: 'Home', href: '/' },
  { name: 'REL8T', href: '/rel8' },
  { name: 'Knowledge', href: '/knowledge' },
  { name: 'Modul8', href: '/modul8' },
  { name: 'LAB-R8', href: '/labr8' },
];

const Navbar = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Check if user is a service provider
  const isServiceProvider = currentUser?.role === 'SERVICE_PROVIDER';

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center px-4">
        {/* Logo */}
        <Link 
          to={isServiceProvider ? "/labr8/dashboard" : "/welcome"} 
          className="mr-auto flex items-center space-x-2"
        >
          {isServiceProvider ? (
            <div className="text-2xl font-bold text-[#00eada]">LAB-R8</div>
          ) : (
            <img 
              src="https://www.pollen8.app/wp-content/uploads/2024/03/POLLEN8-1trans.png" 
              alt="Pollen8" 
              className="max-w-full w-[100px]" 
            />
          )}
        </Link>
        
        {!isServiceProvider && (
          <NavigationDrawer 
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            currentUser={currentUser}
            logout={logout}
          />
        )}
        
        <div className="flex items-center space-x-2">
          {currentUser ? (
            <UserMenuDropdown currentUser={currentUser} isAdmin={currentUser.role === 'ADMIN'} />
          ) : (
            <Button 
              onClick={() => navigate(isServiceProvider ? '/labr8/auth' : '/auth')} 
              variant="ghost" 
              size="sm"
            >
              Sign In
            </Button>
          )}
          
          {/* Menu button for drawer - only show for non-service providers */}
          {!isServiceProvider && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
