
import { supabase } from "@/integrations/supabase/client";
import { logAuditAction } from "./auditService";
import { toast } from "@/hooks/use-toast";

export interface InviteData {
  id?: string;
  creator_id: string;
  community_id?: string;
  code: string;
  link_id: string;
  max_uses?: number | null;
  used_count: number;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
}

/**
 * Generate a unique invite code
 */
export const generateUniqueCode = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('generate_unique_invite_code');
    
    if (error) {
      console.error("Error generating unique code:", error);
      toast({
        title: "Error",
        description: `Could not generate invite code: ${error.message}`,
        variant: "destructive",
      });
      return "";
    }
    
    return data;
  } catch (error) {
    console.error("Exception in generateUniqueCode:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Unexpected error generating invite code",
      variant: "destructive",
    });
    return "";
  }
};

/**
 * Generate a unique link ID for an invite
 */
export const generateUniqueLinkId = (code: string): string => {
  // Use the code as-is since it's already unique and URL-safe
  return code;
};

/**
 * Create a new invite
 */
export const createInvite = async (
  creatorId: string,
  communityId?: string,
  maxUses?: number,
  expiresAt?: string
): Promise<InviteData | null> => {
  try {
    // Generate a unique code
    const code = await generateUniqueCode();
    if (!code) {
      return null;
    }
    
    // Generate a link ID based on the code
    const linkId = generateUniqueLinkId(code);
    
    const inviteData: any = {
      creator_id: creatorId,
      code: code,
      link_id: linkId,
      max_uses: maxUses || null,
      expires_at: expiresAt || null,
      is_active: true,
      used_count: 0
    };
    
    const { data, error } = await (supabase as any)
      .from('invites')
      .insert(inviteData)
      .select('*')
      .single();
      
    if (error) {
      console.error("Error creating invite:", error);
      toast({
        title: "Error",
        description: "Could not create invite",
        variant: "destructive",
      });
      return null;
    }
    
    await logAuditAction({
      action: 'create_invite',
      details: { 
        invite_id: data.id,
        code: code,
        max_uses: maxUses
      }
    });
    
    return (data as any) || null;
  } catch (error) {
    console.error("Exception in createInvite:", error);
    return null;
  }
};

/**
 * Get invites created by a specific user
 */
export const getInvitesByCreator = async (creatorId: string): Promise<InviteData[]> => {
  try {
  const { data, error } = await (supabase as any)
    .from('invites')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching invites:", error);
      return [];
    }
    
    return (data as any) || [];
  } catch (error) {
    console.error("Exception in getInvitesByCreator:", error);
    return [];
  }
};

/**
 * Get invite by code
 */
export const getInviteByCode = async (code: string): Promise<InviteData | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('invites')
      .select('*')
      .eq('code', code)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching invite by code:", error);
      return null;
    }
    
    return (data as any) || null;
  } catch (error) {
    console.error("Exception in getInviteByCode:", error);
    return null;
  }
};

/**
 * Get invite by link ID
 */
export const getInviteByLinkId = async (linkId: string): Promise<InviteData | null> => {
  try {
    const { data, error } = await (supabase as any)
      .from('invites')
      .select('*')
      .eq('link_id', linkId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching invite by link ID:", error);
      return null;
    }
    
    return (data as any) || null;
  } catch (error) {
    console.error("Exception in getInviteByLinkId:", error);
    return null;
  }
};

/**
 * Invalidate an invite (mark as inactive)
 */
export const invalidateInvite = async (inviteId: string): Promise<boolean> => {
  try {
    const { error } = await (supabase as any)
      .from('invites')
      .update({ is_active: false })
      .eq('id', inviteId);
      
    if (error) {
      console.error("Error invalidating invite:", error);
      toast({
        title: "Error",
        description: "Could not invalidate invite",
        variant: "destructive",
      });
      return false;
    }
    
    await logAuditAction({
      action: 'invalidate_invite',
      details: { invite_id: inviteId }
    });
    
    return true;
  } catch (error) {
    console.error("Exception in invalidateInvite:", error);
    return false;
  }
};

/**
 * Validate if an invite is still valid
 */
export const validateInvite = async (inviteId: string): Promise<boolean> => {
  try {
    const { data, error } = await (supabase as any)
      .from('invites')
      .select('*')
      .eq('id', inviteId)
      .single();
      
    if (error || !data) {
      console.error("Error validating invite:", error);
      return false;
    }
    
    // Check if invite is active
    if (!(data as any).is_active) {
      return false;
    }
    
    // Check if invite has expired
    if ((data as any).expires_at && new Date((data as any).expires_at) < new Date()) {
      return false;
    }
    
    // Check if invite has reached max uses
    if ((data as any).max_uses !== null && (data as any).used_count >= (data as any).max_uses) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in validateInvite:", error);
    return false;
  }
};

/**
 * Record the use of an invite via the public microsite
 */
export const recordInviteUse = async (
  code: string, 
  visitorName: string,
  visitorEmail: string,
  visitorPhone?: string,
  visitorMessage?: string
): Promise<string | null> => {
  try {
    // Call the database function to record usage and create contact
    const { data, error } = await supabase.rpc('use_invite_link', {
      p_invite_code: code,
      p_visitor_name: visitorName,
      p_visitor_email: visitorEmail,
      p_visitor_phone: visitorPhone || null,
      p_visitor_tags: visitorMessage ? [visitorMessage] : null
    });

    if (error) {
      console.error("Error recording invite use:", error);
      throw new Error(error.message);
    }

    return data as string;
  } catch (error) {
    console.error("Exception in recordInviteUse:", error);
    throw error;
  }
};
