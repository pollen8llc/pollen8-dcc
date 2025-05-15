
// Note: This is a complete reimplementation of the ContactList component with a sleeker, more mobile-friendly design
import { useEffect, useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getContacts, deleteMultipleContacts } from "@/services/rel8t/contactService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { MoreHorizontal, RefreshCcw, Search, Trash2 } from "lucide-react";

interface ContactListProps {
  onEdit: (contact: any) => void;
  onRefresh: () => void;
}

const ContactList = ({ onEdit, onRefresh }: ContactListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Reset selections when search query changes
    setSelectedContacts([]);
  }, [searchQuery]);
  
  // Fetch contacts with search functionality
  const { 
    data: contacts = [], 
    isLoading
  } = useQuery({
    queryKey: ["contacts", searchQuery],
    queryFn: () => getContacts({ searchQuery }),
  });
  
  const handleDeleteSelected = async () => {
    if (selectedContacts.length === 0) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedContacts.length} contact(s)?`);
    if (!confirmDelete) return;
    
    try {
      await deleteMultipleContacts(selectedContacts);
      toast({
        title: "Contacts deleted",
        description: `${selectedContacts.length} contact(s) have been deleted.`
      });
      setSelectedContacts([]);
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the selected contacts.",
        variant: "destructive"
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  const toggleSelectContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const getCategoryColor = (color: string) => {
    return `bg-${color}-100 text-${color}-800 dark:bg-${color}-900/20 dark:text-${color}-300`;
  };
  
  if (isLoading) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Loading contacts...</p>
      </div>
    );
  }
  
  if (contacts.length === 0 && !searchQuery) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground mb-4">No contacts found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 self-end">
          {selectedContacts.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteSelected}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedContacts.length})
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {contacts.length === 0 && searchQuery ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No contacts found matching "{searchQuery}"</p>
          <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center">
            <Checkbox 
              checked={selectedContacts.length === contacts.length && contacts.length > 0} 
              onCheckedChange={toggleSelectAll} 
              aria-label="Select all contacts"
              className="mr-2"
            />
            <span className="text-sm text-muted-foreground">
              {selectedContacts.length > 0 
                ? `Selected ${selectedContacts.length} of ${contacts.length}` 
                : `${contacts.length} contacts`
              }
            </span>
          </div>
          
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {contacts.map((contact) => (
                <Card 
                  key={contact.id} 
                  className={`overflow-hidden transition-all ${
                    selectedContacts.includes(contact.id) ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className={`h-2 w-full ${contact.category ? `bg-${contact.category.color}-500` : 'bg-gray-200'}`}></div>
                  <div className="p-2 flex items-center">
                    <Checkbox
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleSelectContact(contact.id)}
                      aria-label={`Select ${contact.name}`}
                      className="mr-2"
                    />
                    <h3 className="font-semibold text-lg line-clamp-1 flex-1">{contact.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(contact)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleSelectContact(contact.id)}>
                          {selectedContacts.includes(contact.id) ? 'Deselect' : 'Select'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-2 mb-3">
                      {contact.category && (
                        <Badge variant="secondary" className="mr-1">
                          {contact.category.name}
                        </Badge>
                      )}
                      {contact.organization && (
                        <Badge variant="outline" className="mr-1">
                          {contact.organization}
                        </Badge>
                      )}
                      {contact.location && (
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/10 mr-1">
                          {contact.location}
                        </Badge>
                      )}
                    </div>
                    
                    {contact.email && (
                      <p className="text-sm text-muted-foreground truncate mb-1">{contact.email}</p>
                    )}
                    {contact.phone && (
                      <p className="text-sm text-muted-foreground truncate">{contact.phone}</p>
                    )}
                    
                    <div className="mt-2 flex justify-end">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onEdit(contact)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ContactList;
