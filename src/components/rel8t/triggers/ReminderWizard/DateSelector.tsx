import { useState, useMemo } from "react";
import { format, addDays, startOfWeek, addWeeks, isSameDay, isToday, isTomorrow } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  className?: string;
}

export function DateSelector({ value, onChange, className }: DateSelectorProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  
  const weeks = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [weekOffset]);

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE');
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Week Navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setWeekOffset(prev => Math.max(prev - 1, 0))}
          disabled={weekOffset === 0}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            "transition-all duration-200 active:scale-90",
            weekOffset === 0
              ? "text-muted-foreground/30 cursor-not-allowed"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-sm font-medium text-muted-foreground">
          {format(weeks[0], 'MMM yyyy')}
        </span>
        
        <button
          type="button"
          onClick={() => setWeekOffset(prev => prev + 1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Date Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {weeks.map((date) => {
          const isSelected = value && isSameDay(date, value);
          const isPast = isPastDate(date);
          
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => onChange(date)}
              className={cn(
                "flex-1 min-w-[52px] flex flex-col items-center gap-0.5 py-3 px-2 rounded-2xl",
                "transition-all duration-200 active:scale-95",
                isPast && "opacity-40 cursor-not-allowed",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-secondary/30 text-foreground hover:bg-secondary/60"
              )}
            >
              <span className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {getDateLabel(date)}
              </span>
              <span className="text-xl font-bold">
                {format(date, 'd')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Date Display */}
      {value && (
        <div className="text-center">
          <span className="text-sm text-primary font-medium">
            {format(value, 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
      )}
    </div>
  );
}
