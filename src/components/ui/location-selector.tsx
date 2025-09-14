import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, MapPin, Globe, Home, Building2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocations, type Location } from '@/hooks/useLocations';

interface LocationSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  onLocationSelect?: (location: Location) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  allowCustomInput?: boolean;
  showHierarchy?: boolean;
  required?: boolean;
}

const getLocationIcon = (type: string) => {
  switch (type) {
    case 'country':
      return <Globe className="h-4 w-4" />;
    case 'state':
      return <Building2 className="h-4 w-4" />;
    case 'city':
      return <Home className="h-4 w-4" />;
    case 'remote':
      return <MapPin className="h-4 w-4" />;
    case 'international':
      return <Globe className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
};

const getLocationTypeColor = (type: string) => {
  switch (type) {
    case 'country':
      return 'bg-royal-blue-500/20 text-royal-blue-300';
    case 'state':
      return 'bg-primary/20 text-primary';
    case 'city':
      return 'bg-secondary/20 text-secondary-foreground';
    case 'remote':
      return 'bg-accent/20 text-accent-foreground';
    case 'international':
      return 'bg-muted/20 text-muted-foreground';
    default:
      return 'bg-muted/20 text-muted-foreground';
  }
};

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value = '',
  onValueChange,
  onLocationSelect,
  placeholder = 'Search locations...',
  label = 'Location',
  className,
  disabled = false,
  allowCustomInput = true,
  showHierarchy = true,
  required = false
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { locations, isLoading, popularLocations, trackLocationUsage } = useLocations({
    searchQuery: inputValue,
    limit: 8
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleLocationSelect = async (location: Location) => {
    const locationValue = location.formatted_address || location.name;
    
    setInputValue(locationValue);
    setSelectedLocation(location);
    onValueChange(locationValue);
    setOpen(false);

    if (onLocationSelect) {
      onLocationSelect(location);
    }

    // Track usage in the lexicon system
    if (location.name) {
      try {
        await trackLocationUsage(location.name, 'location_selector', 'manual');
      } catch (error) {
        console.error('Failed to track location usage:', error);
      }
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (allowCustomInput) {
      onValueChange(newValue);
    }
    
    // Clear selected location if input doesn't match
    if (selectedLocation && selectedLocation.formatted_address !== newValue) {
      setSelectedLocation(null);
    }

    if (newValue.length >= 2) {
      setOpen(true);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allowCustomInput && inputValue.trim()) {
      e.preventDefault();
      onValueChange(inputValue.trim());
      setOpen(false);
    }
  };

  const clearSelection = () => {
    setInputValue('');
    setSelectedLocation(null);
    onValueChange('');
    inputRef.current?.focus();
  };

  const displayResults = inputValue.length >= 2 ? locations : popularLocations;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor="location-selector" className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              id="location-selector"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={() => inputValue.length >= 2 && setOpen(true)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'pr-20',
                selectedLocation && 'border-primary/50'
              )}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {inputValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted"
                  onClick={clearSelection}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandList>
              {isLoading && inputValue.length >= 2 && (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  Searching locations...
                </div>
              )}
              
              {!isLoading && displayResults.length === 0 && inputValue.length >= 2 && (
                <CommandEmpty className="p-4 text-center">
                  <div className="text-sm text-muted-foreground">
                    No locations found
                    {allowCustomInput && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onValueChange(inputValue.trim());
                            setOpen(false);
                          }}
                        >
                          Use "{inputValue}"
                        </Button>
                      </div>
                    )}
                  </div>
                </CommandEmpty>
              )}

              {displayResults.length > 0 && (
                <CommandGroup>
                  {displayResults.map((location, index) => (
                    <CommandItem
                      key={`${location.id || location.name}-${index}`}
                      value={location.formatted_address || location.name}
                      onSelect={() => handleLocationSelect(location)}
                      className="flex items-center justify-between p-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 text-muted-foreground">
                          {getLocationIcon(location.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {location.name}
                          </div>
                          {showHierarchy && location.formatted_address !== location.name && (
                            <div className="text-xs text-muted-foreground truncate">
                              {location.formatted_address}
                            </div>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-xs flex-shrink-0',
                            getLocationTypeColor(location.type)
                          )}
                        >
                          {location.type}
                        </Badge>
                      </div>
                      
                      {selectedLocation?.name === location.name && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {inputValue.length < 2 && popularLocations.length > 0 && (
                <div className="p-2">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    Popular Options
                  </div>
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {selectedLocation && (
        <div className="text-xs text-muted-foreground">
          Selected: {selectedLocation.formatted_address}
        </div>
      )}
    </div>
  );
};