
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { getContacts } from '@/services/rel8t/contactService';
import ContactList from '@/components/rel8t/ContactList';
import { Rel8OnlyNavigation } from '@/components/rel8t/Rel8OnlyNavigation';

const ContactListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => getContacts(),
  });

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.organization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (contact: any) => {
    navigate(`/rel8t/contacts/${contact.id}/edit`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-2xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">Manage your contact network</p>
          </div>
          
          <Button onClick={() => navigate('/rel8t/contacts/create')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ContactList
          contacts={filteredContacts}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
};

export default ContactListPage;
