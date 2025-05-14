
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Import, 
  Settings, 
  Calendar
} from 'lucide-react';

const Rel8Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, path: "/rel8t" },
    { name: "Contacts", icon: <Users className="h-5 w-5" />, path: "/rel8t/contacts" },
    { name: "Import", icon: <Import className="h-5 w-5" />, path: "/rel8t/import" },
    { name: "Wizard", icon: <Calendar className="h-5 w-5" />, path: "/rel8t/wizard" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/rel8t/settings" },
  ];
  
  const isActive = (path: string) => {
    if (path === "/rel8t" && currentPath === "/rel8t") {
      return true;
    }
    return currentPath.startsWith(path) && path !== "/rel8t";
  };
  
  return (
    <div className="mb-6 overflow-x-auto">
      <nav className="flex bg-muted/50 rounded-lg p-1 min-w-max">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
              ${isActive(item.path) 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"}
            `}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Rel8Navigation;
