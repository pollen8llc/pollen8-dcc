import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Plus, 
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,
  Eye,
  Edit
} from 'lucide-react';
import { Community } from '@/types/community';
import { useUser } from '@/contexts/UserContext';

const CommunityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [myCommunities, setMyCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyCommunities = () => {
      try {
        const communities = JSON.parse(localStorage.getItem('communities') || '[]');
        // TODO: Filter by current user's ID when user system is integrated
        const userCommunities = communities.filter((c: Community) => 
          c.organizerId === currentUser?.id || c.organizerId === 'current-user-id'
        );
        setMyCommunities(userCommunities);
        setLoading(false);
      } catch (error) {
        console.error('Error loading communities:', error);
        setLoading(false);
      }
    };

    loadMyCommunities();
  }, [currentUser]);

  // Check if user needs to go through setup
  useEffect(() => {
    if (!loading && myCommunities.length === 0) {
      // User has no communities, redirect to setup
      navigate('/eco8/setup');
    }
  }, [loading, myCommunities.length, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (myCommunities.length === 0) {
    return null; // Will redirect to setup
  }

  const totalMembers = myCommunities.reduce((sum, community) => sum + community.memberCount, 0);
  const activeCommunitiesCount = myCommunities.filter(c => c.growthStatus === 'active').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Communities</h1>
            <p className="text-muted-foreground">Manage and grow your community presence</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/eco8">
                <Eye className="h-4 w-4 mr-2" />
                Browse All
              </Link>
            </Button>
            <Button asChild>
              <Link to="/eco8/setup">
                <Plus className="h-4 w-4 mr-2" />
                New Community
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myCommunities.length}</p>
                  <p className="text-sm text-muted-foreground">Communities</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalMembers}</p>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCommunitiesCount}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {myCommunities.map(community => (
            <Card key={community.id} className="backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300">
              <div className="relative">
                {/* Banner */}
                <div 
                  className="h-32 bg-cover bg-center rounded-t-2xl relative"
                  style={{ backgroundImage: `url(${community.banner})` }}
                >
                  <div className="absolute inset-0 bg-black/40 rounded-t-2xl"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`bg-${community.growthStatus === 'growing' ? 'green' : 
                      community.growthStatus === 'recruiting' ? 'blue' : 
                      community.growthStatus === 'active' ? 'primary' : 'yellow'}-500 text-white border-0`}>
                      {community.growthStatus}
                    </Badge>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Button size="sm" variant="outline" className="bg-black/20 border-white/20 text-white hover:bg-white/10">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="bg-black/20 border-white/20 text-white hover:bg-white/10">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-white/20">
                      <AvatarImage src={community.logo} alt={community.name} />
                      <AvatarFallback className="text-lg">{community.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{community.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{community.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{community.memberCount}</span>
                        </div>
                        {community.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{community.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Community Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">85%</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-500">+12</p>
                      <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-500">4.8</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={`/eco8/community/${community.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="backdrop-blur-md bg-white/5 border border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New member joined', community: myCommunities[0]?.name, time: '2 hours ago', type: 'member' },
                { action: 'Community update posted', community: myCommunities[0]?.name, time: '5 hours ago', type: 'post' },
                { action: 'Event scheduled', community: myCommunities[0]?.name, time: '1 day ago', type: 'event' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'member' ? 'bg-green-500/20' :
                      activity.type === 'post' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                    }`}>
                      {activity.type === 'member' ? <Users className="h-4 w-4" /> :
                       activity.type === 'post' ? <MessageSquare className="h-4 w-4" /> :
                       <Calendar className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.community}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityDashboard;