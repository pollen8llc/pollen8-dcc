
import { supabase } from "@/integrations/supabase/client";

interface AuditLogEntry {
  action: string;
  targetUserId?: string;
  details?: Record<string, any>;
}

/**
 * Logs an audit action for tracking changes
 */
export const logAuditAction = async (entry: AuditLogEntry): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Cannot log audit action: User not authenticated");
      return;
    }
    
    // Use the log_audit_action function from the database
    const { error } = await supabase.rpc('log_audit_action', {
      action_name: entry.action,
      performer_id: user.id,
      target_id: entry.targetUserId || null,
      action_details: entry.details || {}
    });

    if (error) {
      console.error("Error logging audit action:", error);
    }
  } catch (error) {
    console.error("Error in audit logging:", error);
  }
};
