import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Star, Shield, Heart, Trophy, Plus, Mail, Phone, Building, Tag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { supabase } from '@/integrations/supabase/client';
// Load Nomin8 groups from settings
import { settingsService, nmn8Service, type GroupConfig } from '@/services/nmn8Service';
import { useUser } from '@/contexts/UserContext';


const Nomin8TrackConfig: React.FC = () => {
  const navigate = useNavigate();
  const { contactId } = useParams<{ contactId: string }>();
  const { currentUser } = useUser();
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [classification, setClassification] = useState<Nomin8Classification>('Supporter');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [notes, setNotes] = useState('');
  const [groups, setGroups] = useState<GroupConfig[]>([]);

  useEffect(() => {
    const loadContact = async () => {
      if (!contactId) return;
      
      try {
        setLoading(true);
        // Get contact from REL8
        const contacts = await getContacts();
        const foundContact = contacts.find(c => c.id === contactId);
        
        if (foundContact) {
          setContact(foundContact);
          if (foundContact.notes) {
            setNotes(foundContact.notes);
          }
        } else {
          throw new Error('Contact not found');
        }
      } catch (error) {
        console.error('Failed to load contact:', error);
        toast({
          title: "Error",
          description: "Failed to load contact details.",
          variant: "destructive"
        });
        navigate('/nmn8');
      } finally {
        setLoading(false);
      }
  };

  loadContact();
  }, [contactId, navigate]);

  // Load Nomin8 groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await settingsService.getGroups();
        setGroups(data);
      } catch (err) {
        console.error('Failed to load Nomin8 groups:', err);
      }
    };
    fetchGroups();
  }, [currentUser?.id]);

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

  const handleCreateProfile = async () => {
    if (!contact || !selectedGroup) {
      toast({
        title: "Missing Information",
        description: "Please select a group.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Promoting Contact",
        description: `Promoting ${contact.name} to member...`,
      });

      // Call edge function to promote contact to member
      const { data, error } = await supabase.functions.invoke('promote-to-member', {
        body: {
          contactId: contact.id,
          classification,
          notes
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Member Created Successfully",
        description: `${contact.name} has been promoted to member with ${classification} classification.`,
      });

      // Also add to selected Nomin8 group via nominations
      if (currentUser?.id) {
        await nmn8Service.nominateContact(currentUser.id, contact.id, { [selectedGroup]: true }, notes);
        toast({
          title: "Added to Group",
          description: `${contact.name} was added to ${groups.find(g => g.id === selectedGroup)?.name || 'selected group'}.`
        });
      } else {
        console.warn('No authenticated user to assign nomination');
      }

      // Navigate back to dashboard
      navigate('/nmn8');
    } catch (error) {
      console.error('Failed to promote contact:', error);
      toast({
        title: "Error", 
        description: "Failed to promote contact to member.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
          <Nomin8Navigation />
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading contact details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
          <Nomin8Navigation />
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Contact Not Found</h2>
            <p className="text-muted-foreground mb-4">The contact you're looking for could not be found.</p>
            <Button onClick={() => navigate('/nmn8')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Contact Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const ClassificationIcon = getClassificationIcon(classification);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
        <Nomin8Navigation />
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promote Contact to Member</h1>
          <p className="text-muted-foreground mt-1">
            Configure the Nomin8 profile for {contact.name}
          </p>
        </div>

        <div className="w-full space-y-8">
          {/* Contact Preview - Compact */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar userId={contact.name} size={64} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                  <div className="space-y-1">
                    {contact.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-3 h-3 mr-1.5" />
                        {contact.email}
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-3 h-3 mr-1.5" />
                        {contact.phone}
                      </div>
                    )}
                    {contact.organization && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="w-3 h-3 mr-1.5" />
                        {contact.organization}
                      </div>
                    )}
                  </div>
                  
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {contact.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`w-3 h-3 rounded-full bg-green-500`} 
                     title="REL8 contact" />
              </div>
            </CardContent>
          </Card>

          {/* A10D Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClassificationIcon className="w-5 h-5" />
                Nomin8 Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Classification Selection with Create New */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Classification Level</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="w-3 h-3 mr-1" />
                    New Classification
                  </Button>
                </div>
                <div className="grid gap-3">
                  {[
                  { value: 'Supporter' as Nomin8Classification, icon: Heart, label: 'Supporter' },
                  { value: 'Volunteer' as Nomin8Classification, icon: Users, label: 'Volunteer' },
                  { value: 'Moderator' as Nomin8Classification, icon: Shield, label: 'Moderator' },
                  { value: 'Ambassador' as Nomin8Classification, icon: Star, label: 'Ambassador' }
                  ].map((option) => {
                    const Icon = option.icon;
                    const isSelected = classification === option.value;
                    return (
                      <div
                        key={option.value}
                        onClick={() => setClassification(option.value)}
                        className={`
                          w-full p-4 rounded-lg border cursor-pointer transition-all duration-200
                          backdrop-blur-sm bg-background/50 hover:bg-background/70
                          ${isSelected 
                            ? 'border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20' 
                            : 'border-border/50 hover:border-border'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-muted-foreground'}`} />
                          <span className={`font-medium ${isSelected ? 'text-cyan-300' : 'text-foreground'}`}>
                            {option.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* A10D Group Selection with Create New */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Assign to Nomin8 Group</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="w-3 h-3 mr-1" />
                    New Group
                  </Button>
                </div>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Nomin8 group for tracking" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                          {group.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Notes */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Nomin8 Profile Notes</Label>
                <Textarea
                  placeholder="Add any additional notes for this Nomin8 profile..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleCreateProfile}
                className="w-full"
                disabled={!selectedGroup}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Member Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Nomin8TrackConfig;