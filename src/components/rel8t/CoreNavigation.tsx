
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Book,
  FileText,
  Tag,
  PlusCircle
} from "lucide-react";

export const CoreNavigation = () => {
  const location = useLocation();
  
  const coreItems = [
    { name: "Knowledge Base", href: "/knowledge", icon: Book },
    { name: "My Resources", href: "/knowledge/resources", icon: FileText },
    { name: "Browse Topics", href: "/knowledge/topics", icon: Tag },
    { name: "Create Article", href: "/knowledge/create", icon: PlusCircle }
  ];

  return (
    <nav className="mb-4 overflow-x-auto">
      <div className="flex flex-col space-y-4">
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
