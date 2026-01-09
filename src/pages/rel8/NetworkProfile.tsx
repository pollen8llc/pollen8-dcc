import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getActv8Contact, deactivateContact, updateContactProgress, getDevelopmentPath } from "@/services/actv8Service";
import { getOutreachesByActv8Contact, getOutreachesForContact, syncOutreachesToActv8 } from "@/services/rel8t/outreachService";
import { supabase } from "@/integrations/supabase/client";
import { ConnectionStrengthBar } from "@/components/rel8t/network/ConnectionStrengthBar";
import { DevelopmentPathCard } from "@/components/rel8t/network/DevelopmentPathCard";
import { DevelopmentTimeline } from "@/components/rel8t/network/DevelopmentTimeline";
import { RelationshipLevelAccordion } from "@/components/rel8t/network/RelationshipLevelAccordion";
// Outreach linking removed - outreaches are tracked via step instances
import { useContactAnalysis } from "@/hooks/useContactAnalysis";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UnifiedAvatar } from "@/components/ui/unified-avatar";
import { 
  Loader2, Mail, Phone, Calendar, TrendingUp, Settings, 
  MessageCircle, Edit, Target, Zap, BarChart3, Star,
  ThumbsUp, ThumbsDown, Minus, TrendingDown
} from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";
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
  flame: 'text-[#00eada]',
  star: 'text-[#00eada] font-bold',
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
  
  

  const { data: actv8Contact, isLoading, error } = useQuery({
    queryKey: ['actv8-contact', id],
    queryFn: () => getActv8Contact(id!),
    enabled: !!id,
  });

  const { data: analysis, isLoading: analysisLoading } = useContactAnalysis(actv8Contact?.contact_id);

  const { data: linkedOutreaches = [] } = useQuery({
    queryKey: ['actv8-outreaches', id],
    queryFn: async () => {
      // First sync any unlinked outreaches to this actv8 contact
      await syncOutreachesToActv8(id!);
      
      const outreaches = await getOutreachesByActv8Contact(id!);
      return outreaches.map(o => ({
        stepIndex: o.actv8_step_index ?? 0,
        outreach: o
      }));
    },
    enabled: !!id,
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
    pathTier: actv8Contact.path_tier || 1,
    pathHistory: actv8Contact.path_history || [],
    skippedPaths: actv8Contact.skipped_paths || [],
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

  const handlePlanTouchpoint = async (stepIndex: number) => {
    if (actv8Contact?.path?.steps) {
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
      }
    }
  };


  const relationshipTypeLabels: Record<string, string> = {
    collaborator: 'Collaborator',
    mentor: 'Mentor',
    mentee: 'Mentee',
    peer: 'Peer',
    client: 'Client',
    prospect: 'Prospect',
  };

  const outcomeIcons: Record<string, React.ReactNode> = {
    positive: <ThumbsUp className="h-3 w-3 text-emerald-500" />,
    neutral: <Minus className="h-3 w-3 text-amber-500" />,
    negative: <ThumbsDown className="h-3 w-3 text-red-500" />,
  };

  const rapportIcons: Record<string, React.ReactNode> = {
    strengthened: <TrendingUp className="h-3 w-3 text-emerald-500" />,
    maintained: <Minus className="h-3 w-3 text-amber-500" />,
    declined: <TrendingDown className="h-3 w-3 text-red-500" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pb-32">
      <Rel8Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6 animate-fade-in">
        {/* Unified Profile Header Card */}
        <Card className="glass-morphism bg-card/80 backdrop-blur-sm border-primary/20 overflow-hidden">
          <div className="p-4 md:p-6 space-y-6">
            {/* Top Section: Avatar, Name, Basic Info, and Edit */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex justify-center md:block">
                <UnifiedAvatar 
                  userId={actv8Contact.affiliatedUserId || actv8Contact.contact_id} 
                  size={100} 
                  className="ring-4 ring-primary/20 shadow-xl" 
                  isContactId={!actv8Contact.affiliatedUserId} 
                />
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{contact.name}</h1>
                    <p className="text-muted-foreground font-medium">
                      {contact.role} {contact.company && <span className="opacity-70">at {contact.company}</span>}
                    </p>
                  </div>
                  <Link to={`/rel8/contacts/${contact.contactId}/edit`}>
                    <Button variant="outline" size="sm" className="gap-2 h-9 rounded-full px-4 hover:bg-primary/10">
                      <Edit className="h-3.5 w-3.5" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 mt-2">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                      <Mail className="h-4 w-4" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                      <Phone className="h-4 w-4" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Last touch: {formatDistanceToNow(parseISO(contact.lastInteraction), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section: Insights & Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Relationship Summary */}
              <div className="md:col-span-2 p-4 rounded-2xl bg-muted/30 border border-border/50 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <BarChart3 className="h-3.5 w-3.5" />
                  Insight Summary
                </div>
                <p className="text-sm leading-relaxed">
                  {analysis?.summary || "No activity recorded yet."}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 md:col-span-2">
                <div className="p-3 rounded-2xl bg-muted/20 border border-border/30 text-center">
                  <div className="text-2xl font-bold text-primary">{analysis?.totalOutreaches || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Total Outreaches</div>
                </div>
                <div className="p-3 rounded-2xl bg-muted/20 border border-border/30 text-center">
                  <div className="text-2xl font-bold text-primary">{analysis?.engagementScore || 0}%</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Engagement</div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Connection Strength */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Zap className={`h-4 w-4 ${strengthColors[contact.connectionStrength]}`} />
                  <span className="text-sm font-bold uppercase tracking-wider">Connection Strength</span>
                </div>
                <Badge variant="outline" className={`font-bold border-2 ${strengthColors[contact.connectionStrength]}`}>
                  {strengthLabels[contact.connectionStrength]}
                </Badge>
              </div>
              <ConnectionStrengthBar strength={contact.connectionStrength} size="lg" className="h-3" />
            </div>
          </div>
        </Card>

        {/* Relationship Level Accordion */}
        <RelationshipLevelAccordion
          contactName={contact.name}
          actv8ContactId={actv8Contact.id}
          currentTier={contact.pathTier}
          skippedPaths={contact.skippedPaths}
          pathHistory={contact.pathHistory}
          currentPathId={contact.developmentPathId}
          currentPathName={actv8Contact.path?.name}
          hasCurrentPath={!!contact.developmentPathId}
          isPathComplete={actv8Contact.path?.steps && contact.currentStepIndex >= actv8Contact.path.steps.length}
          onSelectPath={handleSelectPath}
        />

        {/* Development Path Section */}
        <Card className="p-4 glass-morphism border-primary/10">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Relationship Development
          </h3>
          <DevelopmentPathCard
            pathId={contact.developmentPathId}
            currentStepIndex={contact.currentStepIndex}
            completedSteps={contact.completedSteps}
            linkedOutreaches={linkedOutreaches}
            actv8ContactId={actv8Contact.id}
            pathTier={contact.pathTier}
            pathHistory={contact.pathHistory}
            skippedPaths={contact.skippedPaths}
            onPlanTouchpoint={handlePlanTouchpoint}
          />
        </Card>

        {/* Timeline Section */}
        <Card className="p-4 glass-morphism border-primary/10">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Timeline & History
          </h3>
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

    </div>
  );
}
