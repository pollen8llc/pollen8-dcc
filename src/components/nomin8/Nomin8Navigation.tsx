import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home,
  UserPlus,
  Settings
} from "lucide-react";

export function Nomin8Navigation() {
  const location = useLocation();
  
  const navItems = [
    {
      href: "/nmn8",
      label: "Dashboard",
      icon: Home,
      isActive: location.pathname === "/nmn8" || location.pathname === "/nmn8/manage"
    },
    {
      href: "/nmn8/settings",
      label: "Settings",
      icon: Settings,
      isActive: location.pathname === "/nmn8/settings"
    }
  ];

  return (
    <nav className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-lg mb-6">
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