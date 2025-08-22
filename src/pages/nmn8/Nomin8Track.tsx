import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, Plus, Star, Shield, Heart, Trophy, Mail, Phone, Building, Tag } from 'lucide-react';
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

// Mock contacts data from REL8
const mockContacts = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 123-4567',
    organization: 'Tech Innovators Inc',
    tags: ['tech', 'speaker', 'mentor'],
    notes: 'Active community member, speaks at events',
    lastContact: '2024-03-10',
    connectionStrength: 'strong'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus@example.com',
    phone: '+1 (555) 234-5678',
    organization: 'Community Builders LLC',
    tags: ['events', 'organizing', 'volunteer'],
    notes: 'Helps organize community events',
    lastContact: '2024-03-08',
    connectionStrength: 'medium'
  },
  {
    id: '3',
    name: 'Elena Vasquez',
    email: 'elena.v@example.com',
    phone: '+1 (555) 345-6789',
    organization: 'Digital Safety Corp',
    tags: ['moderation', 'safety', 'guidelines'],
    notes: 'Expert in community moderation',
    lastContact: '2024-03-09',
    connectionStrength: 'strong'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 456-7890',
    organization: 'StartupTech',
    tags: ['networking', 'startups', 'innovation'],
    notes: 'Great networker, connects people',
    lastContact: '2024-03-05',
    connectionStrength: 'medium'
  },
  {
    id: '5',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+1 (555) 567-8901',
    organization: 'Women in Tech Foundation',
    tags: ['diversity', 'mentorship', 'leadership'],
    notes: 'Champions diversity and inclusion',
    lastContact: '2024-03-11',
    connectionStrength: 'strong'
  },
  {
    id: '6',
    name: 'Chris Johnson',
    email: 'chris.j@example.com',
    phone: '+1 (555) 678-9012',
    organization: 'Innovation Labs',
    tags: ['new-member', 'interested', 'potential'],
    notes: 'New to community, showing interest',
    lastContact: '2024-03-05',
    connectionStrength: 'weak'
  }
];

// Mock A10D groups for assignment
const mockA10DGroups = [
  { id: '1', name: 'Core Community Leaders', color: 'primary' },
  { id: '2', name: 'Event Organizers', color: 'green' },
  { id: '3', name: 'Content Moderators', color: 'blue' },
  { id: '4', name: 'New Member Supporters', color: 'orange' },
  { id: '5', name: 'Tech Mentors', color: 'purple' }
];

const Nomin8Track: React.FC = () => {
  const navigate = useNavigate();
  const [contacts] = useState(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [contacts, searchQuery]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getConnectionStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'weak': return 'bg-red-500';
      default: return 'bg-muted';
    }
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

  const handleContactSelect = (contact: any) => {
    navigate(`/nmn8/track/config/${contact.id}`);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <Nomin8Navigation />
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Track New A10D Profile</h1>
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

        {/* Contacts Grid */}
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
                    className={`w-3 h-3 rounded-full ${getConnectionStrengthColor(contact.connectionStrength)}`}
                    title={`${contact.connectionStrength} connection`}
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
                    Last contact: {new Date(contact.lastContact).toLocaleDateString()}
                  </div>
                  
                  <Button
                    size="sm"
                    className="h-7 px-3 bg-[#00eada] hover:bg-[#00eada]/80 text-black font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactSelect(contact);
                    }}
                  >
                    Track
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
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

export default Nomin8Track;