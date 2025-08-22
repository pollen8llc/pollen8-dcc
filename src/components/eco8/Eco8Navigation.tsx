import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Settings,
  Plus,
  Building2
} from 'lucide-react';

export const Eco8Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex items-center gap-2 mr-4">
        <Building2 className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">ECO8</span>
      </div>
      
      <nav className="flex gap-1">
        <Button
          asChild
          variant={isActive('/eco8/dashboard') ? 'default' : 'ghost'}
          size="sm"
        >
          <Link to="/eco8/dashboard">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
        </Button>

        <Button
          asChild
          variant={isActive('/eco8') && !isActive('/eco8/dashboard') ? 'default' : 'ghost'}
          size="sm"
        >
          <Link to="/eco8">
            <Search className="h-4 w-4 mr-2" />
            Directory
          </Link>
        </Button>

        <Button
          asChild
          variant={isActive('/eco8/members') ? 'default' : 'ghost'}
          size="sm"
        >
          <Link to="/eco8/members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </Link>
        </Button>

        <Button
          asChild
          variant={isActive('/eco8/settings') ? 'default' : 'ghost'}
          size="sm"
        >
          <Link to="/eco8/settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </Button>

        <Button asChild size="sm">
          <Link to="/eco8/setup">
            <Plus className="h-4 w-4 mr-2" />
            New Community
          </Link>
        </Button>
      </nav>
    </div>
  );
};