import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { DotConnectorHeader } from '@/components/layout/DotConnectorHeader';
import { useCommunities } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Search, 
  Upload, 
  Settings, 
  Activity, 
  Plus,
  Eye,
  Download,
  Network,
  Calendar,
  MessageSquare,
  AlertCircle,
  Edit
} from 'lucide-react';

const Eco8Dashboard: React.FC = () => {
  const { userCommunities, hasUserCommunities, loading } = useCommunities();
  const { currentUser } = useAuth();

  const quickStats = {
    networkSize: 0, // This would come from actual network connections
    communitiesManaged: userCommunities.length,
    totalEvents: 0, // This would come from events data
    totalContributions: 0 // This would come from contributions data
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      {/* DotConnector Header with Sliver */}
      <DotConnectorHeader />

      {/* Full-width content below the sliver */}
      <div className="w-full px-4 py-8">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.networkSize}</p>
                </div>
                <Network className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Communities</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.communitiesManaged}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Events</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Contributions</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalContributions}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/eco8/directory">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Search className="h-6 w-6 text-primary" />
                  Browse Communities
                </CardTitle>
                <CardDescription>
                  Discover and connect with communities in your network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Explore Directory
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/imports">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-primary" />
                  Import Data
                </CardTitle>
                <CardDescription>
                  Import contacts, members, and community data from various sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Import Now
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                Community Activity
              </CardTitle>
              <CardDescription>
                Monitor engagement, posts, and member interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">
                View Activity
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/eco8/setup">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Plus className="h-6 w-6 text-primary" />
                  Create Community
                </CardTitle>
                <CardDescription>
                  Start a new community and invite members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/eco8/invites">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Manage Invites
                </CardTitle>
                <CardDescription>
                  Generate and manage invitation codes for new members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Invite Users
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                Settings
              </CardTitle>
              <CardDescription>
                Manage preferences, notifications, and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">
                Configure
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Setup Prompt if no communities */}
        {!loading && !hasUserCommunities && (
          <Card className="border-2 border-dashed border-primary/50 bg-primary/5">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="h-16 w-16 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Welcome to ECO8!</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                You haven't created any communities yet. Start building your network by creating your first community.
              </p>
              <Link to="/eco8/setup">
                <Button size="lg" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Your First Community
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Managed Communities */}
        {hasUserCommunities && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Managed Communities</span>
                <Link to="/eco8/setup">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Communities you organize and manage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userCommunities.map((community) => (
                  <div key={community.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                        {community.logo_url ? (
                          <img src={community.logo_url} alt={community.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{community.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {community.type || community.community_type} • {community.location || 'Remote'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={community.is_public ? 'default' : 'secondary'}>
                        {community.is_public ? 'Public' : 'Private'}
                      </Badge>
                      <Link to={`/eco8/community/${community.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Link to={`/eco8/community/${community.id}?edit=true`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Eco8Dashboard;