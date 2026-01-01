import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getActv8ContactByContactId } from "@/services/actv8Service";
import { getOrCreateContactEvaluation } from "@/services/evalu8Service";

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
  engagementScore: number;
  notesCount: number;
  channelStats: Record<string, number>;
}

const generateSummary = (
  completedOutreaches: number,
  pendingOutreaches: number,
  engagementScore: number,
  connectionStrength: string,
  lastOutreachAt: string | null
): string => {
  const parts: string[] = [];

  if (lastOutreachAt) {
    const daysSince = Math.floor(
      (Date.now() - new Date(lastOutreachAt).getTime()) / (1000 * 60 * 60 * 24)
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

  const strengthLabels: Record<string, string> = {
    cold: "Connection is cold",
    warm: "Connection is warming",
    hot: "Connection is strong",
    star: "Connection is excellent"
  };
  if (connectionStrength) {
    parts.push(strengthLabels[connectionStrength] || "");
  }

  if (engagementScore > 0) {
    parts.push(`Engagement: ${engagementScore}%.`);
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
          engagementScore: 0,
          notesCount: 0,
          channelStats: {},
        };
      }

      // Fetch evalu8 stats from pre-computed table
      const evalu8 = await getOrCreateContactEvaluation(contactId);
      
      const totalOutreaches = evalu8?.total_outreach_count || 0;
      const completedOutreaches = evalu8?.completed_outreach_count || 0;
      const pendingOutreaches = evalu8?.pending_outreach_count || 0;
      const engagementScore = evalu8?.engagement_score || 0;
      const connectionStrength = evalu8?.connection_strength || 'cold';
      const channelStats = evalu8?.channel_stats || {};
      const notesCount = evalu8?.total_notes_count || 0;

      // Fetch Actv8 status for path details
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
        engagementScore,
        connectionStrength,
        evalu8?.last_outreach_at || null
      );

      return {
        totalOutreaches,
        completedOutreaches,
        pendingOutreaches,
        latestOutreachNotes: [],
        actv8Status,
        latestInteraction,
        summary,
        engagementScore,
        notesCount,
        channelStats,
      };
    },
    enabled: !!contactId,
    staleTime: 1000 * 60, // 1 minute
  });
};
