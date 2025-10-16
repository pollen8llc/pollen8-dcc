
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
  }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-visible rounded-full bg-muted/80 border border-border/50",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full flex-1 rounded-full transition-all duration-500 ease-out shadow-[0_0_15px_rgba(20,184,166,0.5)]",
        indicatorClassName || "bg-gradient-to-r from-teal-500 to-blue-500"
      )}
      style={{ 
        width: `${value || 0}%`,
        transform: 'translateX(0)'
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// High-contrast glow progress bar (no animation)
const GlowProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-muted/60 border border-border",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn("h-full w-full flex-1 bg-accent")}
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        boxShadow:
          '0 10px 15px -3px hsl(var(--accent) / 0.5), 0 4px 6px -2px hsl(var(--accent) / 0.5)'
      }}
    />
  </ProgressPrimitive.Root>
));
GlowProgress.displayName = "GlowProgress";

export { Progress, GlowProgress }
