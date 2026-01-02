import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrioritySelectorProps {
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
}

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "text-green-500", bg: "bg-green-500/20" },
  { value: "medium", label: "Medium", color: "text-yellow-500", bg: "bg-yellow-500/20" },
  { value: "high", label: "High", color: "text-orange-500", bg: "bg-orange-500/20" },
  { value: "urgent", label: "Urgent", color: "text-red-500", bg: "bg-red-500/20" },
];

export function PrioritySelector({ selectedPriority, onPriorityChange }: PrioritySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground/80">Priority</label>
      
      <div className="flex gap-2">
        {PRIORITY_OPTIONS.map((option) => {
          const isSelected = selectedPriority === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onPriorityChange(option.value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl",
                "border-2 transition-all duration-200",
                "hover:scale-[1.02]",
                isSelected
                  ? `${option.bg} border-current ${option.color}`
                  : "bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50"
              )}
            >
              <Flag className={cn("h-4 w-4", isSelected ? option.color : "text-muted-foreground")} />
              <span className={cn(
                "text-sm font-medium",
                isSelected ? option.color : "text-foreground"
              )}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
