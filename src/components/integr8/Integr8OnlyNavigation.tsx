import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Plug2, 
  Upload,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { UnifiedAvatar } from "@/components/ui/unified-avatar";

export function Integr8OnlyNavigation() {
  const location = useLocation();
  const { currentUser } = useUser();
  
  const navItems = [
    {
      href: "/intgr8",
      label: "Integrations",
      icon: Plug2,
      iconColor: "text-cyan-500",
      isActive: location.pathname === "/intgr8"
    },
    {
      href: "/import",
      label: "Import",
      icon: Upload,
      iconColor: "text-green-500",
      isActive: location.pathname.startsWith("/import")
    },
  ];

  return (
    <nav className="flex items-center gap-2 p-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg">
      {/* Avatar Link - scales down on smaller screens */}
      <Link
        to="/p8/dashboard"
        className="flex items-center justify-center flex-shrink-0"
      >
        <UnifiedAvatar
          userId={currentUser?.id}
          size={40}
          className="sm:w-10 sm:h-10 md:w-10 md:h-10"
        />
      </Link>
      
      {/* Navigation Items - maintain consistent size */}
      <div className="flex-1 grid grid-cols-2 gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                "hover:scale-105 hover:shadow-[#00eada]/20",
                item.isActive
                  ? "bg-white/10 border border-white/20 text-foreground shadow-lg"
                  : "bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/15"
              )}
            >
              <Icon className={cn("h-4 w-4", item.iconColor)} />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
