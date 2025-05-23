
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Import, 
  Grid3x3, 
  ContactIcon,
  CalendarClock,
  Book,
  FileText,
  Clock,
  Tag
} from "lucide-react";

export const Rel8Navigation = () => {
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", href: "/rel8t", icon: LayoutDashboard },
    { name: "Contacts", href: "/rel8t/contacts", icon: ContactIcon },
    { name: "Relationships", href: "/rel8t/relationships", icon: CalendarClock },
    { name: "Groups", href: "/rel8t/groups", icon: Grid3x3 },
    { name: "Categories", href: "/rel8t/categories", icon: Tag },
    { name: "Import", href: "/rel8t/contacts/import", icon: Import },
    { name: "Settings", href: "/rel8t/settings", icon: Settings }
  ];
  
  const coreItems = [
    { name: "Knowledge Base", href: "/knowledge", icon: Book },
    { name: "Browse Articles", href: "/knowledge", icon: FileText },
    { name: "Browse Tags", href: "/knowledge", icon: Tag }
  ];

  return (
    <nav className="mb-4 overflow-x-auto">
      <div className="flex flex-col space-y-4">
        <div>
          <p className="px-3 text-xs uppercase font-semibold text-muted-foreground mb-2">REL8T</p>
          <div className="flex space-x-1 border-b border-border/30 pb-1">
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
                      ? "bg-royal-blue-600 text-white" 
                      : "text-muted-foreground hover:bg-royal-blue-600/10"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-3 text-xs uppercase font-semibold text-muted-foreground mb-2">CORE</p>
          <div className="flex space-x-1 border-b border-border/30 pb-1">
            {coreItems.map((item) => {
              const isActive = location.pathname === item.href || 
                              location.pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    isActive 
                      ? "bg-royal-blue-600 text-white" 
                      : "text-muted-foreground hover:bg-royal-blue-600/10"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

// For backward compatibility, export with both names
export const Rel8TNavigation = Rel8Navigation;
