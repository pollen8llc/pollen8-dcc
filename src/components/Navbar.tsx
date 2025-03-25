
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 dark:bg-background/80 backdrop-blur-md py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-xl font-semibold flex items-center space-x-2"
          >
            <span className="bg-aquamarine rounded-lg w-8 h-8 flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold">CD</span>
            </span>
            <span className="transition-all duration-300">
              Community Directory
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="transition-all duration-200 hover:text-aquamarine"
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="transition-all duration-200 hover:text-aquamarine"
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button
              variant="default"
              className="bg-aquamarine text-primary-foreground shadow-md hover:bg-aquamarine/90"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 transition-transform duration-300 ease-in-out" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-300 ease-in-out" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass dark:glass-dark absolute top-full left-0 right-0 py-4 px-6 shadow-md border-t border-border/10 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="py-2 transition-all duration-200 hover:text-aquamarine"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="py-2 transition-all duration-200 hover:text-aquamarine"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <div className="flex items-center justify-between pt-4 border-t border-border/20">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                className="rounded-full"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                className="bg-aquamarine text-primary-foreground shadow-md hover:bg-aquamarine/90"
              >
                Sign In
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
