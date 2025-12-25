import { cn } from "@/lib/utils";

interface StatusDotProps {
  status: 'cold' | 'neutral' | 'warm' | 'enthusiastic' | 'low' | 'medium' | 'high' | 'very_high';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  // Warmth levels
  cold: { color: 'bg-blue-400', label: 'Cold' },
  neutral: { color: 'bg-muted-foreground', label: 'Neutral' },
  warm: { color: 'bg-orange-400', label: 'Warm' },
  enthusiastic: { color: 'bg-rose-500', label: 'Enthusiastic' },
  // Influence levels
  low: { color: 'bg-muted-foreground', label: 'Low' },
  medium: { color: 'bg-amber-500', label: 'Medium' },
  high: { color: 'bg-primary', label: 'High' },
  very_high: { color: 'bg-emerald-500', label: 'Very High' },
};

export function StatusDot({ status, pulse = true, size = 'md', showLabel = true }: StatusDotProps) {
  const config = statusConfig[status];
  
  const sizes = {
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3'
  };

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex">
        <span
          className={cn(
            "rounded-full",
            sizes[size],
            config.color,
            pulse && "animate-pulse"
          )}
        />
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-40",
              config.color,
              "animate-ping"
            )}
            style={{ animationDuration: '2s' }}
          />
        )}
      </span>
      {showLabel && (
        <span className="text-sm">{config.label}</span>
      )}
    </div>
  );
}
