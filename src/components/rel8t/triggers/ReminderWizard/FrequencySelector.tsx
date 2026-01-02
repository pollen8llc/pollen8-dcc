import { Clock, CalendarClock, CalendarRange, CalendarDays, CalendarCheck, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";

interface FrequencySelectorProps {
  value: string;
  onChange: (frequency: string) => void;
  className?: string;
}

const frequencies = [
  { value: 'onetime', label: 'Once', icon: Clock, description: 'Single reminder' },
  { value: 'weekly', label: 'Weekly', icon: CalendarClock, description: 'Every 7 days' },
  { value: 'biweekly', label: 'Biweekly', icon: CalendarRange, description: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly', icon: CalendarDays, description: 'Every month' },
  { value: 'quarterly', label: 'Quarterly', icon: CalendarCheck, description: 'Every 3 months' },
];

export function FrequencySelector({ value, onChange, className }: FrequencySelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="grid grid-cols-5 gap-2">
        {frequencies.map((freq) => {
          const Icon = freq.icon;
          const isSelected = value === freq.value;
          
          return (
            <button
              key={freq.value}
              type="button"
              onClick={() => onChange(freq.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-2xl",
                "transition-all duration-200 active:scale-95",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "w-5 h-5",
                isSelected ? "text-primary-foreground" : "text-current"
              )} />
              <span className="text-xs font-semibold">{freq.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Description */}
      <div className="text-center">
        <span className="text-xs text-muted-foreground">
          {frequencies.find(f => f.value === value)?.description || 'Select frequency'}
        </span>
      </div>
    </div>
  );
}
