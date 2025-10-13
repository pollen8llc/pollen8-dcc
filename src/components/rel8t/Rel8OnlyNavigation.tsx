
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Building2, 
  Zap, 
  Upload,
  Calendar,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { UnifiedAvatar } from "@/components/ui/unified-avatar";

export function Rel8OnlyNavigation() {
  const location = useLocation();
  const { currentUser } = useUser();
  
  const navItems = [
    {
      href: "/rel8",
      label: "Relationships",
      icon: Calendar,
      iconColor: "text-cyan-500",
      isActive: location.pathname === "/rel8"
    },
    {
      href: "/rel8/contacts",
      label: "Contacts",
      icon: Users,
      iconColor: "text-blue-500",
      isActive: location.pathname.startsWith("/rel8/contacts")
    },
    {
      href: "/rel8/import",
      label: "Import",
      icon: Upload,
      iconColor: "text-green-500",
      isActive: location.pathname === "/rel8/import"
    },
    {
      href: "/rel8/triggers",
      label: "Triggers",
      icon: Zap,
      iconColor: "text-orange-500",
      isActive: location.pathname.startsWith("/rel8/triggers")
    },
    {
      href: "/rel8/categories",
      label: "Categories",
      icon: Building2,
      iconColor: "text-purple-500",
      isActive: location.pathname === "/rel8/categories"
    }
  ];

  return (
    <nav className="grid grid-cols-6 gap-2 p-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg">
      {/* Avatar Link */}
      <Link
        to="/p8/dashboard"
        className={cn(
          "flex items-center justify-center transition-all duration-200",
          "hover:scale-105 hover:shadow-[#00eada]/20"
        )}
      >
        <UnifiedAvatar
          userId={currentUser?.id}
          size={48}
        />
      </Link>
      
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
    </nav>
  );
}
