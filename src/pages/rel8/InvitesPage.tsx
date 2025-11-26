import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Link2 } from "lucide-react";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { InviteMethodTabs } from "@/components/invites/InviteMethodTabs";
import { InviteMetricsCard } from "@/components/invites/InviteMetricsCard";
import { useInvites } from "@/hooks/useInvites";
import { useToast } from "@/hooks/use-toast";

const InvitesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isInvalidating, setIsInvalidating] = useState(false);

  const {
    invites,
    isLoading: invitesLoading,
    getInvitesByCreator,
    invalidateInvite
  } = useInvites();

  const activeInvites = invites.filter(invite => invite.is_active);

  useEffect(() => {
    getInvitesByCreator();
  }, []);

  const handleInviteCreated = async () => {
    await getInvitesByCreator();
  };

  const handleInvalidateInvite = async (inviteId: string) => {
    setIsInvalidating(true);
    try {
      await invalidateInvite(inviteId);
      toast({
        title: "Success",
        description: "Invite link has been deactivated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate invite link",
        variant: "destructive",
      });
    } finally {
      setIsInvalidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8 pb-32">
        <div className="flex items-center justify-between mb-6 mt-6">
          <div className="flex items-center gap-3">
            <Link2 className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Invite Links</h1>
              <p className="text-sm text-muted-foreground">
                Generate and manage shareable invite links to collect contact information
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/rel8/connect')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Connect
          </Button>
        </div>

        <div className="space-y-6">
          <InviteMethodTabs onInviteCreated={handleInviteCreated} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Active Invite Links
              </CardTitle>
              <CardDescription>
                Manage and track your active invitation links
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitesLoading ? (
                <p className="text-muted-foreground text-center py-8">Loading...</p>
              ) : activeInvites.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No active invite links. Create one above to get started!
                </p>
              ) : (
                <div className="space-y-4">
                  {activeInvites.map((invite) => (
                    <InviteMetricsCard
                      key={invite.id}
                      invite={invite}
                      onInvalidate={handleInvalidateInvite}
                      isInvalidating={isInvalidating}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="container mx-auto max-w-6xl pointer-events-auto">
          <Rel8OnlyNavigation />
        </div>
      </div>
    </div>
  );
};

export default InvitesPage;
