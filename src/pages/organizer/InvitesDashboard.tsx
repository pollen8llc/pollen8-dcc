import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/models/types";
import { useInvites } from "@/hooks/useInvites";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { InviteMethodTabs } from "@/components/invites/InviteMethodTabs";
import { InviteMetricsCard } from "@/components/invites/InviteMetricsCard";
import { 
  Users, 
  RefreshCw,
  Send,
  BarChart3,
  Activity,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const InvitesDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { invites, getInvitesByCreator, invalidateInvite, isLoading } = useInvites();
  const [refreshing, setRefreshing] = useState(false);
  const [invalidatingIds, setInvalidatingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Only allow ORGANIZER or ADMIN
  if (!currentUser || ![UserRole.ORGANIZER, UserRole.ADMIN].includes(currentUser.role)) {
    navigate("/");
    return null;
  }

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    try {
      setRefreshing(true);
      await getInvitesByCreator();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load invites",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Filter invites based on search query
  const filteredInvites = invites.filter(invite => 
    invite.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (invite.community_id && invite.community_id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInvalidate = async (inviteId: string) => {
    setInvalidatingIds(prev => new Set(prev).add(inviteId));
    try {
      await invalidateInvite(inviteId);
      toast({
        title: "Success",
        description: "Invite invalidated successfully"
      });
      await loadInvites();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to invalidate invite",
        variant: "destructive"
      });
    } finally {
      setInvalidatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(inviteId);
        return newSet;
      });
    }
  };

  const activeInvites = invites.filter(invite => 
    invite.is_active && 
    (!invite.expires_at || new Date(invite.expires_at) > new Date()) &&
    (!invite.max_uses || invite.used_count < invite.max_uses)
  );

  const totalUses = invites.reduce((sum, invite) => sum + invite.used_count, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DotConnectorHeader />

      {/* Full width container for desktop */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-full">
        
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Invite Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Create and track your invitation campaigns with detailed analytics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={loadInvites}
              disabled={refreshing}
              variant="outline"
              className="glass-morphism border-0 bg-card/20 hover:bg-card/30 backdrop-blur-md"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Desktop Layout with Sidebar */}
        <div className="hidden lg:flex gap-6">
          {/* Main Content - Invite List */}
          <div className="flex-1 space-y-6">
            {/* Search Bar */}
            <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
              <CardHeader className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search invites by code or community..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 glass-morphism border-white/10 bg-white/5"
                    />
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {filteredInvites.length} of {invites.length} invites
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Invites Grid */}
            {isLoading && !refreshing ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredInvites.length === 0 ? (
              <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md text-center py-12">
                <CardContent>
                  <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {invites.length === 0 ? "No invites yet" : "No matching invites"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {invites.length === 0 
                      ? "Create your first invite to start building your community"
                      : "Try adjusting your search criteria"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredInvites.map((invite) => (
                  <InviteMetricsCard
                    key={invite.id}
                    invite={invite}
                    onInvalidate={handleInvalidate}
                    isInvalidating={invalidatingIds.has(invite.id!)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Invite Creation */}
          <div className="w-96 space-y-6">
            <InviteMethodTabs onInviteCreated={loadInvites} />
            
            {/* Quick Stats */}
            <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
              <CardHeader className="px-6 py-6">
                <CardTitle className="flex items-center gap-2 text-foreground text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Quick Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Invites</span>
                    <span className="font-semibold text-foreground">{invites.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Invites</span>
                    <span className="font-semibold text-primary">{activeInvites.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Uses</span>
                    <span className="font-semibold text-foreground">{totalUses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conversion Rate</span>
                    <span className="font-semibold text-muted-foreground opacity-50">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Search Bar */}
          <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
            <CardContent className="px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-morphism border-white/10 bg-white/5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Invite Creation */}
          <InviteMethodTabs onInviteCreated={loadInvites} />

          {/* Invites List */}
          {isLoading && !refreshing ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredInvites.length === 0 ? (
            <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md text-center py-12">
              <CardContent>
                <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {invites.length === 0 ? "No invites yet" : "No matching invites"}
                </h3>
                <p className="text-muted-foreground">
                  {invites.length === 0 
                    ? "Create your first invite above"
                    : "Try adjusting your search"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInvites.map((invite) => (
                <InviteMetricsCard
                  key={invite.id}
                  invite={invite}
                  onInvalidate={handleInvalidate}
                  isInvalidating={invalidatingIds.has(invite.id!)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitesDashboard;