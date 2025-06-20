
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BookOpen,
  FileText,
  Tag,
  PlusCircle,
  Search,
  User
} from "lucide-react";

export function KnowledgeNavigation() {
  const location = useLocation();
  
  const navItems = [
    {
      href: "/knowledge",
      label: "Browse",
      icon: BookOpen,
      isActive: location.pathname === "/knowledge"
    },
    {
      href: "/knowledge/topics",
      label: "Topics",
      icon: Tag,
      isActive: location.pathname === "/knowledge/topics" || location.pathname.startsWith("/knowledge/tags/")
    },
    {
      href: "/knowledge/my-resources",
      label: "My Resources",
      icon: User,
      isActive: location.pathname === "/knowledge/my-resources"
    },
    {
      href: "/knowledge/create",
      label: "Create",
      icon: PlusCircle,
      isActive: location.pathname === "/knowledge/create"
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
              "hover:bg-background hover:text-[#00eada] hover:shadow-sm",
              item.isActive
                ? "bg-background text-[#00eada] shadow-sm"
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
