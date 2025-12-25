import { warmthLevels } from "@/data/mockNetworkData";
import { cn } from "@/lib/utils";
import { Snowflake, Minus, Sun, Flame } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Snowflake,
  Minus,
  Sun,
  Flame,
};

interface WarmthSliderProps {
  value: 'cold' | 'neutral' | 'warm' | 'enthusiastic';
  onChange?: (value: 'cold' | 'neutral' | 'warm' | 'enthusiastic') => void;
  readonly?: boolean;
}

export function WarmthSlider({ value, onChange, readonly = false }: WarmthSliderProps) {
  const currentIndex = warmthLevels.findIndex(l => l.id === value);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Interaction Warmth</span>
        <span 
          className="text-sm font-medium"
          style={{ color: warmthLevels[currentIndex]?.color }}
        >
          {warmthLevels[currentIndex]?.label}
        </span>
      </div>
      
      <div className="flex gap-2">
        {warmthLevels.map((level, index) => {
          const Icon = iconMap[level.icon] || Minus;
          const isActive = index <= currentIndex;
          
          return (
            <button
              key={level.id}
              onClick={() => !readonly && onChange?.(level.id as typeof value)}
              disabled={readonly}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 p-3 rounded-lg transition-all",
                "border",
                isActive 
                  ? "border-primary/30 bg-primary/10" 
                  : "border-border/30 bg-card/40 hover:bg-card/60",
                readonly && "cursor-default"
              )}
            >
              <Icon 
                className="h-5 w-5"
                style={{ color: isActive ? level.color : 'hsl(var(--muted-foreground))' }}
              />
              <span 
                className="text-xs"
                style={{ color: isActive ? level.color : 'hsl(var(--muted-foreground))' }}
              >
                {level.label}
              </span>
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        {warmthLevels[currentIndex]?.description}
      </p>
    </div>
  );
}
