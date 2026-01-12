import { getStrengthConfig, ConnectionStrengthLevel } from "@/config/connectionStrengthConfig";
import { cn } from "@/lib/utils";

interface ConnectionStrengthBarProps {
  strength: ConnectionStrengthLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConnectionStrengthBar({ strength, showLabel = true, size = 'md', className }: ConnectionStrengthBarProps) {
  const strengthData = getStrengthConfig(strength);
  
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-muted-foreground">Connection Strength</span>
          <span className={cn("text-xs font-medium", strengthData.textClass)}>{strengthData.label}</span>
        </div>
      )}
      <div className={cn("w-full bg-muted/50 rounded-full overflow-hidden", heights[size])}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
            strengthData.gradientClass,
            strength === 'star' && "shadow-[0_0_10px_rgba(20,184,166,0.4)]",
            strength === 'flame' && "shadow-[0_0_8px_rgba(16,185,129,0.3)]"
          )}
          style={{ width: `${strengthData.percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground/60">Weak</span>
          <span className="text-[10px] text-muted-foreground/60">Strong</span>
        </div>
      )}
    </div>
  );
}
