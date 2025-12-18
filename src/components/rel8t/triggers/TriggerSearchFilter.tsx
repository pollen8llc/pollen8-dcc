import React, { useState } from "react";
import { Search, CalendarSearch, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TriggerSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  frequencyFilter: string;
  onFrequencyFilterChange: (filter: string) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const filterOptions = [
  { value: "all", label: "All", color: "bg-primary/20 border-primary/40 text-primary hover:bg-primary/30" },
  { value: "weekly", label: "Weekly", color: "bg-blue-500/20 border-blue-500/40 text-blue-400 hover:bg-blue-500/30" },
  { value: "monthly", label: "Monthly", color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30" },
  { value: "quarterly", label: "Quarterly", color: "bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30" },
];

export function TriggerSearchFilter({
  searchQuery,
  onSearchChange,
  frequencyFilter,
  onFrequencyFilterChange,
  selectedDate,
  onDateChange,
}: TriggerSearchFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleClearDate = () => {
    onDateChange(undefined);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar and Calendar Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reminders..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
          />
        </div>
        <Button
          variant={isCalendarOpen ? "default" : "outline"}
          size="icon"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={cn(
            "shrink-0 transition-all",
            isCalendarOpen && "bg-primary text-primary-foreground",
            selectedDate && !isCalendarOpen && "border-primary text-primary"
          )}
        >
          <CalendarSearch className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected Date Badge */}
      {selectedDate && !isCalendarOpen && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtering by:</span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-sm">
            {format(selectedDate, "MMM d, yyyy")}
            <button
              onClick={handleClearDate}
              className="hover:bg-primary/30 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Calendar */}
      {isCalendarOpen && (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onDateChange(date);
            }}
            className="pointer-events-auto"
          />
          {selectedDate && (
            <div className="flex justify-center pb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearDate}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear date
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Filter Grid - 4 button grid on mobile and desktop */}
      <div className="grid grid-cols-4 gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFrequencyFilterChange(option.value)}
            className={cn(
              "flex items-center justify-center px-2 py-2.5 text-xs sm:text-sm font-medium rounded-lg border transition-all duration-200",
              frequencyFilter === option.value
                ? cn(option.color, "shadow-md ring-1 ring-white/10")
                : "bg-muted/30 border-border/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
