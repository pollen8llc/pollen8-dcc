
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import { Eco8Navigation } from '@/components/eco8/Eco8Navigation';
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
  Edit,
  Building2
} from 'lucide-react';
import { useCommunities } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';

const CommunityDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userCommunities, hasUserCommunities, loading, refreshUserCommunities } = useCommunities();

  useEffect(() => {
    // Refresh data when component mounts
    if (currentUser?.id) {
      refreshUserCommunities();
    }
  }, [currentUser?.id, refreshUserCommunities]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user has no communities, show setup prompt
  if (!loading && userCommunities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="backdrop-blur-md bg-white/5 border border-white/10 max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Welcome to ECO8!</h1>
            <p className="text-muted-foreground mb-6">
              You haven't created any communities yet. Let's get started by setting up your first community.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link to="/eco8/setup">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Community
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/eco8">
                  <Eye className="h-4 w-4 mr-2" />
                  Browse Communities
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalMembers = userCommunities.reduce((sum, community) => {
    const memberCount = parseInt(community.community_size || '1');
    return sum + (isNaN(memberCount) ? 1 : memberCount);
  }, 0);

  const activeCommunitiesCount = userCommunities.filter(c => c.is_public).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Eco8Navigation hasUserCommunities={hasUserCommunities} />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userCommunities.length}</p>
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
                  <p className="text-sm text-muted-foreground">Public</p>
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
          {userCommunities.map(community => (
            <Card key={community.id} className="backdrop-blur-md bg-white/5 border border-white/10 hover:scale-[1.02] transition-all duration-300">
              <div className="relative">
                {/* Header */}
                <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-2xl relative">
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${community.is_public ? 'bg-green-500' : 'bg-yellow-500'} text-white border-0`}>
                      {community.is_public ? 'Public' : 'Private'}
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
                      <AvatarImage src={community.logo_url} alt={community.name} />
                      <AvatarFallback className="text-lg">{community.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{community.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{community.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{community.community_size || '1'}</span>
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
                { action: 'New member joined', community: userCommunities[0]?.name || 'Your Community', time: '2 hours ago', type: 'member' },
                { action: 'Community update posted', community: userCommunities[0]?.name || 'Your Community', time: '5 hours ago', type: 'post' },
                { action: 'Event scheduled', community: userCommunities[0]?.name || 'Your Community', time: '1 day ago', type: 'event' }
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
