import { cn } from "@/lib/utils";

interface PrioritySelectorProps {
  value: string;
  onChange: (priority: string) => void;
  className?: string;
}

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-emerald-500', ring: 'ring-emerald-500/30' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500', ring: 'ring-amber-500/30' },
  { value: 'high', label: 'High', color: 'bg-rose-500', ring: 'ring-rose-500/30' },
];

export function PrioritySelector({ value, onChange, className }: PrioritySelectorProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      {priorities.map((priority) => {
        const isSelected = value === priority.value;
        
        return (
          <button
            key={priority.value}
            type="button"
            onClick={() => onChange(priority.value)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl",
              "transition-all duration-200 active:scale-95",
              "border-2",
              isSelected
                ? `${priority.ring} ring-4 border-transparent bg-secondary`
                : "border-border/50 bg-secondary/30 hover:bg-secondary/60"
            )}
          >
            <div className={cn(
              "w-3 h-3 rounded-full",
              priority.color,
              isSelected && "animate-pulse"
            )} />
            <span className={cn(
              "text-sm font-semibold",
              isSelected ? "text-foreground" : "text-muted-foreground"
            )}>
              {priority.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
