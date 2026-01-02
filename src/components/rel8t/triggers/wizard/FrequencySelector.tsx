import { Clock, CalendarClock, CalendarRange, CalendarDays, CalendarCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface FrequencySelectorProps {
  selectedFrequency: string;
  onFrequencyChange: (frequency: string) => void;
}

const FREQUENCY_OPTIONS = [
  {
    value: "onetime",
    label: "One Time",
    description: "Single reminder",
    icon: Clock,
    color: "text-teal-500",
  },
  {
    value: "weekly",
    label: "Weekly",
    description: "Every 7 days",
    icon: CalendarClock,
    color: "text-blue-500",
  },
  {
    value: "biweekly",
    label: "Biweekly",
    description: "Every 2 weeks",
    icon: CalendarRange,
    color: "text-purple-500",
  },
  {
    value: "monthly",
    label: "Monthly",
    description: "Every 30 days",
    icon: CalendarDays,
    color: "text-orange-500",
  },
  {
    value: "quarterly",
    label: "Quarterly",
    description: "Every 3 months",
    icon: CalendarCheck,
    color: "text-green-500",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Set your own",
    icon: Settings,
    color: "text-muted-foreground",
  },
];

export function FrequencySelector({ selectedFrequency, onFrequencyChange }: FrequencySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground/80">How often?</label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {FREQUENCY_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedFrequency === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onFrequencyChange(option.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl",
                "border-2 transition-all duration-200",
                "hover:scale-[1.02]",
                isSelected
                  ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                  : "bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg",
                isSelected ? "bg-primary/20" : "bg-muted/50"
              )}>
                <Icon className={cn("h-5 w-5", isSelected ? "text-primary" : option.color)} />
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {option.label}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {option.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
