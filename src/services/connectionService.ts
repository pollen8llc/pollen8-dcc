
import { supabase } from "@/integrations/supabase/client";
import { logAuditAction } from "./auditService";

export interface ConnectionData {
  id?: string;
  inviter_id: string;
  invitee_id: string;
  invite_id?: string;
  connection_depth: number;
  connected_at?: string;
  community_id?: string;
}

/**
 * Create a new connection between users
 */
export const createConnection = async (
  inviterId: string,
  inviteeId: string,
  inviteId?: string,
  communityId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_connections')
      .insert({
        inviter_id: inviterId,
        invitee_id: inviteeId,
        invite_id: inviteId,
        community_id: communityId,
        connection_depth: 1
      });
      
    if (error) {
      console.error("Error creating connection:", error);
      return false;
    }
    
    await logAuditAction({
      action: 'create_connection',
      details: { 
        inviter_id: inviterId,
        invitee_id: inviteeId,
        invite_id: inviteId,
        community_id: communityId
      }
    });
    
    return true;
  } catch (error) {
    console.error("Exception in createConnection:", error);
    return false;
  }
};

/**
 * Get connection depth between two users
 */
export const getConnectionDepth = async (userIdA: string, userIdB: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_connection_depth', {
        user_a: userIdA,
        user_b: userIdB
      });
      
    if (error) {
      console.error("Error getting connection depth:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception in getConnectionDepth:", error);
    return null;
  }
};

/**
 * Get all connections for a user within a specific depth
 */
export const getConnectionsByUser = async (userId: string, maxDepth: number = 1): Promise<ConnectionData[]> => {
  try {
    const { data, error } = await supabase
      .from('user_connections')
      .select('*')
      .or(`inviter_id.eq.${userId},invitee_id.eq.${userId}`)
      .lte('connection_depth', maxDepth);
      
    if (error) {
      console.error("Error fetching connections:", error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Exception in getConnectionsByUser:", error);
    return [];
  }
};

/**
 * Get connection path between two users (if one exists)
 */
export const getConnectionPath = async (userIdA: string, userIdB: string): Promise<{ path: string[], depth: number } | null> => {
  // Simplified implementation - in a real system this would be more complex
  try {
    const depth = await getConnectionDepth(userIdA, userIdB);
    
    if (depth === null) {
      return null;
    }
    
    // For now, just return the depth info without the full path
    // A full implementation would require querying the graph structure
    return {
      path: [userIdA, userIdB],
      depth: depth
    };
  } catch (error) {
    console.error("Exception in getConnectionPath:", error);
    return null;
  }
};

/**
 * Get connection graph for visualization
 */
export const getConnectionGraph = async (userId: string, maxDepth: number = 1): Promise<any> => {
  try {
    // This is a placeholder for a more complex graph query
    // In a real implementation, you would query the connections and build a graph structure
    
    const connections = await getConnectionsByUser(userId, maxDepth);
    
    // Transform connections into a graph structure
    const nodes = new Set<string>();
    const edges: { source: string; target: string; depth: number }[] = [];
    
    // Add central user
    nodes.add(userId);
    
    // Process connections
    connections.forEach(conn => {
      if (conn.inviter_id === userId) {
        nodes.add(conn.invitee_id);
        edges.push({
          source: userId,
          target: conn.invitee_id,
          depth: conn.connection_depth
        });
      } else {
        nodes.add(conn.inviter_id);
        edges.push({
          source: userId,
          target: conn.inviter_id,
          depth: conn.connection_depth
        });
      }
    });
    
    return {
      nodes: Array.from(nodes),
      edges
    };
  } catch (error) {
    console.error("Exception in getConnectionGraph:", error);
    return { nodes: [], edges: [] };
  }
};
