import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getActv8Contact, getCompletedPathInstances, LevelSwitch } from "@/services/actv8Service";
import { getOutreachesByActv8Contact } from "@/services/rel8t/outreachService";
import { supabase } from "@/integrations/supabase/client";
import { Accordion } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStepInstances } from "@/hooks/useRelationshipLevels";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { ProfileHeaderCard } from "@/components/rel8t/actv8/ProfileHeaderCard";
import { RelationshipLevelSection } from "@/components/rel8t/actv8/RelationshipLevelSection";
import { PathSelectionSection } from "@/components/rel8t/actv8/PathSelectionSection";
import { DevelopmentProgressSection } from "@/components/rel8t/actv8/DevelopmentProgressSection";
import { CompletedPathsHistory } from "@/components/rel8t/actv8/CompletedPathsHistory";
import { OutreachList } from "@/components/rel8t/actv8/OutreachList";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CompletedPathInstance } from "@/components/rel8t/network/TierProgressBar";

export default function NetworkProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Cascading accordion state
  const [openSection, setOpenSection] = useState<string>("level");
  const [refreshKey, setRefreshKey] = useState(0);
  const hasInitializedAccordion = useRef(false);

  // Fetch actv8 contact data
  const {
    data: actv8Contact,
    isLoading,
    error,
    refetch: refetchActv8Contact
  } = useQuery({
    queryKey: ['actv8-contact', id],
    queryFn: () => getActv8Contact(id!),
    enabled: !!id
  });

  // Fetch the underlying contact data
  const { data: contact } = useQuery({
    queryKey: ['contact', actv8Contact?.contact_id],
    queryFn: async () => {
      if (!actv8Contact?.contact_id) return null;
      const { data } = await supabase
        .from('rms_contacts')
        .select('*')
        .eq('id', actv8Contact.contact_id)
        .single();
      return data;
    },
    enabled: !!actv8Contact?.contact_id
  });

  // Fetch completed path instances for history tab
  const { data: completedPathInstances = [], refetch: refetchPathInstances } = useQuery({
    queryKey: ['completed-path-instances', id],
    queryFn: () => getCompletedPathInstances(id!),
    enabled: !!id
  });

  // Fetch step instances for development progress
  const { data: stepInstances = [], refetch: refetchSteps } = useStepInstances(actv8Contact?.id);

  // Fetch outreaches for current path instance
  const { data: linkedOutreaches = [], refetch: refetchOutreaches } = useQuery({
    queryKey: ['actv8-outreaches', id, actv8Contact?.current_path_instance_id],
    queryFn: async () => {
      const outreaches = await getOutreachesByActv8Contact(id!, actv8Contact?.current_path_instance_id);
      return outreaches;
    },
    enabled: !!id && !!actv8Contact,
    refetchOnMount: true,
    staleTime: 0
  });

  // Set smart default accordion based on onboarding state
  useEffect(() => {
    if (actv8Contact && !hasInitializedAccordion.current) {
      hasInitializedAccordion.current = true;
      
      if (!actv8Contact.relationship_level) {
        setOpenSection("level");
      } else if (!actv8Contact.development_path_id) {
        setOpenSection("path");
      } else {
        setOpenSection("progress");
      }
    }
  }, [actv8Contact]);

  // Real-time subscriptions for updates
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`actv8-profile-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rms_outreach' },
        () => {
          refetchOutreaches();
          queryClient.invalidateQueries({ queryKey: ['outreaches'] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rms_actv8_contacts', filter: `id=eq.${id}` },
        () => {
          refetchActv8Contact();
          refetchSteps();
          refetchPathInstances();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rms_actv8_step_instances' },
        () => {
          refetchSteps();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, refetchOutreaches, refetchActv8Contact, refetchSteps, refetchPathInstances, queryClient]);

  // Cascading accordion handlers
  const handleLevelChanged = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    refetchSteps();
    refetchActv8Contact();
    queryClient.invalidateQueries({ queryKey: ['outreaches'] });
    setOpenSection("path");
  }, [refetchSteps, refetchActv8Contact, queryClient]);

  const handlePathSelected = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    refetchSteps();
    refetchActv8Contact();
    setOpenSection("progress");
  }, [refetchSteps, refetchActv8Contact]);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    refetchSteps();
    refetchOutreaches();
    refetchActv8Contact();
    refetchPathInstances();
  }, [refetchSteps, refetchOutreaches, refetchActv8Contact, refetchPathInstances]);

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
        <Rel8OnlyNavigation />
        <div className="empty-state h-[60vh]">
          <p className="text-muted-foreground mb-4">Contact not found</p>
          <Link to="/rel8/actv8">
            <Button variant="outline" className="gap-2">
              Back to Network
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const contactData = actv8Contact.contact || contact;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 pb-32">
      <Rel8OnlyNavigation />
      
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6 animate-fade-in">
        {/* Profile Header Card */}
        <ProfileHeaderCard 
          contact={contactData}
          actv8Contact={actv8Contact}
        />

        {/* Cascading Accordions */}
        <Accordion 
          type="single" 
          collapsible 
          value={openSection} 
          onValueChange={setOpenSection}
          className="w-full space-y-3"
          key={refreshKey}
        >
          {/* Relationship Level Section */}
          <RelationshipLevelSection 
            actv8ContactId={actv8Contact.id}
            currentLevel={actv8Contact.relationship_level || 0}
            levelSwitches={(actv8Contact.level_switches as LevelSwitch[]) || []}
            onLevelChanged={handleLevelChanged}
          />

          {/* Path Selection Section */}
          <PathSelectionSection 
            actv8ContactId={actv8Contact.id}
            currentTier={actv8Contact.path_tier || 1}
            currentPathId={actv8Contact.development_path_id || null}
            onPathSelected={handlePathSelected}
          />

          {/* Development Progress Section */}
          <DevelopmentProgressSection
            actv8ContactId={actv8Contact.id}
            contactId={actv8Contact.contact_id}
            pathId={actv8Contact.development_path_id || null}
            pathInstanceId={actv8Contact.current_path_instance_id}
            currentTier={actv8Contact.path_tier || 1}
            currentStepIndex={actv8Contact.current_step_index || 0}
            stepInstances={stepInstances}
            completedPathInstances={completedPathInstances as CompletedPathInstance[]}
            onStepAction={handleRefresh}
          />
        </Accordion>

        {/* Active Outreach / Completed Paths Tabs */}
        <Tabs defaultValue="outreach" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="outreach">Active Outreach</TabsTrigger>
            <TabsTrigger value="history">Completed Paths</TabsTrigger>
          </TabsList>
          
          <TabsContent value="outreach" className="mt-4">
            <OutreachList 
              actv8ContactId={actv8Contact.id}
              contactId={actv8Contact.contact_id}
              pathInstanceId={actv8Contact.current_path_instance_id}
            />
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <CompletedPathsHistory 
              actv8ContactId={actv8Contact.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
