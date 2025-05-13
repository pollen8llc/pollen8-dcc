
import { useEffect } from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  // Force dark mode on mount and when the component renders
  useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add("dark");
    document.documentElement.style.colorScheme = "dark";
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="transition-all duration-300 rounded-full w-10 h-10 cursor-default bg-[#00eada]/10 text-[#00eada]"
      aria-label="Dark theme"
      disabled
    >
      <Moon className="h-5 w-5" />
    </Button>
  );
};

export default ThemeToggle;
