import { useState, useRef } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  daysToShow?: number;
}

export function DateSelector({ selectedDate, onDateChange, daysToShow = 14 }: DateSelectorProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dates = Array.from({ length: daysToShow }, (_, i) => addDays(new Date(), i));

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date);
      setCalendarOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground/80">When should this trigger?</label>
      
      <div className="relative">
        {/* Desktop scroll buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hidden md:flex"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-1 py-2 md:px-10"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {dates.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => onDateChange(date)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-center justify-center",
                  "w-16 h-20 md:w-18 md:h-22 rounded-xl",
                  "border-2 transition-all duration-200",
                  "hover:scale-105 hover:shadow-lg",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                    : "bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50"
                )}
              >
                <span className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {format(date, "EEE")}
                </span>
                <span className={cn(
                  "text-xl font-bold",
                  isSelected ? "text-primary-foreground" : "text-foreground"
                )}>
                  {format(date, "d")}
                </span>
                <span className={cn(
                  "text-[10px] font-medium",
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {format(date, "MMM")}
                </span>
                {isToday && !isSelected && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}

          {/* More dates button */}
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex-shrink-0 flex flex-col items-center justify-center",
                  "w-16 h-20 md:w-18 md:h-22 rounded-xl",
                  "border-2 border-dashed border-border/50",
                  "bg-background/40 backdrop-blur-sm",
                  "transition-all duration-200",
                  "hover:border-primary/50 hover:bg-background/60"
                )}
              >
                <CalendarIcon className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-[10px] font-medium text-muted-foreground">More</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleCalendarSelect}
                initialFocus
                className="pointer-events-auto"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Desktop scroll buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hidden md:flex"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
