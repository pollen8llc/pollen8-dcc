
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  Home,
  Building2,
  User,
  Settings,
  LogOut,
  Bell,
  MessageSquare,
  FolderOpen,
  LayoutDashboard,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react';

interface PlatformNavigationProps {
  platform: 'modul8' | 'labr8';
  className?: string;
}

export const PlatformNavigation: React.FC<PlatformNavigationProps> = ({
  platform,
  className = ''
}) => {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(platform === 'labr8' ? '/labr8' : '/modul8');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = platform === 'labr8' ? [
    {
      href: '/labr8/inbox',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: location.pathname === '/labr8/inbox' || location.pathname === '/labr8/dashboard'
    },
    {
      href: '/labr8/projects',
      label: 'Projects',
      icon: FolderOpen,
      isActive: location.pathname.startsWith('/labr8/projects')
    },
    {
      href: '/labr8/clients',
      label: 'Clients',
      icon: Users,
      isActive: location.pathname.startsWith('/labr8/clients')
    },
    {
      href: '/labr8/analytics',
      label: 'Analytics',
      icon: TrendingUp,
      isActive: location.pathname.startsWith('/labr8/analytics')
    }
  ] : [
    {
      href: '/modul8',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: location.pathname === '/modul8'
    },
    {
      href: '/modul8/providers',
      label: 'Providers',
      icon: Users,
      isActive: location.pathname.startsWith('/modul8/providers')
    },
    {
      href: '/modul8/request/create',
      label: 'New Request',
      icon: FileText,
      isActive: location.pathname.startsWith('/modul8/request')
    }
  ];

  const platformConfig = {
    modul8: {
      name: 'MODUL8',
      color: '#00eada',
      subtitle: 'Organizer Portal',
      homeRoute: '/modul8'
    },
    labr8: {
      name: 'LAB-R8',
      color: '#00eada', 
      subtitle: 'Service Provider Portal',
      homeRoute: '/labr8/inbox'
    }
  };

  const config = platformConfig[platform];

  return (
    <nav className={`border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 ${className}`}>
      <div className="flex h-14 items-center px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to={config.homeRoute} className="mr-6 flex items-center space-x-2">
          <div className="text-2xl font-bold" style={{ color: config.color }}>
            {config.name}
          </div>
          <div className="text-sm text-muted-foreground hidden sm:block">
            {config.subtitle}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground ${
                  item.isActive
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Platform switcher */}
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" />
            Main Platform
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 px-1.5 text-xs">
              3
            </Badge>
          </Button>

          {/* User menu */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={() => navigate(platform === 'labr8' ? '/labr8/auth' : '/auth')} 
              variant="ghost" 
              size="sm"
            >
              Sign In
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-4 mt-4">
                <div className="text-lg font-semibold" style={{ color: config.color }}>
                  {config.name}
                </div>
                
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          item.isActive
                            ? 'bg-accent text-accent-foreground font-semibold'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Home className="h-4 w-4" />
                    <span>Main Platform</span>
                  </Link>
                  
                  {currentUser && (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default PlatformNavigation;
