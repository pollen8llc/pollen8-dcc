import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import A10DProfileCard from '@/components/a10d/A10DProfileCard';
import A10DAddProfileDialog from '@/components/a10d/A10DAddProfileDialog';
import { A10DProfile } from '@/types/a10d';

// Mock data - in real app this would come from the service
const mockProfiles: A10DProfile[] = [
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
  }
];

const A10DVolunteers: React.FC = () => {
  const navigate = useNavigate();
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
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/a10d')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to A10D
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Volunteers</h1>
                <p className="text-muted-foreground mt-1">
                  Active contributors helping with events and activities
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {filteredProfiles.length}
              </Badge>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Volunteer
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search volunteers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProfiles.map((profile) => (
            <A10DProfileCard 
              key={profile.id} 
              profile={profile}
              onClick={() => navigate(`/a10d/profile/${profile.id}`)}
            />
          ))}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No volunteers found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery ? 'Try adjusting your search criteria' : 'No volunteers have been added yet'}
            </p>
          </div>
        )}
      </div>

      <A10DAddProfileDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        defaultClassification="Volunteer"
      />
    </div>
  );
};

export default A10DVolunteers;