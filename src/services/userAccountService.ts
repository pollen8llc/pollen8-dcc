import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logAuditAction } from "./auditService";

/**
 * Deactivates a user account
 */
export const deactivateUser = async (userId: string): Promise<boolean> => {
  try {
    // Get the current session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No session found");
    }

    // Call the edge function
    const { data, error } = await supabase.functions.invoke('deactivate-user', {
      body: { userId },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) {
      console.error("Error deactivating user:", error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error: any) {
    console.error("Error deactivating user:", error);
    const { toast } = useToast();
    toast({
      title: "Error deactivating user",
      description: error.message || "Failed to deactivate user",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Get user communities
 */
export const getUserCommunities = async (userId: string) => {
  try {
    // With our new model, we get communities that the user owns
    const { data, error } = await supabase
      .from('communities')
      .select(`
        id,
        name,
        logo_url
      `)
      .eq('owner_id', userId);
      
    if (error) {
      console.error("Error fetching user communities:", error);
      throw error;
    }
    
    return data.map(community => ({
      ...community,
      role: 'admin' // In the new model, all user communities are owned/admin
    }));
  } catch (error: any) {
    console.error("Error in getUserCommunities:", error);
    throw error;
  }
};
