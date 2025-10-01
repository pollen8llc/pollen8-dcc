import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import Navbar from '@/components/Navbar';
import { DotConnectorHeader } from '@/components/layout/DotConnectorHeader';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, MessageSquare, Edit, Crown, Building } from 'lucide-react';
const Initi8Dashboard: React.FC = () => {
  const {
    currentUser
  } = useUser();
  
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
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      {/* DotConnector Header with Sliver */}
      <DotConnectorHeader />

      {/* Full-width content below the sliver */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
            <Link to={`/profile/${currentUser?.id}`} className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
                    <Edit className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">User Profile</CardTitle>
                    <p className="text-sm text-muted-foreground">View, edit and manage your user profile</p>
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
            <Link to="/knowledge" className="block relative">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/30">
                    <MessageSquare className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Cultiv8</CardTitle>
                    <p className="text-sm text-muted-foreground">Community knowledge base</p>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          {/* Conditional card based on user role */}
          {currentUser?.role === 'MEMBER' || currentUser?.role === 'ADMIN' ? <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
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
            </Card> : <Card className="group relative overflow-hidden glass-morphism border-0 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 cursor-pointer hover:scale-[1.02]">
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
            </Card>}
        </div>

        {/* Welcome Section */}
        
      </div>
    </div>;
};
export default Initi8Dashboard;