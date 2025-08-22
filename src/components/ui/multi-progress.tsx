import * as React from "react"
import { cn } from "@/lib/utils"

interface MultiProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  setupValue?: number; // 0-10 (setup completion)
  usageValue?: number; // 0-40 (usage)
  premiumValue?: number; // 0-50 (premium usage)
}

const MultiProgress = React.forwardRef<HTMLDivElement, MultiProgressProps>(
  ({ className, setupValue = 0, usageValue = 0, premiumValue = 0, ...props }, ref) => {
    // Normalize values to percentages within their segments
    const setupPercent = Math.min(setupValue, 10);
    const usagePercent = Math.min(usageValue, 40);
    const premiumPercent = Math.min(premiumValue, 50);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full h-2 bg-muted/60 rounded-full overflow-hidden border border-border/30",
          className
        )}
        {...props}
      >
        {/* Setup segment (0-10%) */}
        <div 
          className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${setupPercent}%` }}
        />
        
        {/* Usage segment (10-50%) */}
        <div 
          className="absolute top-0 h-full bg-green-500 transition-all duration-300"
          style={{ 
            left: '10%', 
            width: `${usagePercent}%` 
          }}
        />
        
        {/* Premium segment (50-100%) */}
        <div 
          className="absolute top-0 h-full bg-primary transition-all duration-300"
          style={{ 
            left: '50%', 
            width: `${premiumPercent}%` 
          }}
        />
        
        {/* Segment dividers */}
        <div className="absolute top-0 left-[10%] w-px h-full bg-background/80" />
        <div className="absolute top-0 left-[50%] w-px h-full bg-background/80" />
      </div>
    )
  }
)
MultiProgress.displayName = "MultiProgress"

export { MultiProgress }