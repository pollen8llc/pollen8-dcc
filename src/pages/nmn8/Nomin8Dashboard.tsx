import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Users, Plus, Star, Shield, Heart, Trophy, Mail, Phone, Building, Tag, Loader2, Trash2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { Nomin8Navigation } from '@/components/nomin8/Nomin8Navigation';
import { Nomin8Classification } from '@/types/nomin8';
import { toast } from '@/hooks/use-toast';
import { getContacts, Contact } from '@/services/rel8t/contactService';
import { useUser } from '@/contexts/UserContext';
import { nmn8Service, defaultGroups, type Nomination, type GroupConfig } from '@/services/nmn8Service';

const Nomin8Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [nominations, setNominations] = useState<Nomination[]>([]);
  const [groups, setGroups] = useState<GroupConfig[]>(defaultGroups);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('nominate');

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [contacts, searchQuery]);

  // Group nominations by group type
  const nominationsByGroup = useMemo(() => {
    const grouped: Record<string, Nomination[]> = {};
    
    groups.forEach(group => {
      grouped[group.id] = nominations.filter(nomination => {
        if (!nomination.groups || typeof nomination.groups !== 'object') {
          return false;
        }
        return nomination.groups[group.id] === true;
      });
    });
    return grouped;
  }, [nominations, groups]);

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
  // Load contacts and nominations
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        const [contactData, nominationData] = await Promise.all([
          getContacts(),
          nmn8Service.getNominations(currentUser.id)
        ]);
        setContacts(contactData);
        setNominations(nominationData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: "Error",
          description: "Failed to load data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser?.id]);

  const handleContactNominate = async (contact: Contact) => {
    try {
      toast({
        title: "Nominating Contact",
        description: `Nominating ${contact.name}...`,
      });
      
      // Navigate to contact selection for nomination
      navigate('/rel8/contacts', { state: { targetContact: contact.id } });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to nominate contact.",
        variant: "destructive"
      });
    }
  };

  const handleContactClick = (contactId: string) => {
    navigate(`/elavu8/${contactId}`);
  };

  const handleRemoveFromGroup = async (nominationId: string, groupId: string) => {
    if (!currentUser?.id) return;

    try {
      await nmn8Service.removeFromGroup(nominationId, groupId);
      
      // Refresh nominations after successful removal
      const data = await nmn8Service.getNominations(currentUser.id);
      setNominations(data);
    } catch (error) {
      console.error('Failed to remove contact from group:', error);
    }
  };

  const handleAddToGroup = (groupId: string) => {
    navigate('/rel8/contacts', { state: { targetGroup: groupId } });
  };

  const renderGroupSection = (group: GroupConfig) => {
    const groupNominations = nominationsByGroup[group.id] || [];
    const remainingSlots = group.maxMembers ? Math.max(0, group.maxMembers - groupNominations.length) : 3;

    return (
      <Card key={group.id} className="bg-card/40 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${group.color}`}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {groupNominations.length}{group.maxMembers ? `/${group.maxMembers}` : ''}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Existing contacts */}
            {groupNominations.map((nomination) => (
              <div key={nomination.id} className="group relative">
                <div
                  className="flex flex-col items-center p-3 rounded-xl bg-muted/20 border border-border 
                           hover:bg-muted/40 transition-all duration-200 cursor-pointer"
                  onClick={() => handleContactClick(nomination.contact?.id || '')}
                >
                  <Avatar className="w-12 h-12 mb-2 border-2 border-primary/20">
                    <AvatarImage src={nomination.contact?.avatar} alt={nomination.contact?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-xs font-bold">
                      {nomination.contact ? getInitials(nomination.contact.name) : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-center line-clamp-2">
                    {nomination.contact?.name || 'Unknown'}
                  </span>
                  {nomination.contact?.organization && (
                    <span className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {nomination.contact.organization}
                    </span>
                  )}
                </div>
                
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromGroup(nomination.id, group.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: remainingSlots }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex flex-col items-center p-3 rounded-xl border-2 border-dashed border-border/50 
                         hover:border-primary/50 hover:bg-muted/20 transition-all duration-200 cursor-pointer"
                onClick={() => handleAddToGroup(group.id)}
              >
                <div className="w-12 h-12 mb-2 rounded-full bg-muted/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground text-center">
                  Add Contact
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <Nomin8Navigation />
        
        {/* Header */}
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nomin8 Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Nominate contacts and manage your A10D groups
            </p>
            {nominations.length > 0 && (
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="text-sm">
                  {nominations.length} Total Nominations
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {groups.map(group => {
                    const count = nominationsByGroup[group.id]?.length || 0;
                    return count > 0 ? (
                      <span key={group.id}>
                        {group.name}: {count}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nominate">Nominate Contacts</TabsTrigger>
            <TabsTrigger value="manage">Manage Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="nominate" className="space-y-6">
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
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Loading State */}
            {loading && (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="bg-card/40 backdrop-blur-md border border-border/50">
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <Skeleton key={j} className="h-24 rounded-xl" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Group Sections */}
            {!loading && (
              <div className="space-y-6">
                {groups.map(renderGroupSection)}
              </div>
            )}

            {/* No nominations message */}
            {!loading && nominations.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground">No nominations yet</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  Start by nominating contacts from your REL8 database
                </p>
                <Button onClick={() => setActiveTab('nominate')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Start Nominating
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Nomin8Dashboard;