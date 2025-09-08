import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Settings, Search, Edit2, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Nomin8Navigation } from '@/components/nomin8/Nomin8Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface NominatedContact {
  id: string;
  organizer_id: string;
  contact_id: string;
  groups: Record<string, boolean>;
  created_at: string;
  updated_at: string;
  contact?: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    organization?: string;
  };
}

interface GroupConfig {
  id: string;
  name: string;
  color: string;
  maxMembers?: number;
  description?: string;
}

const defaultGroups: GroupConfig[] = [
  { id: 'ambassador', name: 'Ambassadors', color: 'bg-primary text-primary-foreground', maxMembers: 5, description: 'Community leaders and advocates' },
  { id: 'moderator', name: 'Moderators', color: 'bg-blue-500 text-white', maxMembers: 3, description: 'Content and community moderators' },
  { id: 'evangelist', name: 'Evangelists', color: 'bg-green-500 text-white', maxMembers: 8, description: 'Active promoters and supporters' },
  { id: 'mentor', name: 'Mentors', color: 'bg-purple-500 text-white', maxMembers: 6, description: 'Experienced guidance providers' },
];

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
    const loadNominations = async () => {
      if (!currentUser?.id) return;

      try {
        setLoading(true);
        const { data, error } = await (supabase as any)
          .from('nmn8')
          .select(`
            *,
            contact:rms_contacts(
              id,
              name,
              email,
              avatar_url,
              organization
            )
          `)
          .eq('organizer_id', currentUser.id);

        if (error) throw error;
        setNominations(data as NominatedContact[] || []);
      } catch (error) {
        console.error('Failed to load nominations:', error);
        toast({
          title: "Error",
          description: "Failed to load nominated contacts.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadNominations();
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
      nomination.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nomination.contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nomination.contact.organization?.toLowerCase().includes(searchQuery.toLowerCase())
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
    navigate('/nmn8', { state: { targetGroup: groupId } });
  };

  const handleRemoveFromGroup = async (nominationId: string, groupId: string) => {
    try {
      const nomination = nominations.find(n => n.id === nominationId);
      if (!nomination) return;

      const updatedGroups = { ...nomination.groups };
      updatedGroups[groupId] = false;

      const { error } = await (supabase as any)
        .from('nmn8')
        .update({ groups: updatedGroups })
        .eq('id', nominationId);

      if (error) throw error;

      // Update local state
      setNominations(prev => 
        prev.map(n => 
          n.id === nominationId 
            ? { ...n, groups: updatedGroups }
            : n
        )
      );

      toast({
        title: "Success",
        description: "Contact removed from group.",
      });
    } catch (error) {
      console.error('Failed to update group membership:', error);
      toast({
        title: "Error",
        description: "Failed to remove contact from group.",
        variant: "destructive"
      });
    }
  };

  const renderGroupSection = (group: GroupConfig) => {
    const groupNominations = nominationsByGroup[group.id] || [];
    const remainingSlots = group.maxMembers ? Math.max(0, group.maxMembers - groupNominations.length) : 3;

    return (
      <Card key={group.id} className="glassmorphic-card">
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
                  className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10 
                           hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  onClick={() => handleContactClick(nomination.contact.id)}
                >
                  <Avatar className="w-12 h-12 mb-2 border-2 border-white/20">
                    <AvatarImage src={nomination.contact.avatar_url} alt={nomination.contact.name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-xs font-bold">
                      {getInitials(nomination.contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-center line-clamp-2">
                    {nomination.contact.name}
                  </span>
                  {nomination.contact.organization && (
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
                className="flex flex-col items-center p-3 rounded-xl border-2 border-dashed border-white/20 
                         hover:border-primary/50 hover:bg-white/5 transition-all duration-200 cursor-pointer"
                onClick={() => handleAddToGroup(group.id)}
              >
                <div className="w-12 h-12 mb-2 rounded-full bg-white/10 flex items-center justify-center">
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
              <Card key={i} className="glassmorphic-card">
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
        <div className="flex items-center justify-between">
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
            <Button onClick={() => navigate('/nmn8')}>
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
            <Button onClick={() => navigate('/nmn8')}>
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
