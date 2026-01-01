import { connectionStrengths } from "@/data/mockNetworkData";
import { cn } from "@/lib/utils";

interface ConnectionStrengthGaugeProps {
  strength: 'spark' | 'ember' | 'flame' | 'star';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ConnectionStrengthGauge({ 
  strength, 
  showLabel = true,
  size = 'md' 
}: ConnectionStrengthGaugeProps) {
  const strengthData = connectionStrengths.find(s => s.id === strength);
  
  if (!strengthData) return null;

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
          <span 
            className="text-xs font-medium"
            style={{ color: strengthData.color }}
          >
            {strengthData.label}
          </span>
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${strengthData.percentage}%`,
            backgroundColor: strengthData.color
          }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1">{strengthData.description}</p>
      )}
    </div>
  );
}
