import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, Plus, Star, Shield, Heart, Trophy } from 'lucide-react';
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
import { A10DNavigation } from '@/components/a10d/A10DNavigation';
import { A10DClassification } from '@/types/a10d';
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

const A10DTrack: React.FC = () => {
  const navigate = useNavigate();
  const [contacts] = useState(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [classification, setClassification] = useState<A10DClassification>('Supporter');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'select' | 'promote'>('select');

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

  const getClassificationIcon = (classification: A10DClassification) => {
    switch (classification) {
      case 'Ambassador': return Star;
      case 'Volunteer': return Users;
      case 'Moderator': return Shield;
      case 'Supporter': return Heart;
      default: return Trophy;
    }
  };

  const handleContactSelect = (contact: any) => {
    setSelectedContact(contact);
    setStep('promote');
    // Pre-populate notes with existing contact notes
    if (contact.notes) {
      setNotes(contact.notes);
    }
  };

  const handlePromoteContact = () => {
    if (!selectedContact || !selectedGroup) {
      toast({
        title: "Missing Information",
        description: "Please select a contact and A10D group.",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally make an API call to create the A10D profile
    toast({
      title: "Profile Created Successfully",
      description: `${selectedContact.name} has been promoted to ${classification} and added to the A10D system.`,
    });

    // Navigate back to A10D dashboard
    navigate('/a10d');
  };

  if (step === 'promote' && selectedContact) {
    const ClassificationIcon = getClassificationIcon(classification);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        
        <div className="container mx-auto px-4 py-6 space-y-8">
          <A10DNavigation />
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setStep('select')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Selection
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Promote Contact to A10D</h1>
              <p className="text-muted-foreground mt-1">
                Configure the A10D profile for {selectedContact.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedContact.name}`} />
                    <AvatarFallback>{getInitials(selectedContact.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedContact.name}</h3>
                    <p className="text-muted-foreground">{selectedContact.email}</p>
                    {selectedContact.organization && (
                      <p className="text-sm text-muted-foreground">{selectedContact.organization}</p>
                    )}
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getConnectionStrengthColor(selectedContact.connectionStrength)}`} 
                       title={`${selectedContact.connectionStrength} connection`} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedContact.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedContact.notes && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Existing Notes</Label>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {selectedContact.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* A10D Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClassificationIcon className="w-5 h-5" />
                  A10D Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Classification Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Classification Level</Label>
                  <RadioGroup value={classification} onValueChange={(value) => setClassification(value as A10DClassification)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Supporter" id="supporter" />
                      <Label htmlFor="supporter" className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Supporter
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Volunteer" id="volunteer" />
                      <Label htmlFor="volunteer" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Volunteer
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Moderator" id="moderator" />
                      <Label htmlFor="moderator" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Moderator
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ambassador" id="ambassador" />
                      <Label htmlFor="ambassador" className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Ambassador
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* A10D Group Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Assign to A10D Group</Label>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an A10D group for tracking" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockA10DGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${group.color}-500`} />
                            {group.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Notes */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">A10D Profile Notes</Label>
                  <Textarea
                    placeholder="Add any additional notes for this A10D profile..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handlePromoteContact}
                  className="w-full"
                  disabled={!selectedGroup}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create A10D Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <A10DNavigation />
        
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
            <Card 
              key={contact.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handleContactSelect(contact)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{contact.name}</h3>
                      <div 
                        className={`w-2 h-2 rounded-full ${getConnectionStrengthColor(contact.connectionStrength)}`}
                        title={`${contact.connectionStrength} connection`}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-2">{contact.email}</p>
                    {contact.organization && (
                      <p className="text-xs text-muted-foreground truncate mb-3">{contact.organization}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {contact.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{contact.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Last contact: {new Date(contact.lastContact).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

export default A10DTrack;