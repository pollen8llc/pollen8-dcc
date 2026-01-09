import { getConnectionStrength } from "@/data/mockNetworkData";
import { cn } from "@/lib/utils";

interface ConnectionStrengthBarProps {
  strength: 'spark' | 'ember' | 'flame' | 'star';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConnectionStrengthBar({ strength, showLabel = true, size = 'md', className }: ConnectionStrengthBarProps) {
  const strengthData = getConnectionStrength(strength);
  
  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const strengthColors: Record<string, string> = {
    spark: 'bg-destructive',
    ember: 'bg-amber-500',
    flame: 'bg-[#00eada]',
    star: 'bg-[#00eada] shadow-[0_0_10px_rgba(0,234,218,0.5)]'
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-muted-foreground">Connection Strength</span>
          <span className="text-xs font-medium">{strengthData?.label}</span>
        </div>
      )}
      <div className={`w-full bg-muted/50 rounded-full ${heights[size]} overflow-hidden`}>
        <div 
          className={`${heights[size]} rounded-full transition-all duration-500 ${strengthColors[strength]}`}
          style={{ width: `${strengthData?.percentage || 25}%` }}
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
