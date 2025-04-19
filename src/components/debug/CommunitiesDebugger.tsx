import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, CheckCircle, Code, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

const CommunitiesDebugger = () => {
  const { currentUser } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({
    userId: null,
    userRole: null,
    managedCommunities: [],
    ownedCommunities: [],
    ownershipChecks: {},
    apiCalls: [],
    errors: []
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshDebugInfo = async () => {
    setIsRefreshing(true);
    
    try {
      // Reset debug info but keep errors
      setDebugInfo(prev => ({
        ...prev,
        userId: currentUser?.id || null,
        userRole: currentUser?.role || null,
        managedCommunities: [],
        ownedCommunities: [],
        ownershipChecks: {},
        apiCalls: [...prev.apiCalls, { 
          timestamp: new Date().toISOString(),
          method: "refreshDebugInfo",
          status: "started"
        }]
      }));

      // Get managed communities
      if (currentUser?.id) {
        // Log API call
        setDebugInfo(prev => ({
          ...prev,
          apiCalls: [...prev.apiCalls, { 
            timestamp: new Date().toISOString(),
            method: "getManagedCommunities",
            status: "started"
          }]
        }));
        
        try {
          const { data: managedCommunities, error } = await supabase
            .from('communities')
            .select('id, name, owner_id')
            .in('id', currentUser.managedCommunities || []);
            
          if (error) throw error;
          
          setDebugInfo(prev => ({
            ...prev,
            managedCommunities: managedCommunities || [],
            apiCalls: [...prev.apiCalls, { 
              timestamp: new Date().toISOString(),
              method: "getManagedCommunities",
              status: "completed",
              resultCount: managedCommunities?.length || 0
            }]
          }));
          
          // Check ownership for each community
          if (managedCommunities?.length) {
            const ownershipChecks: Record<string, boolean> = {};
            
            for (const community of managedCommunities) {
              try {
                setDebugInfo(prev => ({
                  ...prev,
                  apiCalls: [...prev.apiCalls, { 
                    timestamp: new Date().toISOString(),
                    method: "isOwner",
                    communityId: community.id,
                    status: "started"
                  }]
                }));
                
                const { data: isOwner } = await supabase.rpc('is_community_owner', {
                  user_id: currentUser.id,
                  community_id: community.id
                });
                
                ownershipChecks[community.id] = !!isOwner;
                
                setDebugInfo(prev => ({
                  ...prev,
                  apiCalls: [...prev.apiCalls, { 
                    timestamp: new Date().toISOString(),
                    method: "isOwner",
                    communityId: community.id,
                    status: "completed",
                    result: !!isOwner
                  }]
                }));
              } catch (err) {
                console.error("Error checking ownership:", err);
                setDebugInfo(prev => ({
                  ...prev,
                  errors: [...prev.errors, { 
                    timestamp: new Date().toISOString(),
                    method: "isOwner",
                    communityId: community.id,
                    error: err instanceof Error ? err.message : String(err)
                  }]
                }));
              }
            }
            
            setDebugInfo(prev => ({
              ...prev,
              ownershipChecks
            }));
          }
          
          // Get owned communities (direct check on owner_id)
          setDebugInfo(prev => ({
            ...prev,
            apiCalls: [...prev.apiCalls, { 
              timestamp: new Date().toISOString(),
              method: "getOwnedCommunities",
              status: "started"
            }]
          }));
          
          const { data: ownedCommunities, error: ownedError } = await supabase
            .from('communities')
            .select('id, name')
            .eq('owner_id', currentUser.id);
            
          if (ownedError) throw ownedError;
          
          setDebugInfo(prev => ({
            ...prev,
            ownedCommunities: ownedCommunities || [],
            apiCalls: [...prev.apiCalls, { 
              timestamp: new Date().toISOString(),
              method: "getOwnedCommunities",
              status: "completed",
              resultCount: ownedCommunities?.length || 0
            }]
          }));
        } catch (err) {
          console.error("Error getting communities:", err);
          setDebugInfo(prev => ({
            ...prev,
            errors: [...prev.errors, { 
              timestamp: new Date().toISOString(),
              method: "getManagedCommunities",
              error: err instanceof Error ? err.message : String(err)
            }]
          }));
        }
      }
    } catch (err) {
      console.error("Error in debug refresh:", err);
      setDebugInfo(prev => ({
        ...prev,
        errors: [...prev.errors, { 
          timestamp: new Date().toISOString(),
          method: "refreshDebugInfo",
          error: err instanceof Error ? err.message : String(err)
        }]
      }));
    } finally {
      setIsRefreshing(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    refreshDebugInfo();
  }, [currentUser?.id]);

  return (
    <Card className="mb-8 border border-amber-500/50 overflow-hidden">
      <CardHeader className="bg-amber-500/10 py-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <Code className="h-4 w-4 mr-2" />
            Communities Debugger
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 px-2 text-xs"
            onClick={refreshDebugInfo}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger asChild>
            <div className="p-3 cursor-pointer hover:bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={debugInfo.errors.length > 0 ? "destructive" : "outline"}>
                  {debugInfo.errors.length > 0 ? `${debugInfo.errors.length} errors` : "Ready"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  User: {currentUser?.id ? `${currentUser.id.substring(0, 8)}...` : "Not logged in"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {expanded ? "Click to collapse" : "Click to expand"}
              </span>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="border-t p-4 space-y-4">
              {/* User Info */}
              <div>
                <h3 className="text-sm font-medium mb-2">User Information</h3>
                <div className="text-xs grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">User ID:</span>
                  <span>{currentUser?.id || "Not authenticated"}</span>
                  
                  <span className="text-muted-foreground">Role:</span>
                  <span>{currentUser?.role || "None"}</span>
                  
                  <span className="text-muted-foreground">Managed Communities:</span>
                  <span>{currentUser?.managedCommunities?.length || 0}</span>
                </div>
              </div>
              
              {/* Ownership Info */}
              <div>
                <h3 className="text-sm font-medium mb-2">Community Ownership</h3>
                {debugInfo.managedCommunities.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs grid grid-cols-3 gap-2 font-medium border-b pb-1">
                      <span>Community ID</span>
                      <span>Name</span>
                      <span>Is Owner?</span>
                    </div>
                    {debugInfo.managedCommunities.map((community: any) => (
                      <div 
                        key={community.id} 
                        className="text-xs grid grid-cols-3 gap-2"
                      >
                        <span className="font-mono">{community.id.substring(0, 8)}...</span>
                        <span>{community.name}</span>
                        <span className="flex items-center">
                          {debugInfo.ownershipChecks[community.id] ? (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-amber-500 mr-1" />
                          )}
                          {debugInfo.ownershipChecks[community.id] ? "Yes" : "No"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No managed communities found.</p>
                )}
              </div>
              
              {/* Directly Owned Communities */}
              <div>
                <h3 className="text-sm font-medium mb-2">Directly Owned Communities (owner_id)</h3>
                {debugInfo.ownedCommunities.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs grid grid-cols-2 gap-2 font-medium border-b pb-1">
                      <span>Community ID</span>
                      <span>Name</span>
                    </div>
                    {debugInfo.ownedCommunities.map((community: any) => (
                      <div 
                        key={community.id} 
                        className="text-xs grid grid-cols-2 gap-2"
                      >
                        <span className="font-mono">{community.id.substring(0, 8)}...</span>
                        <span>{community.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No directly owned communities found.</p>
                )}
              </div>
              
              {/* Errors Section */}
              {debugInfo.errors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-destructive">Errors</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {debugInfo.errors.map((err: any, i: number) => (
                      <div key={i} className="text-xs border border-destructive/20 bg-destructive/10 p-2 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium">{err.method}</span>
                          <span className="text-muted-foreground">{new Date(err.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="font-mono mt-1">{err.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* API Calls Log */}
              <div>
                <h3 className="text-sm font-medium mb-2">API Calls</h3>
                <div className="text-xs max-h-40 overflow-y-auto space-y-1">
                  {debugInfo.apiCalls.map((call: any, i: number) => (
                    <div 
                      key={i} 
                      className="flex items-center border-b border-dashed border-muted-foreground/20 pb-1"
                    >
                      <span className="text-muted-foreground mr-2 font-mono text-[10px]">
                        {new Date(call.timestamp).toLocaleTimeString()}
                      </span>
                      <span 
                        className={`mr-2 ${
                          call.status === 'completed' ? 'text-green-500' : 
                          call.status === 'error' ? 'text-red-500' : 
                          'text-amber-500'
                        }`}
                      >
                        [{call.status}]
                      </span>
                      <span className="font-medium">{call.method}</span>
                      {call.communityId && (
                        <span className="ml-2 font-mono text-[10px]">(ID: {call.communityId.substring(0, 6)}...)</span>
                      )}
                      {call.resultCount !== undefined && (
                        <span className="ml-auto">{call.resultCount} results</span>
                      )}
                      {call.result !== undefined && (
                        <span className="ml-auto">{String(call.result)}</span>
                      )}
                    </div>
                  ))}
                  {debugInfo.apiCalls.length === 0 && (
                    <p className="text-muted-foreground">No API calls recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default CommunitiesDebugger;
