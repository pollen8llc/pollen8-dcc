import React, { useEffect, useState } from 'react';
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Contact, getContacts, deleteMultipleContacts } from '@/services/rel8t/contactService';
import ContactCard from './ContactCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCcw, Search, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContactListProps {
  contacts?: Contact[];
  isLoading?: boolean;
  onEdit?: (contact: Contact) => void;
  onRefresh?: () => void;
  onContactMultiSelect?: (contactId: string, selected: boolean) => void;
  selectedContacts?: string[];
  isSelectionMode?: boolean;
}

const ContactList: React.FC<ContactListProps> = ({ 
  contacts = [], 
  isLoading = false,
  onEdit,
  onRefresh,
  onContactMultiSelect,
  selectedContacts = [],
  isSelectionMode = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    // Reset selections when search query changes
    setSelectedContacts([]);
  }, [searchQuery]);

  // Fetch contacts with search functionality
  const {
    data: contactsData = [],
    isLoading: queryLoading
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
    if (selectedContacts.length === contactsData.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contactsData.map(contact => contact.id));
    }
  };

  const toggleSelectContact = (contactId: string, selected: boolean) => {
    if (selected) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    }
  };

  const handleDeleteContact = (id: string) => {
    deleteMultipleContacts([id])
      .then(() => {
        toast({
          title: "Contact deleted",
          description: "The contact has been successfully deleted."
        });
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "There was an error deleting the contact.",
          variant: "destructive"
        });
      });
  };

  if (queryLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-48 bg-muted rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (contactsData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No contacts found</p>
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
      
      {contactsData.length === 0 && searchQuery ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No contacts found matching "{searchQuery}"</p>
          <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
        </div>
      ) : (
        <div>
          <div className="mb-2 flex items-center">
            <Checkbox 
              checked={selectedContacts.length === contactsData.length && contactsData.length > 0} 
              onCheckedChange={toggleSelectAll} 
              aria-label="Select all contacts"
              className="mr-2"
            />
            <span className="text-sm text-muted-foreground">
              {selectedContacts.length > 0 
                ? `Selected ${selectedContacts.length} of ${contactsData.length}` 
                : `${contactsData.length} contacts`
              }
            </span>
          </div>
          
          
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {contactsData.map((contact) => (
                <div key={contact.id} className="h-[220px]">
                  <ContactCard
                    contact={contact}
                    onEdit={onEdit}
                    onDelete={handleDeleteContact}
                    onSelect={toggleSelectContact}
                    isSelected={selectedContacts.includes(contact.id)}
                  />
                </div>
              ))}
            </div>
          
        </div>
      )}
    </div>
  );
};

export default ContactList;
