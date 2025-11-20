import { useState } from "react";
import { Clock, Calendar as CalendarIcon, CalendarRange, CalendarDays, CalendarCheck, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface TriggerTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconColor: string;
  accentColor: string;
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
    description: "Perfect for special occasions and unique events",
    icon: Clock,
    iconColor: "text-teal-500",
    accentColor: "border-teal-500/20 hover:border-teal-500/40",
    frequency: "onetime",
    defaultDaysAhead: 1
  },
  {
    id: "weekly",
    name: "Weekly",
    description: "Ideal for regular check-ins and weekly updates",
    icon: Calendar,
    iconColor: "text-blue-500",
    accentColor: "border-blue-500/20 hover:border-blue-500/40",
    frequency: "weekly",
    defaultDaysAhead: 7
  },
  {
    id: "biweekly",
    name: "Biweekly",
    description: "Great for consistent engagement every two weeks",
    icon: CalendarRange,
    iconColor: "text-purple-500",
    accentColor: "border-purple-500/20 hover:border-purple-500/40",
    frequency: "biweekly",
    defaultDaysAhead: 14
  },
  {
    id: "monthly",
    name: "Monthly",
    description: "Maintain relationships with monthly touchpoints",
    icon: CalendarDays,
    iconColor: "text-orange-500",
    accentColor: "border-orange-500/20 hover:border-orange-500/40",
    frequency: "monthly",
    defaultDaysAhead: 30
  },
  {
    id: "quarterly",
    name: "Quarterly",
    description: "Strategic check-ins every three months",
    icon: CalendarCheck,
    iconColor: "text-green-500",
    accentColor: "border-green-500/20 hover:border-green-500/40",
    frequency: "quarterly",
    defaultDaysAhead: 90
  },
  {
    id: "custom",
    name: "Custom",
    description: "Full control over all trigger settings",
    icon: Settings,
    iconColor: "text-muted-foreground",
    accentColor: "border-white/20 hover:border-white/30",
    frequency: "custom",
    defaultDaysAhead: 0
  }
];

interface TriggerTemplateSelectionProps {
  onSelectTemplate: (template: TriggerTemplateWithDate) => void;
  showDatePickers?: boolean;
}

export function TriggerTemplateSelection({ 
  onSelectTemplate,
  showDatePickers = false 
}: TriggerTemplateSelectionProps) {
  const [templateDates, setTemplateDates] = useState<Record<string, Date>>(() => {
    const initialDates: Record<string, Date> = {};
    TRIGGER_TEMPLATES.forEach(template => {
      const date = new Date();
      date.setDate(date.getDate() + template.defaultDaysAhead);
      initialDates[template.id] = date;
    });
    return initialDates;
  });

  const handleTemplateSelect = (template: TriggerTemplateWithDate) => {
    if (showDatePickers) {
      // With date pickers, return template with selected date
      onSelectTemplate({
        ...template,
        selectedDate: templateDates[template.id]
      });
    } else {
      // Without date pickers, calculate date based on defaultDaysAhead
      const calculatedDate = new Date();
      calculatedDate.setDate(calculatedDate.getDate() + template.defaultDaysAhead);
      onSelectTemplate({
        ...template,
        selectedDate: calculatedDate
      });
    }
  };

  const handleDateChange = (templateId: string, date: Date | undefined) => {
    if (date) {
      setTemplateDates(prev => ({
        ...prev,
        [templateId]: date
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Choose a Template</h2>
        <p className="text-sm text-muted-foreground">
          {showDatePickers 
            ? "Select a preset template and choose your start date" 
            : "Select a preset template to quickly create your trigger, or choose custom for full control"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRIGGER_TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              key={template.id}
              className={cn(
                "backdrop-blur-md bg-white/5 border-2 transition-all duration-300",
                "hover:bg-white/10 hover:shadow-lg hover:shadow-primary/20",
                template.accentColor,
                "p-6 space-y-4"
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn(
                  "p-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20",
                  "transition-transform duration-300"
                )}>
                  <Icon className={cn("h-6 w-6", template.iconColor)} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
              </div>

              {showDatePickers && template.id !== 'custom' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        "backdrop-blur-sm bg-background/50 hover:bg-background/70"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(templateDates[template.id], "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={templateDates[template.id]}
                      onSelect={(date) => handleDateChange(template.id, date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              )}

              <Button
                onClick={() => handleTemplateSelect(template)}
                className={cn(
                  "w-full",
                  template.id === 'custom' && "mt-auto"
                )}
                variant={template.id === 'custom' ? 'outline' : 'default'}
              >
                {showDatePickers ? 'Select & Continue' : 'Select Template'}
              </Button>

              {!showDatePickers && (
                <div className="pt-2 flex items-center text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <div className={cn("w-2 h-2 rounded-full", template.iconColor.replace('text-', 'bg-'))} />
                    {template.id === 'custom' ? 'Fully customizable' : `${template.name} schedule`}
                  </span>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
