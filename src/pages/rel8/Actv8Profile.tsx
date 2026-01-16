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
import { Loader2, ArrowLeft, ShieldAlert, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorType = 'not-found' | 'not-authorized' | 'error' | null;

export default function Actv8Profile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [actv8Contact, setActv8Contact] = useState<any>(null);
  const [contact, setContact] = useState<any>(null);
  const [completedPathInstances, setCompletedPathInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<ErrorType>(null);
  const [openSection, setOpenSection] = useState<string>("level");
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: stepInstances = [], refetch: refetchSteps } = useStepInstances(actv8Contact?.id);

  // Fetch actv8 contact and related data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setErrorType('not-found');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setErrorType(null);

      try {
        // Check authentication first
        const { data: { session } } = await supabase.auth.getSession();
        console.log("[Actv8Profile] Session check:", session ? `User: ${session.user.id}` : "No session");
        
        if (!session) {
          console.log("[Actv8Profile] No session - redirecting to auth");
          setErrorType('not-authorized');
          setLoading(false);
          return;
        }

        console.log("[Actv8Profile] Fetching actv8 contact with id:", id);

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

        console.log("[Actv8Profile] Query result:", { actv8Data, actv8Error });

        if (actv8Error) {
          console.error("[Actv8Profile] Supabase error:", actv8Error);
          if (actv8Error.code === 'PGRST116') {
            // No rows returned - could be RLS blocking or doesn't exist
            setErrorType('not-found');
          } else {
            setErrorType('error');
          }
          setLoading(false);
          return;
        }

        if (!actv8Data) {
          console.log("[Actv8Profile] No data returned (likely RLS)");
          setErrorType('not-authorized');
          setLoading(false);
          return;
        }

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
        console.error("[Actv8Profile] Unexpected error:", error);
        setErrorType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, refreshKey]);

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

  // Error states with helpful UI
  if (errorType === 'not-authorized') {
    return (
      <div className="min-h-screen bg-background">
        <Rel8OnlyNavigation />
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <ShieldAlert className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to view this contact, or you need to sign in.
          </p>
          <Button onClick={() => navigate("/rel8/actv8")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Network
          </Button>
        </div>
      </div>
    );
  }

  if (errorType === 'not-found') {
    return (
      <div className="min-h-screen bg-background">
        <Rel8OnlyNavigation />
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <UserX className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Contact Not Found</h2>
          <p className="text-muted-foreground">
            This contact may have been removed or doesn't exist.
          </p>
          <Button onClick={() => navigate("/rel8/actv8")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Network
          </Button>
        </div>
      </div>
    );
  }

  if (errorType === 'error' || !actv8Contact || !contact) {
    return (
      <div className="min-h-screen bg-background">
        <Rel8OnlyNavigation />
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <p className="text-muted-foreground">Something went wrong loading this contact.</p>
          <Button onClick={() => navigate("/rel8/actv8")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Network
          </Button>
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
