import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TriggerSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  frequencyFilter: string;
  onFrequencyFilterChange: (filter: string) => void;
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
}: TriggerSearchFilterProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search reminders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
        />
      </div>

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
