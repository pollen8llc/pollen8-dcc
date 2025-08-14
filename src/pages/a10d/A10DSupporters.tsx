import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, BarChart3 } from 'lucide-react';
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
  }
];

const A10DSupporters: React.FC = () => {
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
              <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Supporters</h1>
                <p className="text-muted-foreground mt-1">
                  Community members showing growing interest
                </p>
              </div>
              <Badge variant="secondary" className="ml-2">
                {filteredProfiles.length}
              </Badge>
            </div>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Supporter
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search supporters..."
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
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">No supporters found</h3>
            <p className="text-muted-foreground mt-1">
              {searchQuery ? 'Try adjusting your search criteria' : 'No supporters have been added yet'}
            </p>
          </div>
        )}
      </div>

      <A10DAddProfileDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        defaultClassification="Supporter"
      />
    </div>
  );
};

export default A10DSupporters;