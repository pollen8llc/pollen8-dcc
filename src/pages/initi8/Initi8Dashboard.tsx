import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navbar from '@/components/Navbar';
import { DotConnectorHeader } from '@/components/layout/DotConnectorHeader';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

import { 
  Users, 
  Search, 
  Upload, 
  Settings, 
  MessageSquare,
  UserPlus,
  HeartHandshake,
  UserCheck,
  Mail,
  Plus,
  Calendar,
  Activity,
  AlertCircle,
  Edit,
  Crown,
  Building
} from 'lucide-react';

const Initi8Dashboard: React.FC = () => {
  const { currentUser } = useUser();
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [hasExistingCommunity, setHasExistingCommunity] = useState<boolean | null>(null);

  // Check if user has existing communities
  useEffect(() => {
    const checkCommunities = async () => {
      if (!currentUser?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('id')
          .eq('owner_id', currentUser.id)
          .limit(1);
        
        if (error) throw error;
        setHasExistingCommunity(data && data.length > 0);
      } catch (error) {
        console.error('Error checking communities:', error);
        setHasExistingCommunity(false);
      }
    };
    
    checkCommunities();
  }, [currentUser?.id]);

  const quickStats = {
    totalProfiles: 0, // This would come from profiles data
    activeVolunteers: 0, // This would come from volunteers data
    totalMessages: 0, // This would come from messages data
    completedOnboarding: 0 // This would come from onboarding completion data
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
                  <p className="text-sm text-muted-foreground">Profiles</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalProfiles}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Volunteers</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.activeVolunteers}</p>
                </div>
                <HeartHandshake className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalMessages}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Onboarded</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.completedOnboarding}</p>
                </div>
                <UserCheck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/profile/edit">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Edit className="h-6 w-6 text-primary" />
                  Setup Profile
                </CardTitle>
                <CardDescription>
                  Complete your organizer profile and onboarding information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Edit Profile
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/initi8/search">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Search className="h-6 w-6 text-primary" />
                  Search Profiles
                </CardTitle>
                <CardDescription>
                  Discover and connect with other organizers and community leaders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Browse Profiles
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/invites">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserPlus className="h-6 w-6 text-primary" />
                  Manage Invites
                </CardTitle>
                <CardDescription>
                  Generate and manage invitation codes for new members and organizers
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
            <Link to="/imports">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Upload className="h-6 w-6 text-primary" />
                  Import Contacts
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
            <Dialog open={isMessageCenterOpen} onOpenChange={setIsMessageCenterOpen}>
              <DialogTrigger asChild>
                <div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Mail className="h-6 w-6 text-primary" />
                      Message Center
                    </CardTitle>
                    <CardDescription>
                      Communicate with team members, volunteers, and community leaders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full">
                      Open Messages
                    </Button>
                  </CardContent>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Message Center
                  </DialogTitle>
                </DialogHeader>
                <div className="flex h-96">
                  {/* Conversations List */}
                  <div className="w-1/3 border-r pr-4">
                    <div className="space-y-2 mb-4">
                      <Button size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        New Message
                      </Button>
                    </div>
                    <div className="space-y-2 overflow-y-auto h-80">
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <div className="font-medium text-sm">Team Updates</div>
                        <div className="text-xs text-muted-foreground">Latest message...</div>
                      </div>
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <div className="font-medium text-sm">Volunteer Coordination</div>
                        <div className="text-xs text-muted-foreground">Scheduling discussion...</div>
                      </div>
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <div className="font-medium text-sm">Community Leaders</div>
                        <div className="text-xs text-muted-foreground">Planning session...</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Message Area */}
                  <div className="flex-1 pl-4 flex flex-col">
                    <div className="flex-1 border rounded-lg p-4 mb-4 overflow-y-auto bg-muted/20">
                      <div className="text-center text-muted-foreground py-8">
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                        <p>Select a conversation to view messages</p>
                      </div>
                    </div>
                    
                    {/* Message Input */}
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type your message..." 
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        disabled
                      />
                      <Button size="sm" disabled>Send</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </Card>

          {/* Conditional card based on user role */}
          {currentUser?.role === 'MEMBER' ? (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to={hasExistingCommunity ? "/eco8" : "/eco8/setup"}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building className="h-6 w-6 text-primary" />
                    Community Profiles
                  </CardTitle>
                  <CardDescription>
                   {hasExistingCommunity 
                      ? "Manage your community and build connections"
                      : "Create your first community and unlock full organizer features & dashboard access"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    {hasExistingCommunity ? "Manage Community" : "Create Community"}
                  </Button>
                </CardContent>
              </Link>
            </Card>
          ) : (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to="/initi8/volunteers">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-primary" />
                    Manage Volunteers (ADVC8)
                  </CardTitle>
                  <CardDescription>
                    Coordinate with volunteers, advocates, and community ambassadors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Manage Team
                  </Button>
                </CardContent>
              </Link>
            </Card>
          )}
        </div>

        {/* Welcome Section */}
        <Card className="border-2 border-dashed border-primary/50 bg-primary/5">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <UserCheck className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Welcome to INITI8!</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your central hub for profile management, volunteer coordination, and community engagement. 
              Complete your setup to unlock all features.
            </p>
            <div className="flex gap-4">
              <Link to="/profile/setup">
                <Button size="lg" className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Complete Setup
                </Button>
              </Link>
              <Link to="/initi8/search">
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Explore Profiles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Initi8Dashboard;