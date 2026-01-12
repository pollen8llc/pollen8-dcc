import { getStrengthConfig, ConnectionStrengthLevel } from "@/config/connectionStrengthConfig";
import { cn } from "@/lib/utils";

interface ConnectionStrengthGaugeProps {
  strength: ConnectionStrengthLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ConnectionStrengthGauge({ 
  strength, 
  showLabel = true,
  size = 'md' 
}: ConnectionStrengthGaugeProps) {
  const strengthData = getStrengthConfig(strength);

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Connection Strength</span>
          <span className={cn("text-xs font-medium", strengthData.textClass)}>
            {strengthData.label}
          </span>
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 bg-gradient-to-r",
            strengthData.gradientClass,
            strength === 'star' && "shadow-[0_0_10px_rgba(139,92,246,0.4)]",
            strength === 'flame' && "shadow-[0_0_8px_rgba(99,102,241,0.3)]"
          )}
          style={{ width: `${strengthData.percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1">{strengthData.description}</p>
      )}
    </div>
  );
}
