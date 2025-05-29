
import React from 'react';
import { Contact } from '@/services/rel8t/contactService';
import ContactCard from './ContactCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContactListProps {
  contacts: Contact[];
  isLoading?: boolean;
  onContactSelect?: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ 
  contacts, 
  isLoading = false,
  onContactSelect 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-24 bg-muted rounded-lg"></div>
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
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-4 pr-4">
        {contacts.map((contact) => (
          <ContactCard 
            key={contact.id} 
            contact={contact}
            onClick={() => onContactSelect?.(contact)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ContactList;
