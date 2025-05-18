
import React from "react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
  containerClassName?: string;
  heroMode?: boolean; // For full-bleed hero sections
}

export function Shell({ 
  children, 
  className, 
  fullWidth = false,
  noPadding = false,
  containerClassName,
  heroMode = false, // For full-bleed hero sections
  ...props
}: ShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      {!heroMode && <Navbar />}
      <div className={cn(
        noPadding ? "" : "px-4 py-6",
        heroMode ? "w-full" : // Hero mode gets full width with no container
          fullWidth 
            ? "w-full" 
            : cn("container mx-auto", containerClassName || "max-w-6xl"),
      )}>
        {children}
      </div>
    </div>
  );
}
