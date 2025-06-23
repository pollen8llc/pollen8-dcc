
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import UserMenuDropdown from '@/components/navbar/UserMenuDropdown';
import { NavigationDrawer } from '@/components/navbar/NavigationDrawer';
import { Labr8NavigationDrawer } from '@/components/navbar/Labr8NavigationDrawer';
import { Modul8NavigationDrawer } from '@/components/navbar/Modul8NavigationDrawer';
import { Rel8NavigationDrawer } from '@/components/navbar/Rel8NavigationDrawer';
import { Menu } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Check if user is a service provider
  const isServiceProvider = currentUser?.role === 'SERVICE_PROVIDER';
  
  // Determine which navigation drawer to show based on current route
  const isModul8Route = location.pathname.startsWith('/modul8');
  const isLabr8Route = location.pathname.startsWith('/labr8');
  const isRel8Route = location.pathname.startsWith('/rel8t');

  // Determine logo and home route based on current context
  const getLogoAndHome = () => {
    if (isLabr8Route || isServiceProvider) {
      return {
        logo: <div className="text-2xl font-bold text-[#00eada]">LAB-R8</div>,
        homeRoute: "/labr8/inbox"
      };
    }
    if (isModul8Route) {
      return {
        logo: <div className="text-2xl font-bold text-[#00eada]">MODUL8</div>,
        homeRoute: "/modul8"
      };
    }
    if (isRel8Route) {
      return {
        logo: <div className="text-2xl font-bold text-[#00eada]">REL8-T</div>,
        homeRoute: "/rel8t"
      };
    }
    return {
      logo: <img 
        src="https://www.pollen8.app/wp-content/uploads/2024/03/POLLEN8-1trans.png" 
        alt="Pollen8" 
        className="max-w-full w-[100px]" 
      />,
      homeRoute: "/welcome"
    };
  };

  const { logo, homeRoute } = getLogoAndHome();

  // Choose the appropriate navigation drawer
  const renderNavigationDrawer = () => {
    if (isLabr8Route || isServiceProvider) {
      return (
        <Labr8NavigationDrawer 
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          currentUser={currentUser}
          logout={logout}
        />
      );
    }
    if (isModul8Route) {
      return (
        <Modul8NavigationDrawer 
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          currentUser={currentUser}
          logout={logout}
        />
      );
    }
    if (isRel8Route) {
      return (
        <Rel8NavigationDrawer 
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          currentUser={currentUser}
          logout={logout}
        />
      );
    }
    return (
      <NavigationDrawer 
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentUser={currentUser}
        logout={logout}
      />
    );
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center px-4">
        {/* Logo */}
        <Link 
          to={homeRoute} 
          className="mr-auto flex items-center space-x-2"
        >
          {logo}
        </Link>
        
        {/* Navigation Drawer */}
        {renderNavigationDrawer()}
        
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
