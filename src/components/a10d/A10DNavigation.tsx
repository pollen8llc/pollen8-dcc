import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Star,
  Users,
  Filter,
  BarChart3
} from "lucide-react";

export function A10DNavigation() {
  const location = useLocation();
  
  const navItems = [
    {
      href: "/a10d",
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: location.pathname === "/a10d"
    },
    {
      href: "/a10d/ambassadors",
      label: "Ambassadors",
      icon: Star,
      isActive: location.pathname === "/a10d/ambassadors"
    },
    {
      href: "/a10d/volunteers",
      label: "Volunteers",
      icon: Users,
      isActive: location.pathname === "/a10d/volunteers"
    },
    {
      href: "/a10d/moderators",
      label: "Moderators",
      icon: Filter,
      isActive: location.pathname === "/a10d/moderators"
    },
    {
      href: "/a10d/supporters",
      label: "Supporters",
      icon: BarChart3,
      isActive: location.pathname === "/a10d/supporters"
    }
  ];

  return (
    <nav className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              "hover:bg-background hover:text-foreground hover:shadow-sm",
              item.isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}