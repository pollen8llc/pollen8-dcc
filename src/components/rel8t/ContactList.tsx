
import React from 'react';
import { Contact } from '@/services/rel8t/contactService';
import ContactCard from './ContactCard';
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
    <div className="max-h-[500px] overflow-y-auto pr-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1">
        {contacts.map((contact) => (
          <ContactCard 
            key={contact.id} 
            contact={contact}
            onEdit={onEdit}
            onSelect={onContactMultiSelect}
            isSelected={selectedContacts.includes(contact.id)}
            isSelectionMode={isSelectionMode}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactList;
