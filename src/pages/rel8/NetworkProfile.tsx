import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getActv8Contact, deactivateContact, updateContactProgress, getDevelopmentPath } from "@/services/actv8Service";
import { supabase } from "@/integrations/supabase/client";
import { ConnectionStrengthBar } from "@/components/rel8t/network/ConnectionStrengthBar";
import { TrustRatingBar } from "@/components/rel8t/network/TrustRatingBar";
import { StatusDot } from "@/components/rel8t/network/StatusDot";
import { DevelopmentPathCard } from "@/components/rel8t/network/DevelopmentPathCard";
import { DevelopmentTimeline } from "@/components/rel8t/network/DevelopmentTimeline";
import { PathSelectionModal } from "@/components/rel8t/network/PathSelectionModal";

import { StepInterfaceRouter } from "@/components/rel8t/touchpoint";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast } from "sonner";

export default function NetworkProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Get wizard context for Build Rapport integration
  const { 
    setActv8ContactId, 
    setActv8StepIndex, 
    setActv8StepData,
    setPreSelectedContacts 
  } = useRelationshipWizard();
  
  const [showPathModal, setShowPathModal] = useState(false);
  const [showTouchpointSheet, setShowTouchpointSheet] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  // Fetch actv8 contact from database
  const { data: actv8Contact, isLoading, error } = useQuery({
    queryKey: ['actv8-contact', id],
    queryFn: () => getActv8Contact(id!),
    enabled: !!id,
  });

  // Mutation to update development path - must be before any conditional returns
  const updatePathMutation = useMutation({
    mutationFn: async (pathId: string) => {
      if (!actv8Contact) throw new Error('No contact loaded');
      const { error } = await supabase
        .from('rms_actv8_contacts')
        .update({ 
          development_path_id: pathId,
          current_step_index: 0,
          completed_steps: [],
          path_started_at: new Date().toISOString()
        })
        .eq('id', actv8Contact.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actv8-contact', id] });
      toast.success('Development path updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update path: ' + error.message);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !actv8Contact) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Contact not found</p>
        <Link to="/rel8/actv8">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Actv8
          </Button>
        </Link>
      </div>
    );
  }

  // Map database contact to display format
  const contact = {
    id: actv8Contact.id,
    contactId: actv8Contact.contact_id,
    name: actv8Contact.contact?.name || 'Unknown',
    role: actv8Contact.contact?.role || 'Professional',
    company: actv8Contact.contact?.organization || 'Independent',
    industry: actv8Contact.contact?.tags?.[0] || 'General',
    email: actv8Contact.contact?.email,
    phone: actv8Contact.contact?.phone,
    location: '',
    avatar: '',
    connectionStrength: (actv8Contact.connection_strength as 'thin' | 'growing' | 'solid' | 'thick') || 'thin',
    relationshipType: actv8Contact.relationship_type || 'collaborator',
    trustRating: 3,
    networkInfluence: 'medium' as const,
    mutualConnections: 0,
    lastInteraction: actv8Contact.last_touchpoint_at || actv8Contact.activated_at || new Date().toISOString(),
    howWeMet: 'Added via Actv8',
    vibeNotes: actv8Contact.intention_notes || 'No notes yet',
    recentAchievements: [] as string[],
    eventsAttended: [] as string[],
    developmentPathId: actv8Contact.development_path_id,
    currentStepIndex: actv8Contact.current_step_index || 0,
    completedSteps: actv8Contact.completed_steps || [],
    pathStartedAt: actv8Contact.path_started_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    interactions: [] as any[],
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  const handleSelectPath = (pathId: string) => {
    updatePathMutation.mutate(pathId);
  };

  const handleAdvanceStep = async () => {
    const newStepIndex = contact.currentStepIndex + 1;
    const newCompletedSteps = [...contact.completedSteps, String(contact.currentStepIndex)];
    
    try {
      await updateContactProgress(actv8Contact.id, newStepIndex, newCompletedSteps);
      queryClient.invalidateQueries({ queryKey: ['actv8-contact', id] });
      toast.success('Step completed!');
    } catch (error: any) {
      toast.error('Failed to advance step: ' + error.message);
    }
  };

  // Check if path is Build Rapport
  const isBuildRapportPath = actv8Contact?.path?.id === 'build_rapport';

  const handlePlanTouchpoint = async (stepIndex: number) => {
    // For Build Rapport path, redirect to wizard with pre-populated data
    if (isBuildRapportPath && actv8Contact?.path?.steps) {
      const step = actv8Contact.path.steps[stepIndex];
      if (step && actv8Contact.contact) {
        // Set wizard context with Actv8 data
        setActv8ContactId(actv8Contact.id);
        setActv8StepIndex(stepIndex);
        setActv8StepData({
          stepName: step.name,
          stepDescription: step.description,
          suggestedChannel: step.suggested_channel,
          suggestedAction: step.suggested_action,
          suggestedTone: step.suggested_tone,
          pathName: actv8Contact.path.name,
        });
        
        // Pre-select the contact for the wizard (only include required fields)
        setPreSelectedContacts([{
          id: actv8Contact.contact.id,
          name: actv8Contact.contact.name,
          email: actv8Contact.contact.email || undefined,
          organization: actv8Contact.contact.organization || undefined,
          user_id: '', // Will be filled by wizard
          created_at: '',
          updated_at: '',
        }]);
        
        // Navigate to wizard
        navigate(`/rel8/wizard?actv8Id=${actv8Contact.id}&stepIndex=${stepIndex}`);
        return;
      }
    }
    
    // For other paths, use the existing sheet interface
    setActiveStepIndex(stepIndex);
    setShowTouchpointSheet(true);
  };

  const handleTouchpointComplete = (data: any) => {
    console.log('Touchpoint planned:', data);
    setShowTouchpointSheet(false);
    setActiveStepIndex(null);
    toast.success('Touchpoint saved successfully');
  };


  // Map relationship type
  const relationshipTypeLabels: Record<string, string> = {
    collaborator: 'Collaborator',
    mentor: 'Mentor',
    mentee: 'Mentee',
    peer: 'Peer',
    client: 'Client',
    prospect: 'Prospect',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-32">
        {/* Back Button */}
        <Link to="/rel8/actv8" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Actv8
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
                {contact.location && <span>{contact.location}</span>}
                {contact.email && <span>{contact.email}</span>}
                {contact.phone && <span>{contact.phone}</span>}
              </div>
              
              <div className="mt-4">
                <Badge variant="outline">{relationshipTypeLabels[contact.relationshipType] || contact.relationshipType}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Metrics */}
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
          <Button onClick={() => handlePlanTouchpoint(contact.currentStepIndex ?? 0)}>
            Plan Touchpoint
          </Button>
          <Link to={`/rel8/actv8/${id}/strategy`}>
            <Button variant="outline">Build Strategy</Button>
          </Link>
        </div>
      </div>

      
      <PathSelectionModal 
        open={showPathModal} 
        onOpenChange={setShowPathModal} 
        onSelectPath={handleSelectPath}
        currentPathId={contact.developmentPathId}
      />

      {/* Touchpoint Planning Sheet */}
      <Sheet open={showTouchpointSheet} onOpenChange={setShowTouchpointSheet}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle>Plan Touchpoint</SheetTitle>
          </SheetHeader>
          {activeStepIndex !== null && (
            <StepInterfaceRouter
              contact={contact}
              stepIndex={activeStepIndex}
              onComplete={handleTouchpointComplete}
              onCancel={() => setShowTouchpointSheet(false)}
            />
          )}
        </SheetContent>
      </Sheet>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}