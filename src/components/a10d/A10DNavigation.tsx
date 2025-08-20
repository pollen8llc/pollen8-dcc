import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home,
  Download
} from "lucide-react";

export function A10DNavigation() {
  const location = useLocation();
  
  const navItems = [
    {
      href: "/a10d",
      label: "Dashboard",
      icon: Home,
      isActive: location.pathname === "/a10d"
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