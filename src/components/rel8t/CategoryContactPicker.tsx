import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, User, MapPin, Building, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string | null;
  organization: string | null;
  location: string | null;
  industry: string | null;
  category_id: string | null;
}

interface CategoryContactPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  existingContactIds: string[];
  onSave: () => void;
}

export const CategoryContactPicker = ({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  categoryColor,
  existingContactIds,
  onSave,
}: CategoryContactPickerProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { currentUser } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const loadContacts = async () => {
      if (!currentUser || !open) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('rms_contacts')
          .select('id, name, email, organization, location, industry, category_id')
          .eq('user_id', currentUser.id)
          .order('name');

        if (error) throw error;
        setContacts(data || []);
      } catch (error: any) {
        console.error('Error loading contacts:', error);
        toast({
          title: "Failed to load contacts",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadContacts();
  }, [currentUser, open]);

  useEffect(() => {
    // Reset selection when dialog opens
    if (open) {
      setSelectedIds(new Set());
      setSearchQuery('');
    }
  }, [open]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query) ||
      contact.organization?.toLowerCase().includes(query) ||
      contact.location?.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  // Separate contacts already in category vs available
  const { inCategory, available } = useMemo(() => {
    const inCat: Contact[] = [];
    const avail: Contact[] = [];
    
    filteredContacts.forEach(contact => {
      if (existingContactIds.includes(contact.id)) {
        inCat.push(contact);
      } else {
        avail.push(contact);
      }
    });
    
    return { inCategory: inCat, available: avail };
  }, [filteredContacts, existingContactIds]);

  const toggleContact = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (selectedIds.size === 0) {
      onOpenChange(false);
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('rms_contacts')
        .update({ category_id: categoryId })
        .in('id', Array.from(selectedIds));

      if (error) throw error;

      toast({
        title: "Contacts added",
        description: `${selectedIds.size} contact${selectedIds.size > 1 ? 's' : ''} added to ${categoryName}`
      });

      onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating contacts:', error);
      toast({
        title: "Failed to add contacts",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const ContactCard = ({ contact, isSelected, isInCategory }: { 
    contact: Contact; 
    isSelected: boolean;
    isInCategory: boolean;
  }) => (
    <div 
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
        backdrop-blur-md border
        ${isInCategory 
          ? 'bg-muted/30 border-muted/40 opacity-60 cursor-not-allowed' 
          : isSelected 
            ? 'bg-primary/20 border-primary/40 shadow-lg' 
            : 'bg-card/30 border-border/40 hover:bg-card/50'
        }
      `}
      onClick={() => !isInCategory && toggleContact(contact.id)}
    >
      {/* Status dot / checkbox */}
      <div className="flex-shrink-0">
        {isInCategory ? (
          <div 
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: categoryColor }}
          >
            <Check className="h-3 w-3 text-white" />
          </div>
        ) : (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => toggleContact(contact.id)}
            className="h-5 w-5"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="h-4 w-4 text-primary" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{contact.name}</span>
          {isInCategory && (
            <Badge 
              variant="outline" 
              className="text-xs flex-shrink-0"
              style={{ 
                backgroundColor: `${categoryColor}20`,
                borderColor: `${categoryColor}40`,
                color: categoryColor 
              }}
            >
              Already added
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          {contact.organization && (
            <span className="flex items-center gap-1 truncate">
              <Building className="h-3 w-3 flex-shrink-0" />
              {contact.organization}
            </span>
          )}
          {contact.organization && contact.location && (
            <span className="text-muted-foreground/50">|</span>
          )}
          {contact.location && (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              {contact.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: categoryColor }} 
            />
            Add Contacts to {categoryName}
          </DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Selection count */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Check className="h-4 w-4" />
            {selectedIds.size} contact{selectedIds.size > 1 ? 's' : ''} selected
          </div>
        )}

        {/* Contact list */}
        <ScrollArea className="flex-1 -mx-6 px-6" style={{ maxHeight: '400px' }}>
          {isLoading ? (
            <div className="flex justify-center py-8 text-muted-foreground">
              Loading contacts...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <User className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No contacts match your search' : 'No contacts found'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {/* Available contacts first */}
              {available.length > 0 && (
                <>
                  {inCategory.length > 0 && (
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                      Available ({available.length})
                    </p>
                  )}
                  {available.map(contact => (
                    <ContactCard 
                      key={contact.id} 
                      contact={contact} 
                      isSelected={selectedIds.has(contact.id)}
                      isInCategory={false}
                    />
                  ))}
                </>
              )}

              {/* Already in category */}
              {inCategory.length > 0 && (
                <>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-4 mb-2">
                    Already in category ({inCategory.length})
                  </p>
                  {inCategory.map(contact => (
                    <ContactCard 
                      key={contact.id} 
                      contact={contact} 
                      isSelected={false}
                      isInCategory={true}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={selectedIds.size === 0 || isSaving}
          >
            {isSaving ? 'Saving...' : `Add ${selectedIds.size || ''} Contact${selectedIds.size !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
