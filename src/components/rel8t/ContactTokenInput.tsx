import { useState, useRef, useEffect, useCallback } from "react";
import { X, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getContacts, Contact } from "@/services/rel8t/contactService";
import { useQuery } from "@tanstack/react-query";

interface ContactTokenInputProps {
  selectedContacts: Contact[];
  onContactsChange: (contacts: Contact[]) => void;
  placeholder?: string;
  maxContacts?: number;
  className?: string;
  required?: boolean;
}

export function ContactTokenInput({
  selectedContacts,
  onContactsChange,
  placeholder = "Search contacts...",
  maxContacts,
  className,
  required = false,
}: ContactTokenInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch contacts with search
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts", searchQuery],
    queryFn: () => getContacts({ searchQuery: searchQuery || undefined }),
    staleTime: 30000,
  });

  // Filter out already selected contacts
  const availableContacts = contacts.filter(
    (contact) => !selectedContacts.some((selected) => selected.id === contact.id)
  );

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [availableContacts.length]);

  const handleSelectContact = useCallback((contact: Contact) => {
    if (maxContacts && selectedContacts.length >= maxContacts) return;
    
    onContactsChange([...selectedContacts, contact]);
    setSearchQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  }, [selectedContacts, onContactsChange, maxContacts]);

  const handleRemoveContact = useCallback((contactId: string) => {
    onContactsChange(selectedContacts.filter((c) => c.id !== contactId));
  }, [selectedContacts, onContactsChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && searchQuery === "" && selectedContacts.length > 0) {
      // Remove last contact when backspace is pressed on empty input
      handleRemoveContact(selectedContacts[selectedContacts.length - 1].id);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        Math.min(prev + 1, availableContacts.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && availableContacts[highlightedIndex]) {
      e.preventDefault();
      handleSelectContact(availableContacts[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = (contact: Contact) => {
    return contact.name || contact.email || "Unknown Contact";
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Token Input Container */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 p-3 min-h-[48px]",
          "bg-background/90 backdrop-blur-lg border-2 border-primary/30 rounded-xl shadow-lg",
          "focus-within:border-primary/60 transition-all cursor-text"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected Contact Tokens */}
        {selectedContacts.map((contact) => (
          <Badge
            key={contact.id}
            variant="secondary"
            className="flex items-center gap-1.5 py-1 px-2 bg-primary/10 hover:bg-primary/20 border border-primary/20"
          >
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px] bg-primary/20">
                {getInitials(getDisplayName(contact))}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm max-w-[120px] truncate">
              {getDisplayName(contact)}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveContact(contact.id);
              }}
              className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {/* Search Input */}
        {(!maxContacts || selectedContacts.length < maxContacts) && (
          <div className="flex-1 min-w-[150px] flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={selectedContacts.length === 0 ? placeholder : "Add more..."}
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-8 p-0 placeholder:text-muted-foreground/60"
            />
          </div>
        )}
      </div>

      {/* Required indicator */}
      {required && selectedContacts.length === 0 && (
        <p className="text-xs text-muted-foreground mt-1 pl-2">
          At least one contact is required
        </p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-popover/95 backdrop-blur-lg border border-primary/20 rounded-xl shadow-xl max-h-[280px] overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              Searching...
            </div>
          ) : availableContacts.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground text-center">
              {searchQuery ? "No contacts found" : "Type to search contacts"}
            </div>
          ) : (
            availableContacts.slice(0, 10).map((contact, index) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => handleSelectContact(contact)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-primary/10 transition-colors",
                  index === highlightedIndex && "bg-primary/10"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-xs">
                    {getInitials(getDisplayName(contact))}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {getDisplayName(contact)}
                  </p>
                  {contact.organization && (
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.organization}
                    </p>
                  )}
                </div>
                {contact.email && (
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                    {contact.email}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
