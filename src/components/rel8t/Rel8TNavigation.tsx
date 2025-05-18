
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Import, 
  Grid3x3, 
  ContactIcon,
  CalendarClock
} from "lucide-react";

export const Rel8Navigation = () => {
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", href: "/rel8/dashboard", icon: LayoutDashboard },
    { name: "Contacts", href: "/rel8/contacts", icon: ContactIcon },
    { name: "Relationships", href: "/rel8/relationships", icon: CalendarClock },
    { name: "Import", href: "/rel8/contacts/import", icon: Import },
    { name: "Groups", href: "/rel8/groups", icon: Grid3x3 },
    { name: "Settings", href: "/rel8/settings", icon: Settings }
  ];

  return (
    <nav className="mb-4 overflow-x-auto">
      <div className="flex space-x-1 border-b pb-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href || 
                          location.pathname.startsWith(item.href + '/');
          
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

// For backward compatibility, export with both names
export const Rel8TNavigation = Rel8Navigation;
