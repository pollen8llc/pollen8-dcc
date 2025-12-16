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
  { value: "all", label: "All" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
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

      {/* Filter Tabs - styled like profile/edit tabs */}
      <div className="grid grid-cols-4 gap-2 p-1 rounded-lg bg-muted/50 backdrop-blur-sm">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFrequencyFilterChange(option.value)}
            className={cn(
              "flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
              frequencyFilter === option.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
