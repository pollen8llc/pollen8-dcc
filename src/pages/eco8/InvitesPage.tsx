import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useCommunities } from "@/hooks/useCommunities";
import { Eco8Navigation } from "@/components/eco8/Eco8Navigation";
import InviteGenerator from "@/components/invites/InviteGenerator";
import InviteList from "@/components/invites/InviteList";
import Navbar from "@/components/Navbar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Plus, Users } from "lucide-react";

const InvitesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isLoading } = useUser();
  const { hasUserCommunities } = useCommunities();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    navigate("/auth");
    return null;
  }

  const isOrganizerOrAdmin = currentUser.role === 'ORGANIZER' || currentUser.role === 'ADMIN';

  if (!isOrganizerOrAdmin) {
    navigate("/");
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8 max-w-6xl pb-32">
          <div className="space-y-6">
            {/* Invite Generation Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Generate New Invite
                </CardTitle>
                <CardDescription>
                  Create invitation codes and links for new users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InviteGenerator onInviteCreated={() => window.location.reload()} />
              </CardContent>
            </Card>

            <Separator />

            {/* Existing Invites Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Invites
                </CardTitle>
                <CardDescription>
                  View and manage your existing invitation codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InviteList />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
          <div className="container mx-auto max-w-6xl pointer-events-auto">
            <Eco8Navigation hasUserCommunities={hasUserCommunities} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default InvitesPage;
