import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import A10DAddProfileDialog from '@/components/a10d/A10DAddProfileDialog';
import A10DProfileCard from '@/components/a10d/A10DProfileCard';
import { A10DProfile } from '@/types/a10d';

// Mock data for development
const mockProfiles: A10DProfile[] = [
  {
    id: '1',
    contactId: 'contact-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
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
    classification: 'Volunteer',
    communityEngagement: 78,
    eventsAttended: 8,
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
    classification: 'Moderator',
    communityEngagement: 88,
    eventsAttended: 15,
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
    classification: 'Supporter',
    communityEngagement: 45,
    eventsAttended: 3,
    interests: ['Tech Trends', 'Startups', 'Innovation'],
    joinDate: '2024-02-20',
    lastActive: '2024-03-05',
    notes: 'New to community, showing interest',
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
    classification: 'Volunteer',
    communityEngagement: 67,
    eventsAttended: 6,
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
    email: 'alex.thompson@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    classification: 'Ambassador',
    communityEngagement: 89,
    eventsAttended: 22,
    interests: ['Open Source', 'Developer Advocacy', 'Technical Writing'],
    joinDate: '2023-06-15',
    lastActive: '2024-03-12',
    notes: 'Open source contributor, technical writer, great at onboarding new developers',
    socialMedia: {
      twitter: '@alex_dev',
      linkedin: 'alex-thompson-dev',
      github: 'alexthompson'
    }
  },
  {
    id: '8',
    contactId: 'contact-8',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    classification: 'Moderator',
    communityEngagement: 82,
    eventsAttended: 14,
    interests: ['Community Safety', 'Mental Health', 'Inclusive Spaces'],
    joinDate: '2023-08-22',
    lastActive: '2024-03-11',
    notes: 'Mental health advocate, creates safe spaces for vulnerable members',
    socialMedia: {
      twitter: '@maria_safe',
      linkedin: 'maria-garcia-wellness'
    }
  },
  {
    id: '9',
    contactId: 'contact-9',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    classification: 'Volunteer',
    communityEngagement: 71,
    eventsAttended: 9,
    interests: ['Accessibility', 'Inclusive Design', 'User Experience'],
    joinDate: '2024-01-30',
    lastActive: '2024-03-09',
    notes: 'Accessibility expert, helps make events more inclusive',
    socialMedia: {
      linkedin: 'jordan-lee-ux',
      twitter: '@jordan_accessible'
    }
  },
  {
    id: '10',
    contactId: 'contact-10',
    name: 'Fatima Al-Zahra',
    email: 'fatima.alzahra@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    classification: 'Supporter',
    communityEngagement: 38,
    eventsAttended: 2,
    interests: ['Data Science', 'Machine Learning', 'Research'],
    joinDate: '2024-02-28',
    lastActive: '2024-03-04',
    notes: 'PhD student, interested in ML research collaborations',
    socialMedia: {
      linkedin: 'fatima-alzahra-research'
    }
  },
  {
    id: '11',
    contactId: 'contact-11',
    name: 'Chris O\'Connor',
    email: 'chris.oconnor@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    classification: 'Ambassador',
    communityEngagement: 96,
    eventsAttended: 25,
    interests: ['Startup Mentoring', 'Venture Capital', 'Product Strategy'],
    joinDate: '2023-04-12',
    lastActive: '2024-03-12',
    notes: 'Serial entrepreneur, angel investor, excellent mentor for startups',
    socialMedia: {
      twitter: '@chris_venture',
      linkedin: 'chris-oconnor-vc'
    }
  },
  {
    id: '12',
    contactId: 'contact-12',
    name: 'Sofia Rodriguez',
    email: 'sofia.rodriguez@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    classification: 'Volunteer',
    communityEngagement: 74,
    eventsAttended: 11,
    interests: ['Event Coordination', 'Logistics', 'Team Building'],
    joinDate: '2023-12-05',
    lastActive: '2024-03-10',
    notes: 'Project manager by day, event coordinator by passion',
    socialMedia: {
      linkedin: 'sofia-rodriguez-pm'
    }
  },
  {
    id: '13',
    contactId: 'contact-13',
    name: 'Kevin Zhang',
    email: 'kevin.zhang@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    classification: 'Supporter',
    communityEngagement: 52,
    eventsAttended: 4,
    interests: ['Mobile Development', 'iOS', 'Swift'],
    joinDate: '2024-01-20',
    lastActive: '2024-03-06',
    notes: 'iOS developer, interested in mobile development workshops',
    socialMedia: {
      twitter: '@kevin_ios',
      linkedin: 'kevin-zhang-mobile'
    }
  },
  {
    id: '14',
    contactId: 'contact-14',
    name: 'Aisha Patel',
    email: 'aisha.patel@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    classification: 'Moderator',
    communityEngagement: 85,
    eventsAttended: 16,
    interests: ['Content Moderation', 'Community Guidelines', 'Conflict Resolution'],
    joinDate: '2023-10-15',
    lastActive: '2024-03-11',
    notes: 'HR professional, excellent at handling community conflicts',
    socialMedia: {
      linkedin: 'aisha-patel-hr'
    }
  },
  {
    id: '15',
    contactId: 'contact-15',
    name: 'Ryan Mitchell',
    email: 'ryan.mitchell@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    classification: 'Supporter',
    communityEngagement: 41,
    eventsAttended: 1,
    interests: ['Web Development', 'React', 'JavaScript'],
    joinDate: '2024-03-01',
    lastActive: '2024-03-03',
    notes: 'Junior developer, looking to learn and network',
    socialMedia: {
      github: 'ryanmitchell',
      linkedin: 'ryan-mitchell-dev'
    }
  },
  {
    id: '16',
    contactId: 'contact-16',
    name: 'Lisa Chen',
    email: 'lisa.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    classification: 'Ambassador',
    communityEngagement: 94,
    eventsAttended: 20,
    interests: ['Product Management', 'User Research', 'Design Thinking'],
    joinDate: '2023-07-08',
    lastActive: '2024-03-12',
    notes: 'Senior PM at Google, excellent at product strategy workshops',
    socialMedia: {
      twitter: '@lisa_pm',
      linkedin: 'lisa-chen-pm'
    }
  },
  {
    id: '17',
    contactId: 'contact-17',
    name: 'Tom Anderson',
    email: 'tom.anderson@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    classification: 'Volunteer',
    communityEngagement: 69,
    eventsAttended: 7,
    interests: ['Audio/Video Production', 'Live Streaming', 'Technical Support'],
    joinDate: '2024-01-15',
    lastActive: '2024-03-08',
    notes: 'AV technician, helps with event production and streaming',
    socialMedia: {
      instagram: '@tom_av_tech',
      linkedin: 'tom-anderson-av'
    }
  },
  {
    id: '18',
    contactId: 'contact-18',
    name: 'Nina Johnson',
    email: 'nina.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    classification: 'Supporter',
    communityEngagement: 35,
    eventsAttended: 2,
    interests: ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
    joinDate: '2024-02-15',
    lastActive: '2024-03-02',
    notes: 'Security researcher, interested in cybersecurity workshops',
    socialMedia: {
      twitter: '@nina_sec',
      linkedin: 'nina-johnson-security'
    }
  },
  {
    id: '19',
    contactId: 'contact-19',
    name: 'Diego Martinez',
    email: 'diego.martinez@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    classification: 'Moderator',
    communityEngagement: 87,
    eventsAttended: 13,
    interests: ['Community Building', 'Latinx in Tech', 'Mentorship'],
    joinDate: '2023-09-25',
    lastActive: '2024-03-10',
    notes: 'Latinx community leader, creates inclusive spaces for underrepresented groups',
    socialMedia: {
      twitter: '@diego_latinx',
      linkedin: 'diego-martinez-community'
    }
  },
  {
    id: '20',
    contactId: 'contact-20',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    classification: 'Supporter',
    communityEngagement: 48,
    eventsAttended: 3,
    interests: ['UI/UX Design', 'Figma', 'Design Systems'],
    joinDate: '2024-02-10',
    lastActive: '2024-03-05',
    notes: 'UI designer, interested in design workshops and portfolio reviews',
    socialMedia: {
      behance: 'emmawilson',
      linkedin: 'emma-wilson-design'
    }
  }
];

const A10DDashboard: React.FC = () => {
  const [profiles] = useState<A10DProfile[]>(mockProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => 
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.interests.some(interest => 
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [profiles, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
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

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Profiles</p>
                <p className="text-2xl font-bold">{profiles.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ambassadors</p>
                <p className="text-2xl font-bold">{profiles.filter(p => p.classification === 'Ambassador').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volunteers</p>
                <p className="text-2xl font-bold">{profiles.filter(p => p.classification === 'Volunteer').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Moderators</p>
                <p className="text-2xl font-bold">{profiles.filter(p => p.classification === 'Moderator').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProfiles.map((profile) => (
            <A10DProfileCard 
              key={profile.id} 
              profile={profile}
            />
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No profiles found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery ? 'Try adjusting your search criteria' : 'No profiles have been added yet'}
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