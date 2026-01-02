import { useRef } from "react";
import { Clock, CalendarClock, CalendarRange, CalendarDays, CalendarCheck, Settings, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TriggerTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconColor: string;
  frequency: string;
  defaultDaysAhead: number;
}

export interface TriggerTemplateWithDate extends TriggerTemplate {
  selectedDate?: Date;
}

export const TRIGGER_TEMPLATES: TriggerTemplate[] = [
  {
    id: "onetime",
    name: "One Time",
    description: "Perfect for special occasions",
    icon: Clock,
    iconColor: "text-teal-500",
    frequency: "onetime",
    defaultDaysAhead: 1
  },
  {
    id: "weekly",
    name: "Weekly",
    description: "Regular check-ins",
    icon: CalendarClock,
    iconColor: "text-blue-500",
    frequency: "weekly",
    defaultDaysAhead: 7
  },
  {
    id: "biweekly",
    name: "Biweekly",
    description: "Every two weeks",
    icon: CalendarRange,
    iconColor: "text-purple-500",
    frequency: "biweekly",
    defaultDaysAhead: 14
  },
  {
    id: "monthly",
    name: "Monthly",
    description: "Monthly touchpoints",
    icon: CalendarDays,
    iconColor: "text-orange-500",
    frequency: "monthly",
    defaultDaysAhead: 30
  },
  {
    id: "quarterly",
    name: "Quarterly",
    description: "Every three months",
    icon: CalendarCheck,
    iconColor: "text-green-500",
    frequency: "quarterly",
    defaultDaysAhead: 90
  },
  {
    id: "custom",
    name: "Custom",
    description: "Full control",
    icon: Settings,
    iconColor: "text-muted-foreground",
    frequency: "custom",
    defaultDaysAhead: 0
  }
];

interface TriggerTemplateSelectionProps {
  onSelectTemplate: (template: TriggerTemplateWithDate) => void;
  selectedTemplateId?: string;
}

export function TriggerTemplateSelection({ 
  onSelectTemplate,
  selectedTemplateId
}: TriggerTemplateSelectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTemplateSelect = (template: TriggerTemplate) => {
    const calculatedDate = new Date();
    calculatedDate.setDate(calculatedDate.getDate() + template.defaultDaysAhead);
    onSelectTemplate({
      ...template,
      selectedDate: calculatedDate
    });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Choose a Template
        </h2>
        <p className="text-sm text-muted-foreground">
          Select a preset to get started quickly
        </p>
      </div>

      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div 
        ref={scrollRef}
        className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto md:overflow-visible scrollbar-hide pb-2 -mx-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TRIGGER_TEMPLATES.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplateId === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={cn(
                "flex-shrink-0 w-[140px] md:w-auto",
                "flex flex-col items-center gap-3 p-4 rounded-2xl",
                "border-2 transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-xl",
                "bg-background/60 backdrop-blur-xl",
                isSelected
                  ? "border-primary shadow-lg shadow-primary/20 bg-primary/5"
                  : "border-border/30 hover:border-primary/40"
              )}
            >
              <div className={cn(
                "relative p-3 rounded-xl transition-all duration-300",
                isSelected ? "bg-primary/20" : "bg-muted/30"
              )}>
                <Icon className={cn(
                  "h-6 w-6 transition-colors",
                  isSelected ? "text-primary" : template.iconColor
                )} />
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-0.5">
                <div className={cn(
                  "text-sm font-semibold transition-colors",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {template.name}
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-2">
                  {template.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
