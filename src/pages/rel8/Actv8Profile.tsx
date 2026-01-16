import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStepInstances } from "@/hooks/useRelationshipLevels";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { ProfileHeaderCard } from "@/components/rel8t/actv8/ProfileHeaderCard";
import { RelationshipLevelSection } from "@/components/rel8t/actv8/RelationshipLevelSection";
import { PathSelectionSection } from "@/components/rel8t/actv8/PathSelectionSection";
import { DevelopmentProgressSection } from "@/components/rel8t/actv8/DevelopmentProgressSection";
import { CompletedPathsHistory } from "@/components/rel8t/actv8/CompletedPathsHistory";
import OutreachList from "@/components/rel8t/OutreachList";
import { Loader2 } from "lucide-react";

export default function Actv8Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [actv8Contact, setActv8Contact] = useState<any>(null);
  const [contact, setContact] = useState<any>(null);
  const [completedPathInstances, setCompletedPathInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string>("level"); // Cascading accordion state
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render key

  const { data: stepInstances = [], refetch: refetchSteps } = useStepInstances(actv8Contact?.id);

  // Fetch actv8 contact and related data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        // Fetch actv8 contact
        const { data: actv8Data, error: actv8Error } = await supabase
          .from("rms_actv8_contacts")
          .select(`
            *,
            contact:rms_contacts(*),
            path:rms_actv8_paths(*)
          `)
          .eq("id", id)
          .single();

        if (actv8Error) throw actv8Error;

        setActv8Contact(actv8Data);
        setContact(actv8Data.contact);

        // Fetch completed path instances
        const { data: instances } = await supabase
          .from("rms_actv8_path_instances")
          .select(`
            id,
            path_id,
            status,
            started_at,
            ended_at,
            rms_actv8_paths!inner(tier)
          `)
          .eq("actv8_contact_id", id)
          .in("status", ["ended", "skipped"]);

        const mappedInstances = (instances || []).map((i: any) => ({
          id: i.id,
          path_id: i.path_id,
          status: i.status,
          tier: i.rms_actv8_paths?.tier,
        }));

        setCompletedPathInstances(mappedInstances);
      } catch (error) {
        console.error("Error fetching actv8 profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, refreshKey]); // Add refreshKey to re-fetch on level change

  // Real-time subscription for outreach changes
  useEffect(() => {
    if (!actv8Contact?.id) return;

    const channel = supabase
      .channel(`actv8-profile-${actv8Contact.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rms_outreach" },
        () => {
          refetchSteps();
          queryClient.invalidateQueries({ queryKey: ["outreaches"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rms_actv8_contacts" },
        () => {
          // Refetch when contact data changes (level switches, etc.)
          setRefreshKey(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [actv8Contact?.id, refetchSteps, queryClient]);

  // Handle level change - refetch data and open path section
  const handleLevelChanged = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    refetchSteps();
    queryClient.invalidateQueries({ queryKey: ["outreaches"] });
    // Cascade to path selection after level change
    setOpenSection("path");
  }, [refetchSteps, queryClient]);

  // Handle path selection - cascade to progress section
  const handlePathSelected = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    refetchSteps();
    queryClient.invalidateQueries({ queryKey: ["outreaches"] });
    setOpenSection("progress");
  }, [refetchSteps, queryClient]);

  const handleRefresh = useCallback(() => {
    refetchSteps();
    queryClient.invalidateQueries({ queryKey: ["outreaches"] });
  }, [refetchSteps, queryClient]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Rel8OnlyNavigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!actv8Contact || !contact) {
    return (
      <div className="min-h-screen bg-background">
        <Rel8OnlyNavigation />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Contact not found</p>
        </div>
      </div>
    );
  }

  const currentLevel = actv8Contact.relationship_level || 1;
  const currentTier = actv8Contact.path?.tier || actv8Contact.path_tier || 1;
  const levelSwitches = (actv8Contact.level_switches as any[]) || [];

  return (
    <div className="min-h-screen bg-background">
      <Rel8OnlyNavigation />
      
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <ProfileHeaderCard
          contact={contact}
          actv8Contact={actv8Contact}
          onBack={() => navigate("/rel8/actv8")}
        />

        {/* Cascading Accordion Sections */}
        <Accordion
          type="single"
          collapsible
          value={openSection}
          onValueChange={setOpenSection}
          className="space-y-4"
        >
          {/* Relationship Level Accordion */}
          <RelationshipLevelSection
            actv8ContactId={actv8Contact.id}
            currentLevel={currentLevel}
            levelSwitches={levelSwitches}
            onLevelChanged={handleLevelChanged}
            key={`level-${refreshKey}`}
          />

          {/* Path Selection Accordion */}
          <PathSelectionSection
            actv8ContactId={actv8Contact.id}
            currentTier={currentTier}
            currentPathId={actv8Contact.development_path_id}
            onPathSelected={handlePathSelected}
            key={`path-${refreshKey}`}
          />

          {/* Development Progress Accordion */}
          <DevelopmentProgressSection
            actv8ContactId={actv8Contact.id}
            contactId={contact.id}
            pathId={actv8Contact.development_path_id}
            pathInstanceId={actv8Contact.current_path_instance_id}
            currentTier={currentTier}
            currentStepIndex={actv8Contact.current_step_index || 0}
            stepInstances={stepInstances}
            completedPathInstances={completedPathInstances}
            onStepAction={handleRefresh}
            key={`progress-${refreshKey}`}
          />
        </Accordion>

        {/* Outreach & History Tabs */}
        <Tabs defaultValue="outreach" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="outreach">Active Outreach</TabsTrigger>
            <TabsTrigger value="history">Completed Paths</TabsTrigger>
          </TabsList>
          <TabsContent value="outreach" className="mt-4">
            <OutreachList defaultTab="all" />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <CompletedPathsHistory actv8ContactId={actv8Contact.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
