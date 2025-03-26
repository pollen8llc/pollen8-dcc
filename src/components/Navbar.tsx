
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";

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
            <Logo width={26} height={10} showText={false} className="text-foreground" />
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="transition-all duration-300 rounded-full w-10 h-10"
          aria-label="Menu"
        >
          <Grid className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
