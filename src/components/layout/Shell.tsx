
import React from "react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Shell({ children, className }: ShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className={cn("container mx-auto px-4 py-6 max-w-6xl", className)}>
        {children}
      </div>
    </div>
  );
}
