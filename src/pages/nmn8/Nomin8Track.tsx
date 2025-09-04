import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Users, BarChart3, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Nomin8ProfileCard from '@/components/nomin8/Nomin8ProfileCard';
import Nomin8AddProfileDialog from '@/components/nomin8/Nomin8AddProfileDialog';
import { Nomin8Navigation } from '@/components/nomin8/Nomin8Navigation';
import { Nomin8Profile, Nomin8Classification, Nomin8Metrics } from '@/types/nomin8';

// Mock data for development
const mockProfiles: Nomin8Profile[] = [
  {
    id: '1',
    contactId: 'contact-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    location: 'San Francisco, CA',
    classification: 'Ambassador',
    communityEngagement: 95,
    eventsAttended: 12,
    interests: ['Tech Leadership', 'AI/ML', 'Community Building'],
    joinDate: '2024-01-15',
    lastActive: '2024-03-10',
    notes: 'Highly engaged community leader, excellent speaker',
    socialMedia: {
      twitter: '@sarahchen',
      linkedin: 'sarah-chen-tech'
    }
  },
  {
    id: '2',
    contactId: 'contact-2',
    name: 'Marcus Rodriguez',
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    location: 'Austin, TX',
    classification: 'Volunteer',
    communityEngagement: 88,
    eventsAttended: 15,
    interests: ['Event Planning', 'Community Outreach', 'Non-Profit'],
    joinDate: '2024-02-01',
    lastActive: '2024-03-08',
    notes: 'Reliable volunteer, great with logistics',
    socialMedia: {
      linkedin: 'marcus-rodriguez'
    }
  },
  {
    id: '3',
    contactId: 'contact-3',
    name: 'Elena Vasquez',
    email: 'elena.v@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    location: 'Miami, FL',
    classification: 'Moderator',
    communityEngagement: 92,
    eventsAttended: 18,
    interests: ['Content Moderation', 'Community Guidelines', 'Digital Safety'],
    joinDate: '2023-11-20',
    lastActive: '2024-03-09',
    notes: 'Excellent moderator, handles conflicts well',
    socialMedia: {
      twitter: '@elena_v',
      linkedin: 'elena-vasquez-community'
    }
  },
  {
    id: '4',
    contactId: 'contact-4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    location: 'Seattle, WA',
    classification: 'Supporter',
    communityEngagement: 85,
    eventsAttended: 10,
    interests: ['Tech Trends', 'Startups', 'Innovation'],
    joinDate: '2024-02-20',
    lastActive: '2024-03-05',
    notes: 'Tech-savvy supporter, great networker',
    socialMedia: {
      linkedin: 'david-kim-tech'
    }
  }
];

const Nomin8Track: React.FC = () => {
  const [profiles, setProfiles] = useState<Nomin8Profile[]>(mockProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<Nomin8Classification | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          profile.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClassification = selectedClassification === 'all' || 
                                   profile.classification === selectedClassification;
      return matchesSearch && matchesClassification;
    });
  }, [profiles, searchQuery, selectedClassification]);

  // Group profiles by classification
  const profilesByClassification = useMemo(() => {
    const groups: Record<Nomin8Classification, Nomin8Profile[]> = {
      Ambassador: [],
      Volunteer: [],
      Moderator: [],
      Supporter: []
    };

    filteredProfiles.forEach(profile => {
      groups[profile.classification].push(profile);
    });

    return groups;
  }, [filteredProfiles]);

  // Calculate stats
  const stats: Nomin8Metrics = useMemo(() => {
    const totalProfiles = profiles.length;
    const averageEngagement = profiles.reduce((sum, p) => sum + p.communityEngagement, 0) / totalProfiles || 0;
    const totalEvents = profiles.reduce((sum, p) => sum + p.eventsAttended, 0);
    const activeThisMonth = profiles.filter(p => {
      const lastActive = new Date(p.lastActive);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return lastActive > monthAgo;
    }).length;

    const classificationBreakdown: Record<Nomin8Classification, number> = {
      Ambassador: profiles.filter(p => p.classification === 'Ambassador').length,
      Volunteer: profiles.filter(p => p.classification === 'Volunteer').length,
      Moderator: profiles.filter(p => p.classification === 'Moderator').length,
      Supporter: profiles.filter(p => p.classification === 'Supporter').length,
    };

    return {
      totalProfiles,
      averageEngagement,
      totalEvents,
      activeThisMonth,
      classificationBreakdown
    };
  }, [profiles]);

  const getClassificationColor = (classification: Nomin8Classification) => {
    switch (classification) {
      case 'Ambassador':
        return 'bg-primary/80 text-primary-foreground border-primary/40';
      case 'Volunteer':
        return 'bg-green-500/80 text-white border-green-500/40';
      case 'Moderator':
        return 'bg-blue-500/80 text-white border-blue-500/40';
      case 'Supporter':
        return 'bg-orange-500/80 text-white border-orange-500/40';
      default:
        return 'bg-muted/80 text-muted-foreground border-muted/40';
    }
  };

  const getClassificationIcon = (classification: Nomin8Classification) => {
    switch (classification) {
      case 'Ambassador':
        return Star;
      case 'Volunteer':
        return Users;
      case 'Moderator':
        return Filter;
      case 'Supporter':
        return BarChart3;
      default:
        return Users;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        <Nomin8Navigation />
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Track New A10D Profile</h1>
            <p className="text-muted-foreground mt-1">
              Track community member engagement and classifications
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Create Profile
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-48">
            <Select value={selectedClassification} onValueChange={(value: Nomin8Classification | 'all') => setSelectedClassification(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                <SelectItem value="Ambassador">Ambassador</SelectItem>
                <SelectItem value="Volunteer">Volunteer</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
                <SelectItem value="Supporter">Supporter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Profiles by Classification */}
        <div className="space-y-8">
          {Object.entries(profilesByClassification).map(([classification, classificationProfiles]) => {
            if (classificationProfiles.length === 0) return null;
            
            const Icon = getClassificationIcon(classification as Nomin8Classification);
            
            return (
              <div key={classification} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-primary/80">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">{classification}s</h2>
                  <Badge variant="secondary" className="ml-2">
                    {classificationProfiles.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {classificationProfiles.map((profile) => (
                    <Nomin8ProfileCard 
                      key={profile.id} 
                      profile={profile}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No profiles found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
          </div>
        )}

        <Nomin8AddProfileDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog} 
        />
      </div>
    </div>
  );
};

export default Nomin8Track;