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
import { A10DNavigation } from '@/components/a10d/A10DNavigation';
import { A10DClassification } from '@/types/a10d';
import { toast } from '@/hooks/use-toast';

// Mock contact data (will be replaced with real contact service)
const mockContact = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  phone: '+1 (555) 123-4567',
  organization: 'Tech Innovators Inc',
  tags: ['tech', 'speaker', 'mentor'],
  notes: 'Active community member, speaks at events',
  lastContact: '2024-03-10',
  connectionStrength: 'strong'
};

// Mock A10D groups for assignment
const mockA10DGroups = [
  { id: '1', name: 'Core Community Leaders', color: 'primary' },
  { id: '2', name: 'Event Organizers', color: 'green' },
  { id: '3', name: 'Content Moderators', color: 'blue' },
  { id: '4', name: 'New Member Supporters', color: 'orange' },
  { id: '5', name: 'Tech Mentors', color: 'purple' }
];

const A10DTrackConfig: React.FC = () => {
  const navigate = useNavigate();
  const { contactId } = useParams<{ contactId: string }>();
  
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [classification, setClassification] = useState<A10DClassification>('Supporter');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Mock loading contact data (replace with actual API call)
    const loadContact = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setContact(mockContact);
        if (mockContact.notes) {
          setNotes(mockContact.notes);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load contact details.",
          variant: "destructive"
        });
        navigate('/a10d/track');
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, [contactId, navigate]);

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

  const handleCreateProfile = () => {
    if (!contact || !selectedGroup) {
      toast({
        title: "Missing Information",
        description: "Please select an A10D group.",
        variant: "destructive"
      });
      return;
    }

    // Here you would normally make an API call to create the A10D profile
    toast({
      title: "Profile Created Successfully",
      description: `${contact.name} has been promoted to ${classification} and added to the A10D system.`,
    });

    // Navigate back to A10D dashboard
    navigate('/a10d');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-6 space-y-8">
          <A10DNavigation />
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
        <div className="container mx-auto px-4 py-6 space-y-8">
          <A10DNavigation />
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Contact Not Found</h2>
            <p className="text-muted-foreground mb-4">The contact you're looking for could not be found.</p>
            <Button onClick={() => navigate('/a10d/track')}>
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
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <A10DNavigation />
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promote Contact to A10D</h1>
          <p className="text-muted-foreground mt-1">
            Configure the A10D profile for {contact.name}
          </p>
        </div>

        <div className="w-full space-y-8">
          {/* Contact Preview - Compact */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} />
                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
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
                <div className={`w-3 h-3 rounded-full ${getConnectionStrengthColor(contact.connectionStrength)}`} 
                     title={`${contact.connectionStrength} connection`} />
              </div>
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
                    { value: 'Supporter' as A10DClassification, icon: Heart, label: 'Supporter' },
                    { value: 'Volunteer' as A10DClassification, icon: Users, label: 'Volunteer' },
                    { value: 'Moderator' as A10DClassification, icon: Shield, label: 'Moderator' },
                    { value: 'Ambassador' as A10DClassification, icon: Star, label: 'Ambassador' }
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
                  <Label className="text-sm font-medium">Assign to A10D Group</Label>
                  <Button variant="outline" size="sm">
                    <Plus className="w-3 h-3 mr-1" />
                    New Group
                  </Button>
                </div>
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
                onClick={handleCreateProfile}
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
};

export default A10DTrackConfig;