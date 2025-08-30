import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { DotConnectorHeader } from '@/components/layout/DotConnectorHeader';
import { 
  Crown, 
  Search, 
  Users, 
  MapPin, 
  ArrowLeft, 
  MessageSquare, 
  UserPlus, 
  Calendar,
  Award,
  Activity,
  Clock,
  CheckCircle,
  Star,
  Mail,
  Phone
} from 'lucide-react';

const ManageVolunteers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Mock volunteer data - this would come from your API
  const mockVolunteers = [
    {
      id: '1',
      name: 'Alex Thompson',
      role: 'Ambassador',
      classification: 'Ambassador',
      location: 'Portland, OR',
      email: 'alex@example.com',
      phone: '+1 (555) 123-4567',
      avatar: null,
      engagement: 85,
      eventsAttended: 12,
      joinDate: '2023-08-15',
      lastActive: '2024-01-15',
      status: 'active',
      interests: ['Community Outreach', 'Event Planning', 'Social Media'],
      notes: 'Excellent at community engagement and social media promotion.'
    },
    {
      id: '2',
      name: 'Maria Santos',
      role: 'Volunteer Coordinator',
      classification: 'Volunteer',
      location: 'Miami, FL',
      email: 'maria@example.com',
      phone: '+1 (555) 234-5678',
      avatar: null,
      engagement: 92,
      eventsAttended: 18,
      joinDate: '2023-06-20',
      lastActive: '2024-01-14',
      status: 'active',
      interests: ['Volunteer Management', 'Training', 'Community Support'],
      notes: 'Great at organizing volunteer teams and training new members.'
    },
    {
      id: '3',
      name: 'David Park',
      role: 'Community Supporter',
      classification: 'Supporter',
      location: 'Seattle, WA',
      email: 'david@example.com',
      phone: '+1 (555) 345-6789',
      avatar: null,
      engagement: 67,
      eventsAttended: 8,
      joinDate: '2023-09-10',
      lastActive: '2024-01-10',
      status: 'inactive',
      interests: ['Community Support', 'Fundraising', 'Networking'],
      notes: 'Consistent supporter, good at connecting with sponsors.'
    },
    {
      id: '4',
      name: 'Sophie Chen',
      role: 'Content Moderator',
      classification: 'Moderator',
      location: 'San Diego, CA',
      email: 'sophie@example.com',
      phone: '+1 (555) 456-7890',
      avatar: null,
      engagement: 78,
      eventsAttended: 15,
      joinDate: '2023-07-05',
      lastActive: '2024-01-13',
      status: 'active',
      interests: ['Content Moderation', 'Community Guidelines', 'Conflict Resolution'],
      notes: 'Excellent moderator with strong conflict resolution skills.'
    }
  ];

  const filteredVolunteers = mockVolunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         volunteer.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         volunteer.classification.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'ambassadors') return matchesSearch && volunteer.classification === 'Ambassador';
    if (activeTab === 'volunteers') return matchesSearch && volunteer.classification === 'Volunteer';
    if (activeTab === 'supporters') return matchesSearch && volunteer.classification === 'Supporter';
    if (activeTab === 'moderators') return matchesSearch && volunteer.classification === 'Moderator';
    
    return matchesSearch;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'default' : 'secondary';
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'Ambassador': return <Crown className="h-4 w-4" />;
      case 'Volunteer': return <Users className="h-4 w-4" />;
      case 'Supporter': return <Star className="h-4 w-4" />;
      case 'Moderator': return <Award className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const summary = {
    total: mockVolunteers.length,
    ambassadors: mockVolunteers.filter(v => v.classification === 'Ambassador').length,
    volunteers: mockVolunteers.filter(v => v.classification === 'Volunteer').length,
    supporters: mockVolunteers.filter(v => v.classification === 'Supporter').length,
    moderators: mockVolunteers.filter(v => v.classification === 'Moderator').length,
    active: mockVolunteers.filter(v => v.status === 'active').length,
    avgEngagement: Math.round(mockVolunteers.reduce((sum, v) => sum + v.engagement, 0) / mockVolunteers.length)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      <div className="w-full px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/initi8">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <Crown className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Volunteers (ADVC8)</h1>
              <p className="text-muted-foreground">Coordinate with volunteers, advocates, and community ambassadors</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Volunteers</p>
                    <p className="text-2xl font-bold text-foreground">{summary.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-foreground">{summary.active}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ambassadors</p>
                    <p className="text-2xl font-bold text-foreground">{summary.ambassadors}</p>
                  </div>
                  <Crown className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Engagement</p>
                    <p className="text-2xl font-bold text-foreground">{summary.avgEngagement}%</p>
                  </div>
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search volunteers by name, role, or classification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All ({summary.total})</TabsTrigger>
            <TabsTrigger value="ambassadors">Ambassadors ({summary.ambassadors})</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers ({summary.volunteers})</TabsTrigger>
            <TabsTrigger value="supporters">Supporters ({summary.supporters})</TabsTrigger>
            <TabsTrigger value="moderators">Moderators ({summary.moderators})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {/* Volunteers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVolunteers.map((volunteer) => (
                <Card key={volunteer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={volunteer.avatar || undefined} />
                        <AvatarFallback className="text-lg font-semibold">
                          {getInitials(volunteer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{volunteer.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{volunteer.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getClassificationIcon(volunteer.classification)}
                          <Badge variant={getStatusColor(volunteer.status)} className="text-xs">
                            {volunteer.classification}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {volunteer.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-semibold">{volunteer.engagement}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Events</p>
                        <p className="font-semibold">{volunteer.eventsAttended}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{volunteer.location}</p>
                    </div>

                    {/* Last Active */}
                    <div className="flex items-center gap-1 mb-4">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Last active: {new Date(volunteer.lastActive).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {volunteer.interests.slice(0, 2).map((interest, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                      {volunteer.interests.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{volunteer.interests.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredVolunteers.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No volunteers found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or check a different category.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                  }}>
                    Show All Volunteers
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageVolunteers;