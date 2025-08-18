import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Users, BarChart3, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import A10DProfileCard from '@/components/a10d/A10DProfileCard';
import A10DAddProfileDialog from '@/components/a10d/A10DAddProfileDialog';
import { A10DNavigation } from '@/components/a10d/A10DNavigation';
import { A10DProfile, A10DClassification } from '@/types/a10d';

// Mock data for development
const mockProfiles: A10DProfile[] = [
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
    classification: 'Ambassador',
    communityEngagement: 88,
    eventsAttended: 15,
    interests: ['Event Planning', 'Community Outreach', 'Non-Profit'],
    joinDate: '2024-02-01',
    lastActive: '2024-03-08',
    notes: 'Reliable ambassador, great with logistics',
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
    classification: 'Ambassador',
    communityEngagement: 92,
    eventsAttended: 18,
    interests: ['Content Moderation', 'Community Guidelines', 'Digital Safety'],
    joinDate: '2023-11-20',
    lastActive: '2024-03-09',
    notes: 'Excellent ambassador, handles conflicts well',
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
    classification: 'Ambassador',
    communityEngagement: 85,
    eventsAttended: 10,
    interests: ['Tech Trends', 'Startups', 'Innovation'],
    joinDate: '2024-02-20',
    lastActive: '2024-03-05',
    notes: 'Tech-savvy ambassador, great networker',
    socialMedia: {
      linkedin: 'david-kim-tech'
    }
  },
  {
    id: '5',
    contactId: 'contact-5',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    location: 'New York, NY',
    classification: 'Ambassador',
    communityEngagement: 92,
    eventsAttended: 18,
    interests: ['Women in Tech', 'Diversity & Inclusion', 'Mentorship'],
    joinDate: '2023-09-10',
    lastActive: '2024-03-11',
    notes: 'Champion for diversity, excellent mentor',
    socialMedia: {
      twitter: '@priya_tech',
      linkedin: 'priya-patel-tech'
    }
  },
  {
    id: '6',
    contactId: 'contact-6',
    name: 'James Wilson',
    email: 'james.w@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    location: 'Remote',
    classification: 'Ambassador',
    communityEngagement: 78,
    eventsAttended: 12,
    interests: ['Event Photography', 'Content Creation', 'Social Media'],
    joinDate: '2024-01-08',
    lastActive: '2024-03-07',
    notes: 'Talented photographer, helps with event coverage',
    socialMedia: {
      instagram: '@jameswilson_photo',
      linkedin: 'james-wilson-creative'
    }
  },
  {
    id: '7',
    contactId: 'contact-7',
    name: 'Alex Thompson',
    email: 'alex.t@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    location: 'Chicago, IL',
    classification: 'Volunteer',
    communityEngagement: 67,
    eventsAttended: 6,
    interests: ['Event Photography', 'Content Creation', 'Social Media'],
    joinDate: '2024-01-08',
    lastActive: '2024-03-07',
    notes: 'Talented photographer, helps with event coverage',
    socialMedia: {
      instagram: '@alexthompson_photo',
      linkedin: 'alex-thompson-creative'
    }
  },
  {
    id: '8',
    contactId: 'contact-8',
    name: 'Maria Garcia',
    email: 'maria.g@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    location: 'Los Angeles, CA',
    classification: 'Moderator',
    communityEngagement: 82,
    eventsAttended: 9,
    interests: ['Content Moderation', 'Community Guidelines', 'Digital Safety'],
    joinDate: '2023-12-15',
    lastActive: '2024-03-09',
    notes: 'Excellent moderator, handles conflicts well',
    socialMedia: {
      twitter: '@maria_g',
      linkedin: 'maria-garcia-community'
    }
  },
  {
    id: '9',
    contactId: 'contact-9',
    name: 'Chris Johnson',
    email: 'chris.j@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    location: 'Boston, MA',
    classification: 'Supporter',
    communityEngagement: 45,
    eventsAttended: 3,
    interests: ['Tech Trends', 'Startups', 'Innovation'],
    joinDate: '2024-02-20',
    lastActive: '2024-03-05',
    notes: 'New to community, showing interest',
    socialMedia: {
      linkedin: 'chris-johnson-tech'
    }
  }
];

const A10DDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profiles] = useState<A10DProfile[]>(mockProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Filter profiles based on search and classification
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           profile.interests.some(interest => 
                             interest.toLowerCase().includes(searchQuery.toLowerCase())
                           );
      
      const matchesClassification = selectedClassification === 'all' || 
                                   profile.classification === selectedClassification;
      
      return matchesSearch && matchesClassification;
    });
  }, [profiles, searchQuery, selectedClassification]);

  // Group profiles by classification
  const profilesByClassification = useMemo(() => {
    const groups = filteredProfiles.reduce((acc, profile) => {
      const classification = profile.classification;
      if (!acc[classification]) {
        acc[classification] = [];
      }
      acc[classification].push(profile);
      return acc;
    }, {} as Record<A10DClassification, A10DProfile[]>);

    return groups;
  }, [filteredProfiles]);

  // Statistics
  const stats = useMemo(() => {
    const totalProfiles = profiles.length;
    const avgEngagement = profiles.reduce((sum, p) => sum + p.communityEngagement, 0) / totalProfiles;
    const totalEvents = profiles.reduce((sum, p) => sum + p.eventsAttended, 0);
    const activeThisMonth = profiles.filter(p => {
      const lastActive = new Date(p.lastActive);
      const thisMonth = new Date();
      thisMonth.setDate(1);
      return lastActive >= thisMonth;
    }).length;

    return {
      totalProfiles,
      avgEngagement: Math.round(avgEngagement),
      totalEvents,
      activeThisMonth
    };
  }, [profiles]);

  const getClassificationColor = (classification: A10DClassification) => {
    switch (classification) {
      case 'Ambassador':
        return 'from-primary to-primary/80';
      case 'Volunteer':
        return 'from-green-500 to-green-600';
      case 'Moderator':
        return 'from-blue-500 to-blue-600';
      case 'Supporter':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-muted to-muted/80';
    }
  };

  const getClassificationIcon = (classification: A10DClassification) => {
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
        {/* Navigation */}
        <A10DNavigation />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">A10D Community Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Track and classify your community members by engagement level
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Profile
          </Button>
        </div>


        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search profiles, emails, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedClassification} onValueChange={setSelectedClassification}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by role" />
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

        {/* Team Groups */}
        <div className="space-y-8">
          {Object.entries(profilesByClassification).map(([classification, groupProfiles]) => {
            const Icon = getClassificationIcon(classification as A10DClassification);
            const colorClass = getClassificationColor(classification as A10DClassification);
            
            return (
              <div key={classification} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">{classification}s</h2>
                  <Badge variant="secondary" className="ml-2">
                    {groupProfiles.length}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {groupProfiles.map((profile) => (
                    <A10DProfileCard 
                      key={profile.id} 
                      profile={profile}
                      onClick={() => navigate(`/a10d/profile/${profile.id}`)}
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
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      <A10DAddProfileDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};

export default A10DDashboard;