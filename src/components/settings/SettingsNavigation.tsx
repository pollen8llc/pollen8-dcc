import { useNavigate, useLocation } from "react-router-dom";
import { User, Shield, Database, Bell, Laptop, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNavItems = [
  { label: "Account", path: "/settings/account", icon: User },
  { label: "Privacy", path: "/settings/privacy", icon: Shield },
  { label: "Data", path: "/settings/data", icon: Database },
  { label: "Notifications", path: "/settings/notifications", icon: Bell },
  { label: "Platform", path: "/settings/platform", icon: Laptop },
  { label: "Tables", path: "/settings/tables", icon: Table2 },
];

export const SettingsNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-wrap gap-2 p-1 rounded-lg bg-card/30 backdrop-blur-md border border-border/50">
      {settingsNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
              "hover:bg-primary/10 hover:text-primary",
              isActive 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
