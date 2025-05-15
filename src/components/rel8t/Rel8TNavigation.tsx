
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Import, 
  Grid3x3, 
  ContactIcon
} from "lucide-react";

export const Rel8TNavigation = () => {
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", href: "/rel8t", icon: LayoutDashboard },
    { name: "Contacts", href: "/rel8t/contacts", icon: ContactIcon },
    { name: "Import", href: "/rel8t/import", icon: Import },
    { name: "Groups", href: "/rel8t/groups", icon: Grid3x3 },
    { name: "Settings", href: "/rel8t/settings", icon: Settings }
  ];

  return (
    <nav className="mb-4 overflow-x-auto">
      <div className="flex space-x-1 border-b pb-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
