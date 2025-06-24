
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Bell,
  Filter,
  LayoutDashboard,
  Users,
  FolderOpen,
  MessageSquare,
  DollarSign,
  Settings,
  User,
  TrendingUp,
  FileText,
  Calendar
} from "lucide-react";

interface Labr8NavigationProps {
  notificationCount?: number;
  unreadMessages?: number;
}

export function Labr8Navigation({ notificationCount = 0, unreadMessages = 0 }: Labr8NavigationProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const navItems = [
    {
      href: "/labr8/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: location.pathname === "/labr8/dashboard"
    },
    {
      href: "/labr8/requests",
      label: "Requests",
      icon: FileText,
      isActive: location.pathname.startsWith("/labr8/requests"),
      badge: 5 // New requests
    },
    {
      href: "/labr8/projects",
      label: "Projects",
      icon: FolderOpen,
      isActive: location.pathname.startsWith("/labr8/projects")
    },
    {
      href: "/labr8/clients",
      label: "Clients",
      icon: Users,
      isActive: location.pathname.startsWith("/labr8/clients")
    },
    {
      href: "/labr8/messages",
      label: "Messages",
      icon: MessageSquare,
      isActive: location.pathname.startsWith("/labr8/messages"),
      badge: unreadMessages
    },
    {
      href: "/labr8/finances",
      label: "Finances",
      icon: DollarSign,
      isActive: location.pathname.startsWith("/labr8/finances")
    },
    {
      href: "/labr8/analytics",
      label: "Analytics",
      icon: TrendingUp,
      isActive: location.pathname.startsWith("/labr8/analytics")
    }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/labr8/dashboard" className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-[#00eada]">LAB-R8</div>
          <div className="text-sm text-gray-500">Provider Portal</div>
        </Link>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "hover:bg-gray-100 hover:text-gray-900",
                  item.isActive
                    ? "bg-[#00eada]/10 text-[#00eada] font-semibold"
                    : "text-gray-600"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search requests, clients, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>New Requests</DropdownMenuItem>
              <DropdownMenuItem>Active Projects</DropdownMenuItem>
              <DropdownMenuItem>High Priority</DropdownMenuItem>
              <DropdownMenuItem>This Week</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 px-1.5 text-xs">
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
