
import React from "react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  noPadding?: boolean;
  containerClassName?: string;
}

export function Shell({ 
  children, 
  className, 
  fullWidth = false,
  noPadding = false,
  containerClassName,
  ...props
}: ShellProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)} {...props}>
      <Navbar />
      <div className={cn(
        noPadding ? "" : "px-4 py-6",
        fullWidth 
          ? "w-full" 
          : cn("container mx-auto", containerClassName || "max-w-6xl"),
      )}>
        {children}
      </div>
    </div>
  );
}
