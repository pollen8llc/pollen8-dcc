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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      {/* Stacked Layout - No Sidebar */}
      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        
        {/* Header Section */}
        <div className={`transition-all duration-700 ${isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
            <CardHeader className="pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Invite Management</h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Create and track your invitation campaigns
                  </p>
                </div>
                <Button 
                  onClick={loadInvites}
                  disabled={refreshing}
                  variant="outline"
                  className="glass-morphism border-0 bg-card/20 hover:bg-card/30 backdrop-blur-md self-start sm:self-auto"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">Refresh</span>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Search Section */}
        <div className={`transition-all duration-700 delay-100 ${isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
            <CardContent className="px-6 py-4">
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
                  {filteredInvites.length} of {invites.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Invite Section */}
        <div className={`transition-all duration-700 delay-200 ${isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          <InviteMethodTabs onInviteCreated={loadInvites} />
        </div>

        {/* Invites List Section */}
        <div className={`transition-all duration-700 delay-300 ${isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
          {isLoading && !refreshing ? (
            <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md">
              <CardContent className="flex justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading invites...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredInvites.length === 0 ? (
            <Card className="glass-morphism border-0 bg-card/30 backdrop-blur-md text-center">
              <CardContent className="py-16">
                <Send className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {invites.length === 0 ? "No invites yet" : "No matching invites"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {invites.length === 0 
                    ? "Create your first invite using the tools above to start building your community"
                    : "Try adjusting your search criteria to find specific invites"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInvites.map((invite, index) => (
                <div 
                  key={invite.id}
                  className={`transition-all duration-500 ${
                    isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                  }`}
                  style={{ 
                    transitionDelay: `${400 + index * 100}ms`
                  }}
                >
                  <InviteMetricsCard
                    invite={invite}
                    onInvalidate={handleInvalidate}
                    isInvalidating={invalidatingIds.has(invite.id!)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitesDashboard;