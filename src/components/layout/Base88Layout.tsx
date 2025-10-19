import React from "react";
import { cn } from "@/lib/utils";

interface Base88LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

/**
 * Base88Layout - Standardized layout component for consistent page width across modules
 * Uses max-w-6xl to create a comfortable reading and interaction width
 */
export function Base88Layout({ 
  children, 
  className,
  ...props
}: Base88LayoutProps) {
  return (
    <div 
      className={cn("container mx-auto max-w-6xl px-4 py-8", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
