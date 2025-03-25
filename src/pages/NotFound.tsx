
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass dark:glass-dark border border-border/40 rounded-xl p-8 max-w-md w-full text-center shadow-sm">
        <div className="bg-aquamarine/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-aquamarine">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button className="bg-aquamarine text-primary-foreground hover:bg-aquamarine/90 transition-all duration-300 shadow-md">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
