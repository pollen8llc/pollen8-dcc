import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getActv8Contact, deactivateContact, updateContactProgress, getDevelopmentPath } from "@/services/actv8Service";
import { getOutreachesByActv8Contact, getOutreachesForContact } from "@/services/rel8t/outreachService";
import { supabase } from "@/integrations/supabase/client";
import { ConnectionStrengthBar } from "@/components/rel8t/network/ConnectionStrengthBar";
import { DevelopmentPathCard } from "@/components/rel8t/network/DevelopmentPathCard";
import { DevelopmentTimeline } from "@/components/rel8t/network/DevelopmentTimeline";
import { PathSelectionModal } from "@/components/rel8t/network/PathSelectionModal";
import { LinkOutreachDialog } from "@/components/rel8t/network/LinkOutreachDialog";

import { StepInterfaceRouter } from "@/components/rel8t/touchpoint";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loader2, Mail, Phone, Calendar, TrendingUp, Settings, MessageCircle, Edit, Heart, Zap } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast } from "sonner";

const strengthLabels: Record<string, string> = {
  spark: 'New Connection',
  ember: 'Growing',
  flame: 'Strong Bond',
  star: 'Core Relationship',
};

const strengthColors: Record<string, string> = {
  spark: 'text-red-500',
  ember: 'text-amber-500',
  flame: 'text-emerald-500',
  star: 'text-primary',
};

export default function NetworkProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { 
    setActv8ContactId, 
    setActv8StepIndex, 
    setActv8StepData,
    setPreSelectedContacts 
  } = useRelationshipWizard();
  
  const [showPathModal, setShowPathModal] = useState(false);
  const [showTouchpointSheet, setShowTouchpointSheet] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkStepIndex, setLinkStepIndex] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const { data: actv8Contact, isLoading, error } = useQuery({
    queryKey: ['actv8-contact', id],
    queryFn: () => getActv8Contact(id!),
    enabled: !!id,
  });

  const { data: linkedOutreaches = [] } = useQuery({
    queryKey: ['actv8-outreaches', id],
    queryFn: async () => {
      const outreaches = await getOutreachesByActv8Contact(id!);
      return outreaches.map(o => ({
        stepIndex: o.actv8_step_index ?? 0,
        outreach: o
      }));
    },
    enabled: !!id,
  });

  const { data: availableOutreaches = [], refetch: refetchAvailable } = useQuery({
    queryKey: ['contact-outreaches', actv8Contact?.contact_id],
    queryFn: async () => {
      if (!actv8Contact?.contact_id) return [];
      return getOutreachesForContact(actv8Contact.contact_id);
    },
    enabled: !!actv8Contact?.contact_id,
  });

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !actv8Contact) {
    return (
      <div className="min-h-screen bg-background">
        <Rel8Header />
        <div className="empty-state h-[60vh]">
          <p className="text-muted-foreground mb-4">Contact not found</p>
          <Link to="/rel8/actv8">
            <Button variant="outline" className="gap-2">
              Back to Actv8
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Map old database values to new terminology
  const strengthMap: Record<string, 'spark' | 'ember' | 'flame' | 'star'> = {
    thin: 'spark', growing: 'ember', solid: 'flame', thick: 'star',
    spark: 'spark', ember: 'ember', flame: 'flame', star: 'star'
  };

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
    connectionStrength: strengthMap[actv8Contact.connection_strength || 'thin'] || 'spark',
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

  const isBuildRapportPath = actv8Contact?.path?.id === 'build_rapport';

  const handlePlanTouchpoint = async (stepIndex: number) => {
    if (isBuildRapportPath && actv8Contact?.path?.steps) {
      const step = actv8Contact.path.steps[stepIndex];
      if (step && actv8Contact.contact) {
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
        
        setPreSelectedContacts([{
          id: actv8Contact.contact.id,
          name: actv8Contact.contact.name,
          email: actv8Contact.contact.email || undefined,
          organization: actv8Contact.contact.organization || undefined,
          user_id: '',
          created_at: '',
          updated_at: '',
        }]);
        
        navigate(`/rel8/wizard?actv8Id=${actv8Contact.id}&stepIndex=${stepIndex}`);
        return;
      }
    }
    
    setActiveStepIndex(stepIndex);
    setShowTouchpointSheet(true);
  };

  const handleTouchpointComplete = (data: any) => {
    console.log('Touchpoint planned:', data);
    setShowTouchpointSheet(false);
    setActiveStepIndex(null);
    toast.success('Touchpoint saved successfully');
  };

  const handleLinkOutreach = (stepIndex: number) => {
    setLinkStepIndex(stepIndex);
    setShowLinkDialog(true);
  };

  const handleOutreachLinked = () => {
    queryClient.invalidateQueries({ queryKey: ['actv8-outreaches', id] });
    queryClient.invalidateQueries({ queryKey: ['contact-outreaches', actv8Contact?.contact_id] });
    refetchAvailable();
  };

  const relationshipTypeLabels: Record<string, string> = {
    collaborator: 'Collaborator',
    mentor: 'Mentor',
    mentee: 'Mentee',
    peer: 'Peer',
    client: 'Client',
    prospect: 'Prospect',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pb-32">
      <Rel8Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6 animate-fade-in">
        {/* Profile Header Card - Same style as ContactProfile */}
        <Card className="relative overflow-hidden">
          <div className="p-4 md:p-6">
            {/* Mobile Layout */}
            <div className="md:hidden space-y-4">
              {/* Avatar Row */}
              <div className="flex items-center justify-center">
              <Avatar userId={actv8Contact.affiliatedUserId || "UXI8000"} size={100} className="ring-2 ring-primary/20" />
              </div>

              {/* Name Row */}
              <div className="text-center">
                <h1 className="text-2xl font-bold">{contact.name}</h1>
                <p className="text-muted-foreground">{contact.role} at {contact.company}</p>
              </div>

              {/* Glowing Separator */}
              <div className="relative h-px w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handlePlanTouchpoint(contact.currentStepIndex ?? 0)} variant="default" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Plan Touchpoint
                </Button>
                <Link to={`/rel8/actv8/${id}/strategy`} className="w-full">
                  <Button variant="default" size="sm" className="gap-2 w-full">
                    <Zap className="h-4 w-4" />
                    Strategy
                  </Button>
                </Link>
                <Link to={`/rel8/contacts/${contact.contactId}/edit`} className="w-full">
                  <Button variant="outline" size="sm" className="gap-2 w-full">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  onClick={() => setShowPathModal(true)}
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Change Path
                </Button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              {/* Contact Info Section */}
              <div className="flex items-start gap-6 mb-6">
                <Avatar userId={actv8Contact.affiliatedUserId || "UXI8000"} size={80} className="ring-2 ring-primary/20" />
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{contact.name}</h1>
                  <p className="text-muted-foreground">{contact.role} at {contact.company}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDistanceToNow(parseISO(contact.lastInteraction), { addSuffix: true })}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${strengthColors[contact.connectionStrength]}`}>
                      <TrendingUp className="h-4 w-4" />
                      <span>{strengthLabels[contact.connectionStrength]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glowing Separator */}
              <div className="relative h-px w-full mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm" />
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center gap-3">
                <Button onClick={() => handlePlanTouchpoint(contact.currentStepIndex ?? 0)} variant="default" className="flex-1 gap-2">
                  <Heart className="h-4 w-4" />
                  Plan Touchpoint
                </Button>
                <Link to={`/rel8/actv8/${id}/strategy`} className="flex-1">
                  <Button variant="default" className="gap-2 w-full">
                    <Zap className="h-4 w-4" />
                    Strategy
                  </Button>
                </Link>
                <Link to={`/rel8/contacts/${contact.contactId}/edit`} className="flex-1">
                  <Button variant="outline" className="gap-2 w-full">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button 
                  onClick={() => setShowPathModal(true)}
                  variant="outline" 
                  className="flex-1 gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Change Path
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Info Section */}
        {(contact.email || contact.phone) && (
          <Card className="overflow-hidden">
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact</h3>
              <div className="space-y-3">
                {contact.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                    </div>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-xs text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Connection Strength Section */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Connection Strength</h3>
            <span className={`text-sm font-medium ${strengthColors[contact.connectionStrength]}`}>
              {strengthLabels[contact.connectionStrength]}
            </span>
          </div>
          <ConnectionStrengthBar strength={contact.connectionStrength} size="lg" />
        </Card>

        {/* Notes Section */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground">{contact.vibeNotes}</p>
        </Card>

        {/* Development Path Section */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Relationship Development</h3>
          <DevelopmentPathCard
            pathId={contact.developmentPathId}
            currentStepIndex={contact.currentStepIndex}
            completedSteps={contact.completedSteps}
            linkedOutreaches={linkedOutreaches}
            availableOutreaches={availableOutreaches}
            actv8ContactId={actv8Contact.id}
            onPlanTouchpoint={handlePlanTouchpoint}
            onLinkOutreach={handleLinkOutreach}
            onAdvanceStep={handleAdvanceStep}
            onChangePath={() => setShowPathModal(true)}
          />
        </Card>

        {/* Timeline Section */}
        <Card className="p-4">
          <h3 className="text-sm font-medium mb-3">Timeline</h3>
          <DevelopmentTimeline
            interactions={contact.interactions}
            pathId={contact.developmentPathId}
            currentStepIndex={contact.currentStepIndex}
            completedSteps={contact.completedSteps}
            pathStartedAt={contact.pathStartedAt}
            linkedOutreaches={linkedOutreaches}
          />
        </Card>
      </div>

      {/* Modals */}
      <PathSelectionModal 
        open={showPathModal} 
        onOpenChange={setShowPathModal} 
        onSelectPath={handleSelectPath}
        currentPathId={contact.developmentPathId}
      />

      <Sheet open={showTouchpointSheet} onOpenChange={setShowTouchpointSheet}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto rounded-t-3xl">
          <div className="sheet-handle" />
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

      <LinkOutreachDialog
        open={showLinkDialog}
        onOpenChange={setShowLinkDialog}
        outreaches={availableOutreaches}
        actv8ContactId={actv8Contact.id}
        stepIndex={linkStepIndex}
        stepName={actv8Contact.path?.steps?.[linkStepIndex]?.name || `Step ${linkStepIndex + 1}`}
        onLinked={handleOutreachLinked}
      />

    </div>
  );
}
