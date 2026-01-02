import { Clock, CalendarClock, CalendarRange, CalendarDays, CalendarCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: any;
  frequency: string;
  defaultDaysAhead: number;
}

interface TemplateCarouselProps {
  onSelect: (template: Template) => void;
  className?: string;
}

const templates: Template[] = [
  {
    id: 'onetime',
    name: 'One Time',
    description: 'Single reminder',
    icon: Clock,
    frequency: 'onetime',
    defaultDaysAhead: 1
  },
  {
    id: 'weekly',
    name: 'Weekly',
    description: 'Every 7 days',
    icon: CalendarClock,
    frequency: 'weekly',
    defaultDaysAhead: 7
  },
  {
    id: 'biweekly',
    name: 'Biweekly',
    description: 'Every 2 weeks',
    icon: CalendarRange,
    frequency: 'biweekly',
    defaultDaysAhead: 14
  },
  {
    id: 'monthly',
    name: 'Monthly',
    description: 'Every month',
    icon: CalendarDays,
    frequency: 'monthly',
    defaultDaysAhead: 30
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    description: 'Every 3 months',
    icon: CalendarCheck,
    frequency: 'quarterly',
    defaultDaysAhead: 90
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Full control',
    icon: Settings,
    frequency: 'custom',
    defaultDaysAhead: 0
  }
];

export function TemplateCarousel({ onSelect, className }: TemplateCarouselProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Quick Start</h2>
        <p className="text-sm text-muted-foreground">Choose a template to begin</p>
      </div>

      {/* Template Cards */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-2 px-2">
        {templates.map((template) => {
          const Icon = template.icon;
          const isCustom = template.id === 'custom';
          
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template)}
              className={cn(
                "snap-center shrink-0 w-32 flex flex-col items-center gap-3 p-5 rounded-3xl",
                "transition-all duration-200 active:scale-95",
                "group",
                isCustom
                  ? "bg-secondary/30 border-2 border-dashed border-border hover:border-primary/50"
                  : "bg-gradient-to-b from-secondary/60 to-secondary/30 hover:from-primary/20 hover:to-primary/10"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center",
                "transition-all duration-200",
                isCustom
                  ? "bg-secondary group-hover:bg-primary/20"
                  : "bg-primary/10 group-hover:bg-primary/20"
              )}>
                <Icon className={cn(
                  "w-7 h-7",
                  isCustom
                    ? "text-muted-foreground group-hover:text-primary"
                    : "text-primary"
                )} />
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-foreground">{template.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{template.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { Template };
