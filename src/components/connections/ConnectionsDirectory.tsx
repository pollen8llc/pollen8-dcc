
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConnections } from "@/hooks/useConnections";
import { User } from "@/models/types";
import { Loader2, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectionsDirectoryProps {
  maxDepth: number;
  onError: (errorMsg: string) => void;
}

const ConnectionsDirectory: React.FC<ConnectionsDirectoryProps> = ({ maxDepth, onError }) => {
  const { isLoading, connections, getConnectionsByUser } = useConnections();
  const [connectionGraph, setConnectionGraph] = useState<{ nodes: string[], edges: any[] }>({ nodes: [], edges: [] });
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadConnections = async () => {
      try {
        setIsInitialLoading(true);
        const result = await getConnectionsByUser(maxDepth);
        console.log("Loaded connections:", result);
        
        // For now just store the raw connections data
        // In a full implementation, we would transform this data
        // into a user-friendly format with actual user details
        
        setIsInitialLoading(false);
      } catch (error) {
        console.error("Error loading connections:", error);
        onError("Failed to load your connections. Please try again later.");
        setIsInitialLoading(false);
      }
    };

    loadConnections();
  }, [getConnectionsByUser, maxDepth, onError]);

  if (isInitialLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (connections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            No Connections Yet
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Users className="h-16 w-16 opacity-20 mb-4" />
          <h3 className="font-semibold text-lg">You don't have any connections yet</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            Your network will grow as you connect with other members of the community.
          </p>
          <Button className="mt-6 flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Find People to Connect With
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Connection Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            You have {connections.length} connection{connections.length !== 1 ? 's' : ''}.
          </p>
          
          {/* Here we would implement the actual connection list with user details */}
          {/* For now, showing a simple placeholder */}
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">
                    Connection #{connection.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {connection.connection_depth === 1 ? 'Direct connection' : `${connection.connection_depth}-degree connection`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionsDirectory;
