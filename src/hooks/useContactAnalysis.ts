import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getActv8ContactByContactId } from "@/services/actv8Service";
import { getOutreachesForContact } from "@/services/rel8t/outreachService";

export interface ContactAnalysis {
  totalOutreaches: number;
  completedOutreaches: number;
  pendingOutreaches: number;
  latestOutreachNotes: string[];
  actv8Status: {
    isActive: boolean;
    pathName: string;
    currentStep: number;
    totalSteps: number;
    connectionStrength: string;
    lastTouchpoint: string | null;
  } | null;
  latestInteraction: {
    date: string;
    warmth: string;
    topics: string;
  } | null;
  summary: string;
}

const generateSummary = (
  completedOutreaches: number,
  pendingOutreaches: number,
  actv8Status: ContactAnalysis["actv8Status"],
  latestInteraction: ContactAnalysis["latestInteraction"]
): string => {
  const parts: string[] = [];

  if (latestInteraction) {
    const daysSince = Math.floor(
      (Date.now() - new Date(latestInteraction.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince === 0) {
      parts.push("Last spoke today.");
    } else if (daysSince === 1) {
      parts.push("Last spoke yesterday.");
    } else {
      parts.push(`Last spoke ${daysSince} days ago.`);
    }
  }

  if (completedOutreaches > 0) {
    parts.push(`${completedOutreaches} completed ${completedOutreaches === 1 ? 'meeting' : 'meetings'}.`);
  }

  if (actv8Status?.isActive) {
    parts.push(`On ${actv8Status.pathName} path (Step ${actv8Status.currentStep + 1}/${actv8Status.totalSteps}).`);
    
    const strengthLabels: Record<string, string> = {
      spark: "Connection is new",
      ember: "Connection is warming",
      flame: "Connection is strong",
      star: "Connection is excellent"
    };
    parts.push(strengthLabels[actv8Status.connectionStrength] || "");
  }

  if (pendingOutreaches > 0) {
    parts.push(`${pendingOutreaches} pending ${pendingOutreaches === 1 ? 'outreach' : 'outreaches'}.`);
  }

  return parts.filter(Boolean).join(" ") || "No activity recorded yet.";
};

export const useContactAnalysis = (contactId: string | undefined) => {
  return useQuery({
    queryKey: ["contact-analysis", contactId],
    queryFn: async (): Promise<ContactAnalysis> => {
      if (!contactId) {
        return {
          totalOutreaches: 0,
          completedOutreaches: 0,
          pendingOutreaches: 0,
          latestOutreachNotes: [],
          actv8Status: null,
          latestInteraction: null,
          summary: "No activity recorded yet.",
        };
      }

      // Fetch outreaches for this contact
      const outreaches = await getOutreachesForContact(contactId);
      const completedOutreaches = outreaches.filter(o => o.status === 'completed').length;
      const pendingOutreaches = outreaches.filter(o => o.status === 'pending').length;
      
      // Get notes from completed outreaches
      const latestOutreachNotes = outreaches
        .filter(o => (o as any).notes)
        .map(o => (o as any).notes)
        .slice(0, 3);

      // Fetch Actv8 status
      let actv8Status: ContactAnalysis["actv8Status"] = null;
      try {
        const actv8Contact = await getActv8ContactByContactId(contactId);
        if (actv8Contact && actv8Contact.status === 'active') {
          actv8Status = {
            isActive: true,
            pathName: actv8Contact.path?.name || 'Build Rapport',
            currentStep: actv8Contact.current_step_index || 0,
            totalSteps: actv8Contact.path?.steps?.length || 4,
            connectionStrength: actv8Contact.connection_strength || 'spark',
            lastTouchpoint: actv8Contact.last_touchpoint_at || null,
          };
        }
      } catch (e) {
        console.error("Error fetching actv8 status:", e);
      }

      // Fetch latest interaction from actv8_interactions
      let latestInteraction: ContactAnalysis["latestInteraction"] = null;
      if (actv8Status) {
        try {
          const { data: interactions } = await supabase
            .from("rms_actv8_interactions")
            .select("interaction_date, warmth, topics")
            .eq("actv8_contact_id", contactId)
            .order("interaction_date", { ascending: false })
            .limit(1);
          
          if (interactions && interactions.length > 0) {
            latestInteraction = {
              date: interactions[0].interaction_date,
              warmth: interactions[0].warmth || '',
              topics: interactions[0].topics || '',
            };
          }
        } catch (e) {
          console.error("Error fetching interactions:", e);
        }
      }

      const summary = generateSummary(
        completedOutreaches,
        pendingOutreaches,
        actv8Status,
        latestInteraction
      );

      return {
        totalOutreaches: outreaches.length,
        completedOutreaches,
        pendingOutreaches,
        latestOutreachNotes,
        actv8Status,
        latestInteraction,
        summary,
      };
    },
    enabled: !!contactId,
    staleTime: 1000 * 60, // 1 minute
  });
};
