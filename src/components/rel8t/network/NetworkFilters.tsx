import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Grid3X3, List } from "lucide-react";
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
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
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
  viewMode,
  onViewModeChange,
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

  const hasActiveFilters = searchQuery || selectedIndustries.length > 0 || selectedTypes.length > 0 || selectedStrengths.length > 0;

  return (
    <div className="space-y-4">
      {/* Search and View Toggle Row */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card/40 border-border/30"
          />
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "border-border/30",
            showFilters && "bg-primary/10 border-primary/30"
          )}
        >
          <Filter className="h-4 w-4" />
        </Button>
        
        <div className="flex border border-border/30 rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "rounded-none",
              viewMode === 'grid' && "bg-primary/10"
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewModeChange('list')}
            className={cn(
              "rounded-none",
              viewMode === 'list' && "bg-primary/10"
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="glass-morphism rounded-xl p-4 space-y-4">
          {/* Industries */}
          <div>
            <h4 className="text-sm font-medium mb-2">Industries</h4>
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <Badge
                  key={industry}
                  variant={selectedIndustries.includes(industry) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          {/* Relationship Types */}
          <div>
            <h4 className="text-sm font-medium mb-2">Relationship Type</h4>
            <div className="flex flex-wrap gap-2">
              {relationshipTypes.map(type => (
                <Badge
                  key={type.id}
                  variant={selectedTypes.includes(type.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleType(type.id)}
                  style={selectedTypes.includes(type.id) ? { backgroundColor: type.color } : {}}
                >
                  {type.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Connection Strength */}
          <div>
            <h4 className="text-sm font-medium mb-2">Connection Strength</h4>
            <div className="flex flex-wrap gap-2">
              {connectionStrengths.map(strength => (
                <Badge
                  key={strength.id}
                  variant={selectedStrengths.includes(strength.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleStrength(strength.id)}
                  style={selectedStrengths.includes(strength.id) ? { backgroundColor: strength.color } : {}}
                >
                  {strength.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
