import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { DotConnectorHeader } from '@/components/layout/DotConnectorHeader';
import { useCommunities } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';
import { useModuleCompletion } from '@/hooks/useModuleCompletion';

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
  const navigate = useNavigate();
  const { userCommunities, hasUserCommunities, loading } = useCommunities();
  const { currentUser } = useAuth();
  const { eco8_complete, loading: completionLoading } = useModuleCompletion();

  // Check ECO8 setup status - only use database state
  React.useEffect(() => {
    if (!completionLoading && eco8_complete === false) {
      navigate("/eco8/setup");
    }
  }, [completionLoading, eco8_complete, navigate]);

  // Debug logging
  console.log('Eco8Dashboard - Current user:', currentUser?.id);
  console.log('Eco8Dashboard - User communities:', userCommunities);
  console.log('Eco8Dashboard - Has user communities:', hasUserCommunities);

  const quickStats = {
    networkSize: 0, // This would come from actual network connections
    communitiesManaged: userCommunities.length,
    totalEvents: 0, // This would come from events data
    totalContributions: 0 // This would come from contributions data
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="glassmorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Network</p>
                  <p className="text-2xl font-bold">{quickStats.networkSize}</p>
                </div>
                <Network className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Communities</p>
                  <p className="text-2xl font-bold">{quickStats.communitiesManaged}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Events</p>
                  <p className="text-2xl font-bold">{quickStats.totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contributions</p>
                  <p className="text-2xl font-bold">{quickStats.totalContributions}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <Link to="/eco8/directory" className="block h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Search className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Browse Communities</h3>
                    <p className="text-sm text-muted-foreground">Discover and connect with communities in your network</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <Link to="/imports" className="block h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Import Data</h3>
                    <p className="text-sm text-muted-foreground">Import contacts, members, and community data from various sources</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Community Activity</h3>
                  <p className="text-sm text-muted-foreground">Monitor engagement, posts, and member interactions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <Link to={hasUserCommunities ? "/eco8" : "/eco8/setup"} className="block h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Plus className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{hasUserCommunities ? 'Manage Communities' : 'Create Community'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {hasUserCommunities
                        ? 'View and manage your existing communities'
                        : 'Start a new community and invite members'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <Link to="/eco8/invites" className="block h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Manage Invites</h3>
                    <p className="text-sm text-muted-foreground">Generate and manage invitation codes for new members</p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="glassmorphic-card hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage preferences, notifications, and account settings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setup Prompt if no communities */}
        {!loading && !hasUserCommunities && (
          <Card className="glassmorphic-card border-2 border-dashed border-primary/50 bg-primary/5">
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
          <Card className="glassmorphic-card">
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