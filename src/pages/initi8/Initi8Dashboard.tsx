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
import { Users, Search, Upload, Settings, MessageSquare, UserPlus, HeartHandshake, UserCheck, Mail, Plus, Calendar, Activity, AlertCircle, Edit, Crown, Building } from 'lucide-react';
const Initi8Dashboard: React.FC = () => {
  const {
    currentUser
  } = useUser();
  const [isMessageCenterOpen, setIsMessageCenterOpen] = useState(false);
  const [hasExistingCommunity, setHasExistingCommunity] = useState<boolean | null>(null);

  // Check if user has existing communities
  useEffect(() => {
    const checkCommunities = async () => {
      if (!currentUser?.id) return;
      try {
        const {
          data,
          error
        } = await supabase.from('communities').select('id').eq('owner_id', currentUser.id).limit(1);
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
    totalProfiles: 0,
    // This would come from profiles data
    activeVolunteers: 0,
    // This would come from volunteers data
    totalMessages: 0,
    // This would come from messages data
    completedOnboarding: 0 // This would come from onboarding completion data
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      {/* DotConnector Header with Sliver */}
      <DotConnectorHeader />

      {/* Full-width content below the sliver */}
      <div className="w-full px-4 py-8">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
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
          
          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
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
          
          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
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
          
          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
            <Link to="/profile/edit">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Setup</p>
                    <p className="text-lg font-bold text-foreground">Profile</p>
                  </div>
                  <Edit className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
            <Link to="/initi8/search">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Search</p>
                    <p className="text-lg font-bold text-foreground">Profiles</p>
                  </div>
                  <Search className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
            <Link to="/invites">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Manage</p>
                    <p className="text-lg font-bold text-foreground">Invites</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
            <Link to="/imports">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Import</p>
                    <p className="text-lg font-bold text-foreground">Contacts</p>
                  </div>
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
            <Dialog open={isMessageCenterOpen} onOpenChange={setIsMessageCenterOpen}>
              <DialogTrigger asChild>
                <div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Message</p>
                        <p className="text-lg font-bold text-foreground">Center</p>
                      </div>
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
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
                      <input type="text" placeholder="Type your message..." className="flex-1 px-3 py-2 border rounded-lg text-sm" disabled />
                      <Button size="sm" disabled>Send</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </Card>

          {/* Conditional card based on user role */}
          {currentUser?.role === 'MEMBER' || currentUser?.role === 'ADMIN' ? 
            <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
              <Link to={hasExistingCommunity ? "/eco8" : "/eco8/setup"}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Community</p>
                      <p className="text-lg font-bold text-foreground">Profiles</p>
                    </div>
                    <Building className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Link>
            </Card> : 
            <Card className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer">
              <Link to="/initi8/volunteers">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Manage</p>
                      <p className="text-lg font-bold text-foreground">Volunteers</p>
                    </div>
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          }
        </div>

        {/* Welcome Section */}
        <Card className="border-2 border-dashed border-primary/50 bg-primary/5">
          
        </Card>
      </div>
    </div>;
};
export default Initi8Dashboard;