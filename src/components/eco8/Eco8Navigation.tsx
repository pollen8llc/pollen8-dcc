import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Upload, Edit, Link as LinkIcon } from 'lucide-react';
import { UnifiedAvatar } from '@/components/ui/unified-avatar';
import { useUser } from '@/contexts/UserContext';

interface Eco8NavigationProps {
  hasUserCommunities?: boolean;
}

export const Eco8Navigation: React.FC<Eco8NavigationProps> = ({ hasUserCommunities = false }) => {
  const location = useLocation();
  const { currentUser } = useUser();

  const navItems = [
    {
      href: '/eco8/directory',
      label: 'Browse Communities',
      icon: Search,
      iconColor: 'text-cyan-500',
      isActive: location.pathname === '/eco8/directory'
    },
    {
      href: '/imports',
      label: 'Import Data',
      icon: Upload,
      iconColor: 'text-blue-500',
      isActive: location.pathname === '/imports'
    },
    {
      href: hasUserCommunities ? '/eco8' : '/eco8/setup',
      label: hasUserCommunities ? 'Manage Communities' : 'Create Community',
      icon: Edit,
      iconColor: 'text-purple-500',
      isActive: location.pathname === '/eco8/setup' || (location.pathname === '/eco8' && hasUserCommunities)
    },
    {
      href: '/eco8/invites',
      label: 'Manage Invites',
      icon: LinkIcon,
      iconColor: 'text-orange-500',
      isActive: location.pathname === '/eco8/invites'
    }
  ];

  return (
    <nav className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg p-2 mb-8">
      <div className="grid grid-cols-5 gap-2">
        {/* Avatar Column */}
        <Link
          to="/p8/dashboard"
          className="flex items-center justify-center"
        >
          <UnifiedAvatar userId={currentUser?.id} size={48} />
        </Link>

        {/* Navigation Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const baseClasses = "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-3 rounded-xl transition-all duration-300 border";
          const activeClasses = item.isActive
            ? "bg-white/10 border-white/20 text-foreground shadow-lg"
            : "bg-white/5 border-white/5 text-muted-foreground hover:scale-105 hover:bg-white/10 hover:border-white/15";

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`${baseClasses} ${activeClasses}`}
            >
              <Icon className={`h-5 w-5 ${item.iconColor}`} />
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap hidden sm:block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
