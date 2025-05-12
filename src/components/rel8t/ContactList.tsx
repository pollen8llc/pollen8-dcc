import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContacts, Contact, getCategories, ContactCategory } from "@/services/rel8t/contactService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Building,
  Briefcase,
  User,
  Calendar,
  Tags,
  RefreshCcw,
  Filter
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";

interface ContactListProps {
  contacts?: Contact[];
  isLoading?: boolean;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  onAddContact?: () => void;
  onRefresh?: () => void;
}

const ContactList: React.FC<ContactListProps> = ({ 
  contacts: propContacts, 
  isLoading: propIsLoading, 
  onEdit, 
  onDelete,
  onAddContact,
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 350);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: fetchedContacts = [], isLoading: isLoadingContacts } = useQuery({
    queryKey: ["contacts", debouncedSearch],
    queryFn: () => getContacts({ searchQuery: debouncedSearch }),
    enabled: !propContacts, // Only fetch if contacts are not provided as props
  });

  // Get categories for filtering
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: () => getCategories(),
  });

  // Use contacts from props if provided, otherwise use fetched contacts
  const contacts = propContacts || fetchedContacts;
  const isLoading = propIsLoading !== undefined ? propIsLoading : isLoadingContacts;

  // Filter contacts based on search term, selected tag and category
  const filteredContacts = Array.isArray(contacts) ? contacts.filter((contact) => {
    const matchesTag = !selectedTag || 
      (contact.tags && contact.tags.includes(selectedTag));
    
    const matchesCategory = !selectedCategory || 
      (contact.category_id === selectedCategory);
    
    return matchesTag && matchesCategory;
  }) : [];

  // Get unique tags for the filter
  const uniqueTags = Array.isArray(contacts) ? Array.from(
    new Set(
      contacts
        .flatMap(contact => contact.tags || [])
        .filter(tag => tag) // Filter out empty/null tags
    )
  ).sort() : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={selectedTag || ""}
              onChange={(e) => setSelectedTag(e.target.value || null)}
            >
              <option value="">All Tags</option>
              {uniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} size="icon" title="Refresh contacts">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          )}
          {onAddContact && (
            <Button onClick={onAddContact} className="gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Contact</span>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading contacts...</p>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground/50 mx-auto" />
          <h3 className="mt-2 text-lg font-medium">No contacts found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {debouncedSearch || selectedTag || selectedCategory
              ? "Try a different search term, tag, or category"
              : "Add your first contact to get started"}
          </p>
          {onAddContact && (
            <Button onClick={onAddContact} variant="outline" className="mt-4 gap-1">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <Card 
              key={contact.id} 
              className="cursor-pointer hover:bg-muted/20 transition-colors border-border/40"
              onClick={() => onEdit && onEdit(contact)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg truncate">{contact.name}</h3>
                  {contact.category && (
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: contact.category.color }} 
                      />
                      <span className="text-xs text-muted-foreground">{contact.category.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1.5 mb-3">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.organization && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{contact.organization}</span>
                      {contact.role && (
                        <span className="text-xs text-muted-foreground ml-1">({contact.role})</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex items-start gap-1.5">
                      <Tags className="h-3.5 w-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="font-normal text-xs py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {contact.last_contact_date && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>
                        Last contact: {formatDistanceToNow(new Date(contact.last_contact_date), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactList;
