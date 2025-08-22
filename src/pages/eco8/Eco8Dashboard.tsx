import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Upload, 
  Settings, 
  Activity, 
  BarChart3, 
  Plus,
  Eye,
  Download,
  UserPlus
} from 'lucide-react';
import { Eco8Navigation } from '@/components/eco8/Eco8Navigation';

const Eco8Dashboard: React.FC = () => {
  // Mock data for organizer's communities
  const managedCommunities = [
    {
      id: '1',
      name: 'Tech Innovators Hub',
      memberCount: 156,
      status: 'growing',
      lastActivity: '2 hours ago'
    },
    {
      id: '2', 
      name: 'Sustainable Living Network',
      memberCount: 89,
      status: 'active',
      lastActivity: '1 day ago'
    }
  ];

  const quickStats = {
    totalCommunities: managedCommunities.length,
    totalMembers: managedCommunities.reduce((sum, c) => sum + c.memberCount, 0),
    activeToday: 34,
    pendingRequests: 7
  };

  return (
    <div className="min-h-screen bg-background">
      <Eco8Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">ECO8 Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage your communities, connect with members, and grow your network
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Communities</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalCommunities}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalMembers}</p>
                </div>
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.activeToday}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.pendingRequests}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
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
            <Link to="/imports-and-invites">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Download className="h-6 w-6 text-primary" />
                Export Data
              </CardTitle>
              <CardDescription>
                Download member lists, analytics, and community reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full">
                Export Options
              </Button>
            </CardContent>
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

        {/* Managed Communities */}
        {managedCommunities.length > 0 && (
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
                {managedCommunities.map((community) => (
                  <div key={community.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{community.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {community.memberCount} members • {community.lastActivity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={community.status === 'growing' ? 'default' : 'secondary'}>
                        {community.status}
                      </Badge>
                      <Link to={`/eco8/community/${community.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Eco8Dashboard;