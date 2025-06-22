
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Home,
  Building,
  Users
} from "lucide-react";

interface UnifiedHeaderProps {
  platform: 'labr8' | 'modul8';
  user?: any;
  notificationCount?: number;
  unreadMessages?: number;
  onLogout?: () => void;
}

export function UnifiedHeader({ 
  platform, 
  user, 
  notificationCount = 0, 
  unreadMessages = 0,
  onLogout 
}: UnifiedHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const platformConfig = {
    labr8: {
      title: "LAB-R8",
      subtitle: "Provider Portal",
      color: "#00eada",
      basePath: "/labr8"
    },
    modul8: {
      title: "Modul8",
      subtitle: "Organizer Hub", 
      color: "#00eada",
      basePath: "/modul8"
    }
  };

  const config = platformConfig[platform];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        {/* Logo & Platform */}
        <Link to={`${config.basePath}/dashboard`} className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00eada] to-[#00c4b8] flex items-center justify-center shadow-lg">
              {platform === 'labr8' ? (
                <Building className="h-5 w-5 text-white" />
              ) : (
                <Users className="h-5 w-5 text-white" />
              )}
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{config.title}</div>
            <div className="text-xs text-gray-500">{config.subtitle}</div>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={`Search ${platform === 'labr8' ? 'requests, clients, projects' : 'providers, requests, domains'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200/50 focus:border-[#00eada]/50 focus:ring-[#00eada]/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Platform Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9">
                <Home className="h-4 w-4 mr-2" />
                Switch Platform
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/labr8/dashboard')}>
                <Building className="h-4 w-4 mr-2" />
                LAB-R8 Provider
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/modul8/dashboard')}>
                <Users className="h-4 w-4 mr-2" />
                Modul8 Organizer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            )}
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
            <MessageSquare className="h-4 w-4" />
            {unreadMessages > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-3">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-[#00eada] text-white text-xs">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.full_name || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
