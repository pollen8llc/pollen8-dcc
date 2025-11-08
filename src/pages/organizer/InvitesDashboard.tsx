import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/models/types";
import { useInvites } from "@/hooks/useInvites";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { InviteMetricsCard } from "@/components/invites/InviteMetricsCard";
import InviteGenerator from "@/components/invites/InviteGenerator";
import { 
  RefreshCw,
  Link as LinkIcon
} from "lucide-react";

const InvitesDashboard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { invites, getInvitesByCreator, invalidateInvite, isLoading } = useInvites();
  const [refreshing, setRefreshing] = useState(false);
  const [invalidatingIds, setInvalidatingIds] = useState<Set<string>>(new Set());

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

  // Filter to only show active invites
  const activeInvites = invites.filter(invite => 
    invite.is_active && 
    (!invite.expires_at || new Date(invite.expires_at) > new Date()) &&
    (!invite.max_uses || invite.used_count < invite.max_uses)
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


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LinkIcon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Invite Links</h1>
              <p className="text-sm text-muted-foreground">
                Generate and manage invitation links
              </p>
            </div>
          </div>
          <Button 
            onClick={loadInvites}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Create Invite Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New Link</CardTitle>
          </CardHeader>
          <CardContent>
            <InviteGenerator onInviteCreated={loadInvites} />
          </CardContent>
        </Card>

        {/* Active Invites List Section */}
        <Card>
          <CardHeader>
            <CardTitle>Active Links ({activeInvites.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !refreshing ? (
              <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading invites...</p>
                </div>
              </div>
            ) : activeInvites.length === 0 ? (
              <div className="text-center py-8">
                <LinkIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No active links</h3>
                <p className="text-muted-foreground text-sm">
                  Generate your first invite link to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeInvites.map((invite) => (
                  <InviteMetricsCard
                    key={invite.id}
                    invite={invite}
                    onInvalidate={handleInvalidate}
                    isInvalidating={invalidatingIds.has(invite.id!)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvitesDashboard;