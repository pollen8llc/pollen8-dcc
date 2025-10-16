import * as React from "react"
import { cn } from "@/lib/utils"

interface GlassmorphicProgressProps {
  value?: number;
  className?: string;
  showPercentage?: boolean;
}

const GlassmorphicProgress = React.forwardRef<
  HTMLDivElement,
  GlassmorphicProgressProps
>(({ className, value = 0, showPercentage = false }, ref) => {
  return (
    <div className={cn("relative w-full", className)} ref={ref}>
      <div className="relative h-2 w-full rounded-full overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400/80 via-cyan-400/80 to-blue-400/80 backdrop-blur-sm shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all duration-700 ease-out relative overflow-hidden"
          style={{ width: `${value}%` }}
        >
          {/* Animated shimmer effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{
              animation: "shimmer 2s infinite",
              backgroundSize: "200% 100%"
            }}
          />
        </div>
      </div>
      
      {showPercentage && (
        <div className="mt-2 text-center">
          <span className="text-xs font-medium text-muted-foreground backdrop-blur-sm bg-background/50 px-2 py-1 rounded-full">
            {Math.round(value)}%
          </span>
        </div>
      )}
    </div>
  );
});

GlassmorphicProgress.displayName = "GlassmorphicProgress";

export { GlassmorphicProgress };
