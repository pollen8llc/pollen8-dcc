
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllUsers } from '@/services/userQueryService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { User } from '@/models/types';

const UserDebugger = () => {
  const [manualUsers, setManualUsers] = useState<User[]>([]);
  const [isManualLoading, setIsManualLoading] = useState(false);
  const [manualError, setManualError] = useState<Error | null>(null);
  
  const queryClient = useQueryClient();
  
  // React Query fetch
  const { 
    data: queryUsers = [], 
    isLoading: queryLoading, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey: ['debug-users'],
    queryFn: getAllUsers,
    staleTime: 0, // Don't cache for debugging
    retry: false, // Don't retry for debugging
  });
  
  // Manual fetch outside of React Query
  const handleManualFetch = async () => {
    try {
      setIsManualLoading(true);
      setManualError(null);
      console.log("Starting manual fetch of users");
      const users = await getAllUsers();
      console.log("Manual fetch completed, users:", users);
      setManualUsers(users);
    } catch (err) {
      console.error("Manual fetch error:", err);
      setManualError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsManualLoading(false);
    }
  };
  
  // Log cached queries
  const logCachedQueries = () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    console.log("All cached queries:", queries.map(q => ({
      queryKey: q.queryKey,
      state: q.state
    })));
  };
  
  // Clear all query cache
  const clearAllCache = () => {
    queryClient.clear();
    console.log("Cleared all query cache");
  };
  
  // Component loaded
  useEffect(() => {
    console.log("UserDebugger component mounted");
    return () => {
      console.log("UserDebugger component unmounted");
    };
  }, []);
  
  return (
    <Card className="mb-6 border-red-300">
      <CardHeader>
        <CardTitle className="text-red-500">User Fetching Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">React Query Users</h3>
          <div className="flex items-center space-x-2">
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Refetch with React Query
            </Button>
            <span className="text-sm text-muted-foreground">
              {queryLoading 
                ? "Loading..." 
                : queryError 
                  ? `Error: ${queryError instanceof Error ? queryError.message : String(queryError)}` 
                  : `Found ${queryUsers.length} users`}
            </span>
          </div>
          {queryUsers.length > 0 && (
            <div className="text-xs mt-2 max-h-20 overflow-y-auto border p-2 rounded">
              {queryUsers.slice(0, 3).map(user => (
                <div key={user.id}>{user.name}: {user.email} ({user.role})</div>
              ))}
              {queryUsers.length > 3 && <div>...and {queryUsers.length - 3} more</div>}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Manual Fetch Users</h3>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleManualFetch} 
              disabled={isManualLoading}
              variant="outline"
              size="sm"
            >
              {isManualLoading ? "Loading..." : "Fetch Manually"}
            </Button>
            <span className="text-sm text-muted-foreground">
              {isManualLoading 
                ? "Loading..." 
                : manualError 
                  ? `Error: ${manualError.message}` 
                  : `Found ${manualUsers.length} users`}
            </span>
          </div>
          {manualUsers.length > 0 && (
            <div className="text-xs mt-2 max-h-20 overflow-y-auto border p-2 rounded">
              {manualUsers.slice(0, 3).map(user => (
                <div key={user.id}>{user.name}: {user.email} ({user.role})</div>
              ))}
              {manualUsers.length > 3 && <div>...and {manualUsers.length - 3} more</div>}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Cache Debugging</h3>
          <div className="flex items-center space-x-2">
            <Button onClick={logCachedQueries} variant="outline" size="sm">
              Log Cached Queries
            </Button>
            <Button onClick={clearAllCache} variant="outline" size="sm">
              Clear Query Cache
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDebugger;
