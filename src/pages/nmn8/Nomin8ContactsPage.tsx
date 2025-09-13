import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, Plus, Star, Shield, Heart, Trophy, Mail, Phone, Building, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import { Nomin8Navigation } from '@/components/nomin8/Nomin8Navigation';
import { Nomin8Classification } from '@/types/nomin8';
import { toast } from '@/hooks/use-toast';
import { getContacts, Contact } from '@/services/rel8t/contactService';

const Nomin8ContactsPage: React.FC = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [contacts, searchQuery]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getClassificationIcon = (classification: Nomin8Classification) => {
    switch (classification) {
      case 'Ambassador': return Star;
      case 'Volunteer': return Users;
      case 'Moderator': return Shield;
      case 'Supporter': return Heart;
      default: return Trophy;
    }
  };
  
  // Load contacts from REL8
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const contactData = await getContacts();
        setContacts(contactData);
      } catch (error) {
        console.error('Failed to load contacts:', error);
        toast({
          title: "Error",
          description: "Failed to load contacts from REL8.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, []);

  const handleContactNominate = async (contact: Contact) => {
    // Create member promotion via edge function
    try {
      toast({
        title: "Promoting Contact",
        description: `Promoting ${contact.name} to member...`,
      });
      
      // Navigate to config page
      navigate(`/nmn8/manage/config/${contact.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to nominate contact.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <Nomin8Navigation />
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/nmn8')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Contacts</h1>
          <p className="text-muted-foreground mt-1">
            Select a contact from your REL8 database to promote to A10D tracking
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading contacts from REL8...</span>
            </div>
          </div>
        )}

        {/* Contacts Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
            <div 
              key={contact.id} 
              className="h-full overflow-hidden transition-all duration-300 cursor-pointer rounded-2xl backdrop-blur-md 
                bg-white/5 border border-white/10 shadow-lg hover:shadow-[#00eada]/10 hover:border-[#00eada]/20"
            >
              {/* Section 1: Header with name and organization */}
              <div className="p-4 pb-2 relative">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-medium mb-1 line-clamp-1 text-white">{contact.name}</h3>
                  <div 
                    className="w-3 h-3 rounded-full bg-green-500"
                    title="REL8 contact"
                  />
                </div>
                
                {contact.organization && (
                  <div className="flex items-center text-xs text-white/70">
                    <Building className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{contact.organization}</span>
                  </div>
                )}
              </div>
              
              {/* Section 2: Contact information */}
              <div className="px-4 py-2 border-t border-white/5 flex-grow">
                <div className="space-y-1.5">
                  {contact.email && (
                    <div className="flex items-center text-xs text-white/70">
                      <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  
                  {contact.phone && (
                    <div className="flex items-center text-xs text-white/70">
                      <Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Section 3: Tags and action button */}
              <div className="px-4 pt-2 pb-3 border-t border-white/5">
                {contact.tags && contact.tags.length > 0 && (
                  <div className="flex items-start text-xs mb-3">
                    <Tag className="h-3 w-3 mr-1.5 flex-shrink-0 mt-0.5 text-white/70" />
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#00eada]/20 text-[#00eada] px-1.5 py-0.5 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 2 && (
                        <span className="text-xs text-white/70">
                          +{contact.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-white/70">
                    Last contact: {contact.last_contact_date ? new Date(contact.last_contact_date).toLocaleDateString() : 'N/A'}
                  </div>
                  
                  <Button
                    size="sm"
                    className="h-7 px-3 bg-[#00eada] hover:bg-[#00eada]/80 text-black font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactNominate(contact);
                    }}
                  >
                    NOMINATE
                  </Button>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}

        {!loading && filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No contacts found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or add more contacts to REL8 first
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nomin8ContactsPage;