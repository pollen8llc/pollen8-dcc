
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
        description: "Could not generate invite code",
        variant: "destructive",
      });
      return "";
    }
    
    return data;
  } catch (error) {
    console.error("Exception in generateUniqueCode:", error);
    return "";
  }
};

/**
 * Generate a unique link ID for an invite
 */
export const generateUniqueLinkId = (code: string): string => {
  // Convert the code to base64 and remove any characters that would be problematic in a URL
  return Buffer.from(code).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
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
    
    const { data, error } = await (supabase as any)
      .from('invites')
      .insert({
        creator_id: creatorId,
        community_id: communityId,
        code: code,
        link_id: linkId,
        max_uses: maxUses || null,
        expires_at: expiresAt || null,
        is_active: true
      } as any)
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
        community_id: communityId,
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
      .single();
      
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
      .single();
      
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
 * Record the use of an invite
 */
export const recordInviteUse = async (inviteCode: string, userId: string): Promise<string | null> => {
  try {
    const { data, error } = await (supabase as any)
      .rpc('record_invite_use', {
        invite_code: inviteCode,
        used_by_id: userId
      } as any);
      
    if (error) {
      console.error("Error recording invite use:", error);
      toast({
        title: "Error",
        description: "Could not record invite use",
        variant: "destructive",
      });
      return null;
    }
    
    await logAuditAction({
      action: 'invite_used',
      details: { 
        invite_code: inviteCode,
        user_id: userId,
        invite_id: data
      }
    });
    
    return (data as any) || null;
  } catch (error) {
    console.error("Exception in recordInviteUse:", error);
    return null;
  }
};
