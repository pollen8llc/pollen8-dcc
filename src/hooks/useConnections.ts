
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { 
  createConnection, 
  getConnectionDepth, 
  getConnectionsByUser, 
  getConnectionPath,
  getConnectionGraph,
  ConnectionData
} from "@/services/connectionService";

export const useConnections = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const { currentUser } = useUser();
  const { toast } = useToast();

  /**
   * Create a new connection between users
   */
  const handleCreateConnection = async (
    inviteeId: string,
    inviteId?: string,
    communityId?: string
  ): Promise<boolean> => {
    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create connections",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      const success = await createConnection(
        currentUser.id,
        inviteeId,
        inviteId,
        communityId
      );

      if (success) {
        toast({
          title: "Success",
          description: "Connection created successfully",
        });
        
        // Refresh connections
        await loadUserConnections();
      } else {
        toast({
          title: "Error",
          description: "Failed to create connection",
          variant: "destructive",
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error in handleCreateConnection:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load connections for the current user
   */
  const loadUserConnections = async (maxDepth: number = 1): Promise<ConnectionData[]> => {
    if (!currentUser) {
      return [];
    }

    setIsLoading(true);
    try {
      const loadedConnections = await getConnectionsByUser(currentUser.id, maxDepth);
      setConnections(loadedConnections);
      return loadedConnections;
    } catch (error) {
      console.error("Error in loadUserConnections:", error);
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get connection depth between two users
   */
  const checkConnectionDepth = async (userId: string): Promise<number | null> => {
    if (!currentUser) {
      return null;
    }

    setIsLoading(true);
    try {
      return await getConnectionDepth(currentUser.id, userId);
    } catch (error) {
      console.error("Error in checkConnectionDepth:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get connection path between two users
   */
  const findConnectionPath = async (userId: string): Promise<{ path: string[], depth: number } | null> => {
    if (!currentUser) {
      return null;
    }

    setIsLoading(true);
    try {
      return await getConnectionPath(currentUser.id, userId);
    } catch (error) {
      console.error("Error in findConnectionPath:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get connection graph for visualization
   */
  const getGraph = async (maxDepth: number = 1): Promise<any> => {
    if (!currentUser) {
      return { nodes: [], edges: [] };
    }

    setIsLoading(true);
    try {
      return await getConnectionGraph(currentUser.id, maxDepth);
    } catch (error) {
      console.error("Error in getGraph:", error);
      return { nodes: [], edges: [] };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    connections,
    createConnection: handleCreateConnection,
    getConnectionsByUser: loadUserConnections,
    getConnectionDepth: checkConnectionDepth,
    getConnectionPath: findConnectionPath,
    getConnectionGraph: getGraph,
  };
};
