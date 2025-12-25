import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { mockNetworkContacts, getRelationshipType } from "@/data/mockNetworkData";
import { ConnectionStrengthBar } from "@/components/rel8t/network/ConnectionStrengthBar";
import { TrustRatingBar } from "@/components/rel8t/network/TrustRatingBar";
import { StatusDot } from "@/components/rel8t/network/StatusDot";
import { DevelopmentPathCard } from "@/components/rel8t/network/DevelopmentPathCard";
import { DevelopmentTimeline } from "@/components/rel8t/network/DevelopmentTimeline";
import { PathSelectionModal } from "@/components/rel8t/network/PathSelectionModal";
import { InteractionLogModal } from "@/components/rel8t/network/InteractionLogModal";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function NetworkProfile() {
  const { id } = useParams();
  const [showLogModal, setShowLogModal] = useState(false);
  const [showPathModal, setShowPathModal] = useState(false);
  const [contactState, setContactState] = useState(() => {
    return mockNetworkContacts.find(c => c.id === id);
  });
  
  const contact = contactState;
  
  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Contact not found</p>
      </div>
    );
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');
  const relationshipType = getRelationshipType(contact.relationshipType);

  const handleSelectPath = (pathId: string) => {
    setContactState(prev => prev ? {
      ...prev,
      developmentPathId: pathId,
      currentStepIndex: 0,
      completedSteps: [],
      pathStartedAt: new Date().toISOString().split('T')[0]
    } : prev);
  };

  const handleAdvanceStep = () => {
    setContactState(prev => {
      if (!prev) return prev;
      const currentIndex = prev.currentStepIndex ?? 0;
      return {
        ...prev,
        currentStepIndex: currentIndex + 1
      };
    });
  };

  const handlePlanTouchpoint = (stepIndex: number) => {
    // Navigate to timeline with pre-filled form
    window.location.href = `/rel8/network/${id}/timeline`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Back Button */}
        <Link to="/rel8/network" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Network
        </Link>

        {/* Hero Section */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage src={contact.avatar} />
              <AvatarFallback className="text-2xl">{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-2xl font-bold">{contact.name}</h1>
                  <p className="text-muted-foreground">{contact.role} at {contact.company}</p>
                </div>
                <Badge variant="secondary">{contact.industry}</Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span>{contact.location}</span>
                {contact.email && <span>{contact.email}</span>}
                {contact.phone && <span>{contact.phone}</span>}
              </div>
              
              <div className="mt-4">
                <Badge variant="outline">{relationshipType?.label}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Metrics - No Icons */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Connection Strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ConnectionStrengthBar strength={contact.connectionStrength} size="lg" />
              <div className="pt-2">
                <TrustRatingBar rating={contact.trustRating} size="md" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Network Influence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Influence Level</span>
                <StatusDot status={contact.networkInfluence} pulse={true} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mutual Connections</span>
                <span className="font-medium">{contact.mutualConnections}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Contact</span>
                <span className="text-sm">{formatDistanceToNow(parseISO(contact.lastInteraction), { addSuffix: true })}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* About This Relationship */}
        <Card className="glass-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">About This Relationship</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b border-border/30 pb-3">
              <p className="text-xs text-muted-foreground mb-1">How we met</p>
              <p className="text-sm">{contact.howWeMet}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Vibe notes</p>
              <p className="text-sm">{contact.vibeNotes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card className="glass-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {contact.recentAchievements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {contact.recentAchievements.map((achievement, i) => (
                  <Badge key={i} variant="secondary">{achievement}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent achievements recorded</p>
            )}
          </CardContent>
        </Card>

        {/* Relationship Development */}
        <Card className="glass-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Relationship Development</CardTitle>
          </CardHeader>
          <CardContent>
            <DevelopmentPathCard
              pathId={contact.developmentPathId}
              currentStepIndex={contact.currentStepIndex}
              completedSteps={contact.completedSteps}
              onPlanTouchpoint={handlePlanTouchpoint}
              onAdvanceStep={handleAdvanceStep}
              onChangePath={() => setShowPathModal(true)}
            />
          </CardContent>
        </Card>

        {/* Relationship Timeline */}
        <Card className="glass-card mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Relationship Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <DevelopmentTimeline
              interactions={contact.interactions}
              pathId={contact.developmentPathId}
              currentStepIndex={contact.currentStepIndex}
              completedSteps={contact.completedSteps}
              pathStartedAt={contact.pathStartedAt}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link to={`/rel8/network/${id}/timeline`}>
            <Button>Plan Touchpoint</Button>
          </Link>
          <Button variant="outline" onClick={() => setShowLogModal(true)}>
            Log Interaction
          </Button>
          <Link to={`/rel8/network/${id}/strategy`}>
            <Button variant="outline">Build Strategy</Button>
          </Link>
        </div>
      </div>

      <InteractionLogModal open={showLogModal} onOpenChange={setShowLogModal} contactName={contact.name} />
      <PathSelectionModal 
        open={showPathModal} 
        onOpenChange={setShowPathModal} 
        onSelectPath={handleSelectPath}
        currentPathId={contact.developmentPathId}
      />

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}
