import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { industries, relationshipTypes, connectionStrengths } from "@/data/mockNetworkData";
import { cn } from "@/lib/utils";

interface NetworkFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedIndustries: string[];
  onIndustriesChange: (industries: string[]) => void;
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  selectedStrengths: string[];
  onStrengthsChange: (strengths: string[]) => void;
}

export function NetworkFilters({
  searchQuery,
  onSearchChange,
  selectedIndustries,
  onIndustriesChange,
  selectedTypes,
  onTypesChange,
  selectedStrengths,
  onStrengthsChange,
}: NetworkFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleIndustry = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      onIndustriesChange(selectedIndustries.filter(i => i !== industry));
    } else {
      onIndustriesChange([...selectedIndustries, industry]);
    }
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  };

  const toggleStrength = (strength: string) => {
    if (selectedStrengths.includes(strength)) {
      onStrengthsChange(selectedStrengths.filter(s => s !== strength));
    } else {
      onStrengthsChange([...selectedStrengths, strength]);
    }
  };

  const clearAll = () => {
    onSearchChange('');
    onIndustriesChange([]);
    onTypesChange([]);
    onStrengthsChange([]);
  };

  const activeFilterCount = selectedIndustries.length + selectedTypes.length + selectedStrengths.length;
  const hasActiveFilters = searchQuery || activeFilterCount > 0;

  return (
    <div className="space-y-3">
      {/* Search Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "h-11 w-11 rounded-xl relative",
            showFilters && "bg-primary/10 text-primary"
          )}
        >
          <SlidersHorizontal className="h-5 w-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Expandable Filters - Material chip style */}
      {showFilters && (
        <div className="md-surface-1 p-4 space-y-4 animate-fade-in">
          {/* Industries */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Industry</p>
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <button
                  key={industry}
                  onClick={() => toggleIndustry(industry)}
                  className={cn(
                    "md-chip",
                    selectedIndustries.includes(industry) && "md-chip-selected"
                  )}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Relationship Types */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Relationship</p>
            <div className="flex flex-wrap gap-2">
              {relationshipTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={cn(
                    "md-chip",
                    selectedTypes.includes(type.id) && "md-chip-selected"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Connection Strength */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Strength</p>
            <div className="flex flex-wrap gap-2">
              {connectionStrengths.map(strength => (
                <button
                  key={strength.id}
                  onClick={() => toggleStrength(strength.id)}
                  className={cn(
                    "md-chip",
                    selectedStrengths.includes(strength.id) && "md-chip-selected"
                  )}
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: strength.color }}
                  />
                  {strength.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="text-primary h-9 rounded-lg"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
