
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Building2, 
  Heart, 
  Zap, 
  Upload,
  BarChart3,
  FolderOpen
} from "lucide-react";

export function Rel8OnlyNavigation() {
  const location = useLocation();
  
  const navItems = [
    {
      href: "/rel8",
      label: "Dashboard",
      icon: BarChart3,
      isActive: location.pathname === "/rel8"
    },
    {
      href: "/rel8/relationships",
      label: "Relationships",
      icon: Heart,
      isActive: location.pathname.startsWith("/rel8/relationships") || location.pathname === "/rel8/wizard"
    },
    {
      href: "/rel8/contacts",
      label: "Contacts",
      icon: Users,
      isActive: location.pathname.startsWith("/rel8/contacts")
    },
    {
      href: "/rel8/import",
      label: "Import",
      icon: Upload,
      isActive: location.pathname === "/rel8/import"
    },
    {
      href: "/rel8/triggers",
      label: "Triggers",
      icon: Zap,
      isActive: location.pathname.startsWith("/rel8/triggers")
    },
    {
      href: "/rel8/categories",
      label: "Categories",
      icon: Building2,
      isActive: location.pathname === "/rel8/categories"
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
