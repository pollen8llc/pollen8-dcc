
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus } from "lucide-react";
import { getContacts, Contact } from "@/services/rel8t/contactService";
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

  // Fetch contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
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

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.organization && contact.organization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="flex mb-4 gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setContactDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <h3 className="mt-2 font-semibold">No contacts found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm ? "Try adjusting your search term" : "Add your first contact to get started"}
          </p>
          <Button onClick={() => setContactDialogOpen(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
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
                  className="flex-1 flex items-center cursor-pointer text-sm"
                >
                  <div className="flex-1">
                    <div className="font-medium">{contact.name}</div>
                    {contact.email && (
                      <div className="text-muted-foreground text-xs">{contact.email}</div>
                    )}
                    {contact.organization && (
                      <div className="text-muted-foreground text-xs">{contact.organization}</div>
                    )}
                  </div>
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
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
