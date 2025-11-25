import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Tag, Filter } from "lucide-react";
import { getContacts, Contact, getCategories } from "@/services/rel8t/contactService";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import ContactForm from "@/components/rel8t/ContactForm";
import { createContact } from "@/services/rel8t/contactService";
import { useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface SelectContactsStepProps {
  selectedContacts: Contact[];
  onNext: (data: { contacts: Contact[] }) => void;
}

export const SelectContactsStep: React.FC<SelectContactsStepProps> = ({
  selectedContacts: initialSelectedContacts,
  onNext,
}) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>(initialSelectedContacts || []);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sync pre-selected contacts when prop changes
  useEffect(() => {
    if (initialSelectedContacts && initialSelectedContacts.length > 0) {
      setSelectedContacts(initialSelectedContacts);
    }
  }, [initialSelectedContacts]);

  // Fetch contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getContacts({}),
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: () => getCategories(),
  });

  const handleSubmit = () => {
    onNext({ contacts: selectedContacts });
  };

  const toggleContactSelection = (contact: Contact) => {
    setSelectedContacts(prev => {
      const isSelected = prev.some(c => c.id === contact.id);
      if (isSelected) {
        return prev.filter(c => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleCreateContact = async (values: any) => {
    setIsSubmitting(true);
    try {
      const newContact = await createContact(values);
      if (newContact) {
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        setContactDialogOpen(false);
        // Automatically select the newly created contact
        setSelectedContacts(prev => [...prev, newContact]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get unique tags for the filter
  const uniqueTags = Array.from(
    new Set(
      contacts
        .flatMap(contact => contact.tags || [])
        .filter(tag => tag) // Filter out empty/null tags
    )
  ).sort();

  // Filter contacts based on search term, selected tag, and selected category
  const filteredContacts = contacts.filter(contact => 
    (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.organization && contact.organization.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (!selectedTag || (contact.tags && contact.tags.includes(selectedTag))) &&
    (!selectedCategory || contact.category_id === selectedCategory)
  );

  // Sort contacts: pre-selected contacts appear at the TOP of the list
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const aSelected = selectedContacts.some(c => c.id === a.id);
    const bSelected = selectedContacts.some(c => c.id === b.id);
    
    // Pre-selected contacts come first
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    
    // Within each group, sort alphabetically by name
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row mb-4 gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
        
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <select
            className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="mt-2 font-semibold">No contacts found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm || selectedTag || selectedCategory 
              ? "Try adjusting your search or filters" 
              : "Add your first contact to get started"}
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {sortedContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center space-x-3 border rounded-md p-3 hover:bg-secondary/20 transition-colors"
              >
                <Checkbox
                  checked={selectedContacts.some(c => c.id === contact.id)}
                  onCheckedChange={() => toggleContactSelection(contact)}
                  id={`contact-${contact.id}`}
                />
                <label
                  htmlFor={`contact-${contact.id}`}
                  className="flex-1 flex items-center justify-between cursor-pointer text-sm"
                >
                  <div className="flex-1">
                    <div className="font-medium">{contact.name}</div>
                    <div className="flex flex-col">
                      {contact.email && (
                        <span className="text-muted-foreground text-xs">{contact.email}</span>
                      )}
                      {contact.organization && (
                        <span className="text-muted-foreground text-xs">{contact.organization}</span>
                      )}
                      {contact.category && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: contact.category.color }} />
                          <span className="text-xs">{contact.category.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 max-w-[150px] justify-end">
                      {contact.tags.map((tag, i) => (
                        <Badge
                          key={i}
                          variant="outline" 
                          className="text-xs px-2 py-1"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="mt-6 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
        </div>
        <Button
          onClick={handleSubmit}
          disabled={selectedContacts.length === 0}
        >
          Continue
        </Button>
      </div>

      {/* Dialog for adding a new contact */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm
            onSubmit={handleCreateContact}
            onCancel={() => setContactDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
