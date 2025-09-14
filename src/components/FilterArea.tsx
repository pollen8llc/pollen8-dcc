
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { LocationSelector } from "@/components/ui/location-selector";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterAreaProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  industry?: string;
  size?: string;
  location?: string;
}

export function FilterArea({ onFilterChange }: FilterAreaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({});

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out"
    >
      <CollapsibleTrigger className="flex items-center justify-center w-full py-2 text-sm text-muted-foreground border-t border-b border-border/20 hover:bg-accent/10 transition-all duration-200">
        <div className="flex items-center gap-2">
          <span>Filters</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 transition-transform duration-300" />
          ) : (
            <ChevronDown className="h-4 w-4 transition-transform duration-300" />
          )}
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 animate-fade-in">
          <Select onValueChange={(value) => handleFilterChange("industry", value)}>
            <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange("size", value)}>
            <SelectTrigger className="transition-all duration-200 hover:border-primary/50">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectItem value="1-10">1-10 members</SelectItem>
              <SelectItem value="11-50">11-50 members</SelectItem>
              <SelectItem value="51-200">51-200 members</SelectItem>
              <SelectItem value="201+">201+ members</SelectItem>
            </SelectContent>
          </Select>

          <LocationSelector
            value={filters.location || ""}
            onValueChange={(value) => handleFilterChange("location", value)}
            placeholder="Location"
            allowCustomInput={false}
            showHierarchy={true}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
