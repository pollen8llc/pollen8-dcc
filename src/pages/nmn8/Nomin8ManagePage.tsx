import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Users, Search, UserPlus, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Nomin8Navigation } from '@/components/nomin8/Nomin8Navigation';
import { useUser } from '@/contexts/UserContext';
import { nmn8Service, defaultGroups, type Nomination, type GroupConfig } from '@/services/nmn8Service';

// Use the service types
type NominatedContact = Nomination;

const Nomin8ManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [nominations, setNominations] = useState<NominatedContact[]>([]);
  const [groups, setGroups] = useState<GroupConfig[]>(defaultGroups);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);

  // Load nominated contacts for current organizer
  useEffect(() => {
    const fetchNominations = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        const data = await nmn8Service.getNominations(currentUser.id);
        setNominations(data);
      } catch (error) {
        console.error('Failed to load nominations:', error);
        // Error handling is done in the service
      } finally {
        setLoading(false);
      }
    };

    fetchNominations();
  }, [currentUser?.id]);

  // Group nominations by group type
  const nominationsByGroup = useMemo(() => {
    const grouped: Record<string, NominatedContact[]> = {};
    
    groups.forEach(group => {
      grouped[group.id] = nominations.filter(nomination => 
        nomination.groups[group.id] === true
      );
    });

    return grouped;
  }, [nominations, groups]);

  // Filter nominations by search
  const filteredNominations = useMemo(() => {
    if (!searchQuery) return nominations;
    
    return nominations.filter(nomination =>
      nomination.contact?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nomination.contact?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nomination.contact?.organization?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [nominations, searchQuery]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleContactClick = (contactId: string) => {
    navigate(`/elavu8/${contactId}`);
  };

  const handleAddToGroup = (groupId: string) => {
    // Navigate to contact selection for this group
    navigate('/rel8/contacts', { state: { targetGroup: groupId } });
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
      // Error handling is done in the service
    }
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
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingGroup(group.id)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Existing contacts */}
            {groupNominations.map((nomination) => (
              <div
                key={nomination.id}
                className="group relative"
              >
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
                
                {/* Remove button */}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-6 space-y-8">
          <Nomin8Navigation />
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <Nomin8Navigation />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Nominations</h1>
            <p className="text-muted-foreground mt-1">
              Organize your nominated contacts into flexible groups
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => navigate('/rel8/contacts')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Nominate More
            </Button>
          </div>
        </div>

        {/* Group Sections */}
        <div className="space-y-6">
          {groups.map(renderGroupSection)}
        </div>

        {/* No nominations message */}
        {nominations.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No nominations yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Start by nominating contacts from your REL8 database
            </p>
            <Button onClick={() => navigate('/rel8/contacts')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Nominate Contacts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nomin8ManagePage;
