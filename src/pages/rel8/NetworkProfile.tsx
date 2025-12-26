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
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ArrowLeft, Loader2, Mail, Phone, MapPin, Calendar, TrendingUp, Users, MoreVertical, Settings, MessageCircle } from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast } from "sonner";

const strengthLabels: Record<string, string> = {
  thin: 'New Connection',
  growing: 'Growing',
  solid: 'Strong Bond',
  thick: 'Core Relationship',
};

const strengthColors: Record<string, string> = {
  thin: 'text-red-500',
  growing: 'text-amber-500',
  solid: 'text-emerald-500',
  thick: 'text-primary',
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
        <div className="empty-state h-[60vh]">
          <p className="text-muted-foreground mb-4">Contact not found</p>
          <Link to="/rel8/actv8">
            <Button variant="outline" className="gap-2 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              Back to Actv8
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

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
    <div className="min-h-screen bg-background pb-32">
      {/* Header - Android style with back button */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="flex items-center gap-2 px-2 py-2">
          <Link to="/rel8/actv8" className="icon-button">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">{contact.name}</h1>
          </div>
          <button className="icon-button">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Profile Hero - Material Design style */}
      <div className="px-4 py-6">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarImage src={contact.avatar} />
              <AvatarFallback className="text-2xl bg-secondary">{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            {/* Strength indicator */}
            <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-3 border-background flex items-center justify-center ${
              contact.connectionStrength === 'thick' ? 'bg-primary' :
              contact.connectionStrength === 'solid' ? 'bg-emerald-500' :
              contact.connectionStrength === 'growing' ? 'bg-amber-500' : 'bg-red-500'
            }`}>
              <TrendingUp className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Name & Role */}
          <h2 className="text-xl font-bold mb-1">{contact.name}</h2>
          <p className="text-muted-foreground mb-3">{contact.role} at {contact.company}</p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="secondary" className="rounded-lg">{contact.industry}</Badge>
            <Badge variant="outline" className="rounded-lg">
              {relationshipTypeLabels[contact.relationshipType] || contact.relationshipType}
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
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

        {/* Quick Actions */}
        <div className="flex justify-center gap-3 mt-6">
          <Button 
            onClick={() => handlePlanTouchpoint(contact.currentStepIndex ?? 0)}
            className="rounded-xl gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Plan Touchpoint
          </Button>
          <Link to={`/rel8/actv8/${id}/strategy`}>
            <Button variant="outline" className="rounded-xl gap-2">
              <Settings className="h-4 w-4" />
              Strategy
            </Button>
          </Link>
        </div>
      </div>

      {/* Sections - Android Settings style */}
      <div className="px-4 space-y-4">
        
        {/* Contact Info Section */}
        {(contact.email || contact.phone) && (
          <div className="md-surface-1 overflow-hidden">
            <div className="section-header">Contact</div>
            {contact.email && (
              <div className="settings-item">
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
              <div className="settings-item">
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
        )}

        {/* Connection Strength Section */}
        <div className="md-surface-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Connection Strength</h3>
            <span className={`text-sm font-medium ${strengthColors[contact.connectionStrength]}`}>
              {strengthLabels[contact.connectionStrength]}
            </span>
          </div>
          <ConnectionStrengthBar strength={contact.connectionStrength} size="lg" />
        </div>

        {/* Notes Section */}
        <div className="md-surface-1 p-4">
          <h3 className="text-sm font-medium mb-2">Notes</h3>
          <p className="text-sm text-muted-foreground">{contact.vibeNotes}</p>
        </div>

        {/* Development Path Section */}
        <div className="md-surface-1 p-4">
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
        </div>

        {/* Timeline Section */}
        <div className="md-surface-1 p-4">
          <h3 className="text-sm font-medium mb-3">Timeline</h3>
          <DevelopmentTimeline
            interactions={contact.interactions}
            pathId={contact.developmentPathId}
            currentStepIndex={contact.currentStepIndex}
            completedSteps={contact.completedSteps}
            pathStartedAt={contact.pathStartedAt}
            linkedOutreaches={linkedOutreaches}
          />
        </div>
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

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <Rel8OnlyNavigation />
      </div>
    </div>
  );
}
