import React, { useEffect, useState } from 'react';
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Contact, getContacts, deleteMultipleContacts } from '@/services/rel8t/contactService';
import ContactCard from './ContactCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCcw, Search, Trash2 } from "lucide-react";

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
  if (isLoading) {
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

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No contacts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center">
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
      </div>
      
      {contacts.length === 0 && searchQuery ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No contacts found</p>
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
          
          
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {contacts.map((contact) => (
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
