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
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
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
          
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
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
          
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
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
          
          <Card className="glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to="/profile/edit" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
                    <Edit className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Setup Profile</CardTitle>
                    <p className="text-sm text-muted-foreground">Complete your profile setup</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to="/initi8/search" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30">
                    <Search className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Search Profiles</CardTitle>
                    <p className="text-sm text-muted-foreground">Find and connect with members</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to="/invites" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-green-500/15 border border-green-500/30">
                    <UserPlus className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Manage Invites</CardTitle>
                    <p className="text-sm text-muted-foreground">Create and track invitations</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to="/imports" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30">
                    <Upload className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Import Contacts</CardTitle>
                    <p className="text-sm text-muted-foreground">Upload and manage contacts</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Dialog open={isMessageCenterOpen} onOpenChange={setIsMessageCenterOpen}>
              <DialogTrigger asChild>
                <div className="relative h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30">
                        <Mail className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">Message Center</CardTitle>
                        <p className="text-sm text-muted-foreground">Community communications</p>
                      </div>
                    </div>
                  </CardHeader>
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
            <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <Link to={hasExistingCommunity ? "/eco8" : "/eco8/setup"} className="block relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30">
                      <Building className="h-6 w-6 text-teal-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Community Profiles</CardTitle>
                      <p className="text-sm text-muted-foreground">Manage community settings</p>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card> : 
            <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <Link to="/initi8/volunteers" className="block relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-pink-500/15 border border-pink-500/30">
                      <Crown className="h-6 w-6 text-pink-500" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Manage Volunteers</CardTitle>
                      <p className="text-sm text-muted-foreground">Coordinate volunteer activities</p>
                    </div>
                  </div>
                </CardHeader>
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