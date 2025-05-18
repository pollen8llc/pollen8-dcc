
import React from "react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function Shell({ children, className, fullWidth = false }: ShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className={cn(
        "mx-auto px-4 py-6", 
        fullWidth ? "container-fluid w-full" : "container max-w-6xl",
        className
      )}>
        {children}
      </div>
    </div>
  );
}
