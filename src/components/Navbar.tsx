
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

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
              <span className="text-primary-foreground font-bold">DCC</span>
            </span>
          </Link>
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Navbar;
