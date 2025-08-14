import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Filter } from 'lucide-react';
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
  }
];

const A10DModerators: React.FC = () => {
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
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Moderators</h1>
                <p className="text-muted-foreground mt-1">
                  Community guides ensuring positive interactions
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {filteredProfiles.length}
              </Badge>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Moderator
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search moderators..."
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
            <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No moderators found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery ? 'Try adjusting your search criteria' : 'No moderators have been added yet'}
            </p>
          </div>
        )}
      </div>

      <A10DAddProfileDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        defaultClassification="Moderator"
      />
    </div>
  );
};

export default A10DModerators;