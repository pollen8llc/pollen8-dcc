
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Wifi, WifiOff } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { usePermissions } from "@/hooks/usePermissions";

interface ApiCall {
  url: string;
  method: string;
  status?: number;
  timestamp: string;
  error?: string;
}

const CommunityManagementDebugger = () => {
  const { currentUser } = useUser();
  const { isOwner, isOrganizer } = usePermissions(currentUser);
  const [flowErrors, setFlowErrors] = useState<string[]>([]);
  const [dependencies, setDependencies] = useState<{[key: string]: boolean}>({});
  const [apiCalls, setApiCalls] = useState<ApiCall[]>([]);

  useEffect(() => {
    // Track component mount and initialization
    console.log("CommunityManagementDebugger mounted", {
      userId: currentUser?.id,
      role: currentUser?.role
    });

    // Error listeners setup
    const unhandledErrorListener = (event: ErrorEvent) => {
      setFlowErrors(prev => [...prev, `${event.message} (${event.filename}:${event.lineno})`]);
      console.error("Unhandled error in community management:", event);
    };

    const rejectionListener = (event: PromiseRejectionEvent) => {
      setFlowErrors(prev => [...prev, `Promise rejected: ${event.reason}`]);
      console.error("Unhandled promise rejection:", event);
    };

    // API call monitoring
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      // Fix: Properly handle different input types
      const url = typeof input === 'string' 
        ? input 
        : input instanceof URL 
          ? input.href 
          : input.url;
          
      const method = init?.method || 'GET';
      const timestamp = new Date().toISOString();

      try {
        const response = await originalFetch(input, init);
        const apiCall: ApiCall = {
          url,
          method,
          status: response.status,
          timestamp,
        };
        
        if (!response.ok) {
          const errorText = await response.text();
          apiCall.error = `Failed with status ${response.status}: ${errorText}`;
          setFlowErrors(prev => [...prev, apiCall.error!]);
        }
        
        setApiCalls(prev => [apiCall, ...prev].slice(0, 10)); // Keep last 10 calls
        return response;
      } catch (error: any) {
        const apiCall: ApiCall = {
          url,
          method,
          timestamp,
          error: error.message,
        };
        setApiCalls(prev => [apiCall, ...prev].slice(0, 10));
        setFlowErrors(prev => [...prev, `API Error: ${error.message}`]);
        throw error;
      }
    };

    // Add error listeners
    window.addEventListener('error', unhandledErrorListener);
    window.addEventListener('unhandledrejection', rejectionListener);

    // Check critical dependencies
    const checkDependencies = async () => {
      try {
        setDependencies({
          "User Context": !!currentUser,
          "Permissions Hook": !!(isOwner && isOrganizer),
          "Query Client": !!(window as any)._reactQueryClient,
          "Fetch API": !!window.fetch,
        });
      } catch (error) {
        console.error("Error checking dependencies:", error);
      }
    };

    checkDependencies();

    return () => {
      window.fetch = originalFetch;
      window.removeEventListener('error', unhandledErrorListener);
      window.removeEventListener('unhandledrejection', rejectionListener);
    };
  }, [currentUser, isOwner, isOrganizer]);

  return (
    <Card className="mb-6 bg-muted/50">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Community Management Debugger
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* User Context */}
          <div>
            <h4 className="text-sm font-medium mb-2">User Context</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant={currentUser ? "default" : "destructive"}>
                User ID: {currentUser?.id || 'Not found'}
              </Badge>
              <Badge variant={currentUser?.role ? "default" : "destructive"}>
                Role: {currentUser?.role || 'None'}
              </Badge>
            </div>
          </div>

          {/* Dependencies Status */}
          <div>
            <h4 className="text-sm font-medium mb-2">Dependencies</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(dependencies).map(([dep, isLoaded]) => (
                <Badge key={dep} variant={isLoaded ? "default" : "destructive"}>
                  {dep}: {isLoaded ? '✓' : '✗'}
                </Badge>
              ))}
            </div>
          </div>

          {/* API Calls */}
          <div>
            <h4 className="text-sm font-medium mb-2">Recent API Calls</h4>
            <ScrollArea className="h-[100px] rounded-md border">
              {apiCalls.map((call, index) => (
                <div key={index} className="p-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    {call.error ? (
                      <WifiOff className="h-4 w-4 text-destructive" />
                    ) : (
                      <Wifi className="h-4 w-4 text-green-500" />
                    )}
                    <span className="text-xs">
                      {call.method} {new URL(call.url).pathname}
                    </span>
                    <Badge variant={call.error ? "destructive" : "default"}>
                      {call.status || 'Failed'}
                    </Badge>
                  </div>
                  {call.error && (
                    <p className="text-xs text-destructive mt-1">{call.error}</p>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Flow Errors */}
          {flowErrors.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Flow Errors</h4>
              <ScrollArea className="h-[100px]">
                {flowErrors.map((error, index) => (
                  <Alert key={index} variant="destructive" className="mb-2">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityManagementDebugger;
