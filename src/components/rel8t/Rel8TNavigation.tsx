
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
  Tag
} from "lucide-react";

export const Rel8Navigation = () => {
  const location = useLocation();
  
  const navigationItems = [
    { name: "Dashboard", href: "/rel8", icon: LayoutDashboard },
    { name: "Contacts", href: "/rel8/contacts", icon: ContactIcon },
    { name: "Relationships", href: "/rel8/relationships", icon: CalendarClock },
    { name: "Groups", href: "/rel8/groups", icon: Grid3x3 },
    { name: "Categories", href: "/rel8/categories", icon: Tag },
    { name: "Import", href: "/rel8/contacts/import", icon: Import },
    { name: "Settings", href: "/rel8/settings", icon: Settings }
  ];
  
  const coreItems = [
    { name: "Knowledge Base", href: "/knowledge", icon: Book },
    { name: "Browse Articles", href: "/knowledge", icon: FileText },
    { name: "Browse Tags", href: "/knowledge", icon: Tag }
  ];

  return (
    <nav className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-lg mb-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href || 
                        location.pathname.startsWith(item.href + '/');
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
              "hover:bg-background hover:text-foreground hover:shadow-sm",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

// For backward compatibility, export with both names
export const Rel8TNavigation = Rel8Navigation;
