import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LocationSelector } from '@/components/ui/location-selector';

interface FilterDialogProps {
  children: React.ReactNode;
  title: string;
  type: 'tags' | 'locations';
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
}

export const FilterDialog: React.FC<FilterDialogProps> = ({
  children,
  title,
  type,
  selectedValues,
  onSelectionChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedValues);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  // Handle location selection for location type
  const handleLocationSelect = (location: any) => {
    if (type === 'locations') {
      const locationName = location.name || location.formatted_address || location;
      setSelectedLocation(locationName);
      setTempSelected([locationName]);
    }
  };

  // Fetch all unique tags from communities (only for tags, not locations)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (type === 'tags') {
          const { data, error } = await supabase
            .from('communities')
            .select('tags')
            .not('tags', 'is', null);
          
          if (error) throw error;
          
          const uniqueTags = new Set<string>();
          data?.forEach(community => {
            if (Array.isArray(community.tags)) {
              community.tags.forEach(tag => {
                if (tag && tag.trim()) {
                  uniqueTags.add(tag.trim());
                }
              });
            }
          });
          
          setAllItems(Array.from(uniqueTags).sort());
        }
        // For locations, we don't fetch from communities anymore - we use LocationSelector
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        setAllItems([]);
      }
    };

    if (isOpen && type === 'tags') {
      fetchItems();
    }
  }, [isOpen, type]);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allItems.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(allItems);
    }
  }, [allItems, searchQuery]);

  // Reset temp selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedValues);
    }
  }, [isOpen, selectedValues]);

  const handleToggleItem = (item: string) => {
    setTempSelected(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleDone = () => {
    if (type === 'locations') {
      onSelectionChange(selectedLocation ? [selectedLocation] : []);
    } else {
      onSelectionChange(tempSelected);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    if (type === 'locations') {
      setSelectedLocation('');
    } else {
      setTempSelected([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Search Bar - Only for tags */}
          {type === 'tags' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${type}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Location Selector for location type */}
          {type === 'locations' && (
            <div className="space-y-4">
              <LocationSelector
                value={selectedLocation}
                onValueChange={setSelectedLocation}
                onLocationSelect={handleLocationSelect}
                placeholder="Select location to filter by"
                allowCustomInput={true}
                showHierarchy={true}
              />
            </div>
          )}

          {/* Selected Items Count */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {type === 'locations' 
                ? (selectedLocation ? '1 selected' : '0 selected')
                : `${tempSelected.length} selected`
              }
            </span>
            {((type === 'locations' && selectedLocation) || (type === 'tags' && tempSelected.length > 0)) && (
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Tags Cloud - Only for tags */}
          {type === 'tags' && (
            <ScrollArea className="flex-1 min-h-0">
              <div className="flex flex-wrap gap-2 p-1">
                {filteredItems.map((item) => {
                  const isSelected = tempSelected.includes(item);
                  return (
                    <Badge
                      key={item}
                      variant={isSelected ? "default" : "outline"}
                      className={`
                        cursor-pointer transition-all duration-200 hover:scale-105
                        ${isSelected 
                          ? 'bg-primary/20 text-primary border-primary/40 backdrop-blur-sm shadow-lg' 
                          : 'bg-card/60 hover:bg-card/80 backdrop-blur-sm border-border/40 hover:border-primary/60'
                        }
                      `}
                      onClick={() => handleToggleItem(item)}
                    >
                      {item}
                    </Badge>
                  );
                })}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No {type} found
                </div>
              )}
            </ScrollArea>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleDone} className="flex-1">
              Done ({type === 'locations' ? (selectedLocation ? 1 : 0) : tempSelected.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};