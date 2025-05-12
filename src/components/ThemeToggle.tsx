
import { useEffect } from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="transition-all duration-300 rounded-full w-10 h-10 cursor-default"
      aria-label="Dark theme"
      disabled
    >
      <Moon className="h-5 w-5" />
    </Button>
  );
};

export default ThemeToggle;
