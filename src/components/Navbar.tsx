
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenuDropdown } from '@/components/navbar/UserMenuDropdown';
import { NavigationDrawer } from '@/components/navbar/NavigationDrawer';
import { 
  Home, 
  User, 
  BookOpen, 
  BarChart3,
  Settings,
  Menu,
  Users,
  Zap,
  Database
} from 'lucide-react';

const Navbar = () => {
  const { currentUser } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navigationItems = [
    { path: '/welcome', label: 'Dashboard', icon: Home },
    { path: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
    { path: '/knowledge/my-resources', label: 'My Resources', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/rel8t', label: 'Rel8t CRM', icon: Database }
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link to="/welcome" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Lovable</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors hover:text-foreground/80 ${
                  isActive(item.path) ? 'text-foreground' : 'text-foreground/60'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Mobile Navigation */}
        <NavigationDrawer />
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search could go here */}
          </div>
          
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            
            {currentUser ? (
              <UserMenuDropdown />
            ) : (
              <Button onClick={() => navigate('/auth')} variant="ghost" size="sm">
                Sign In
              </Button>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
