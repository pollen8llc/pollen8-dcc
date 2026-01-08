import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { testServiceHealth } from "@/utils/testService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { DotConnectorHeader } from "@/components/layout/DotConnectorHeader";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { 
  AlertTriangle, 
  Activity, 
  Server, 
  Database, 
  Check, 
  Play, 
  RefreshCw, 
  Loader2, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft,
  Bug
} from 'lucide-react';

const HOOKS_AND_SERVICES_LIST = [
  { name: "useCreateCommunity", type: "hook" },
  { name: "useUserManagement", type: "hook" },
  { name: "useAuth", type: "hook" },
  { name: "userAccountService", type: "service" },
  { name: "communityQueryService", type: "service" },
  { name: "auditService", type: "service" }
];

const initialServiceStatus = HOOKS_AND_SERVICES_LIST.reduce((acc, s) => {
  acc[s.name] = {
    status: s.name === "useCreateCommunity" || s.name === "userAccountService" ? "fail" : "ok",
    lastChecked: new Date().toLocaleTimeString(),
    error: s.name === "useCreateCommunity" || s.name === "userAccountService" ? "Permission denied for table users" : ""
  };
  return acc;
}, {} as Record<string, { status: "ok" | "fail"; lastChecked: string; error: string; }>);

function useDashboardMetrics() {
  const [serverLoad, setServerLoad] = useState<{ value: number; history: number[]; }>({ value: 0, history: [] });
  const [errorLogs, setErrorLogs] = useState<{ message: string; timestamp: string; action: string; details?: string; }[]>([]);
  const [dbCalls, setDbCalls] = useState<{ count: number; lastCall: string; }>({ count: 0, lastCall: "" });
  const [allErrorLogs, setAllErrorLogs] = useState<{ message: string; timestamp: string; action: string; details?: string; }[]>([]);
  const [recursionDetected] = useState(false);

  useEffect(() => {
    async function fetchMetrics() {
      const auditResp = await supabase.from('audit_logs').select('id, created_at, action, details').order('created_at', { ascending: false }).limit(100);
      const audits = auditResp.data || [];
      const now = Date.now();
      const serverLoadRecent = audits.filter(a => a.created_at && now - new Date(a.created_at).getTime() < 600000);
      setServerLoad({
        value: audits.length ? serverLoadRecent.length / 10 : 0,
        history: [
          audits.filter(a => a.created_at && now - new Date(a.created_at).getTime() < 600000).length,
          audits.filter(a => a.created_at && now - new Date(a.created_at).getTime() < 3600000).length,
          audits.length
        ]
      });
      const errorRows = audits.filter(a => typeof a.action === "string" && (a.action.toLowerCase().includes('fail') || a.action.toLowerCase().includes('error')));
      setErrorLogs(errorRows.slice(0, 3).map((e: any) => ({
        message: `[${e.action}] ${e.details && typeof e.details === "object" && e.details.reason ? e.details.reason : 'Error'}`,
        timestamp: e.created_at ? new Date(e.created_at).toLocaleTimeString() : "",
        action: e.action,
        details: e.details && typeof e.details === "object" && e.details.reason ? e.details.reason : typeof e.details === "string" ? e.details : ''
      })));
      setAllErrorLogs(errorRows.slice(0, 25).map((e: any) => ({
        message: `[${e.action}] ${e.details && typeof e.details === "object" && e.details.reason ? e.details.reason : 'Error'}`,
        timestamp: e.created_at ? new Date(e.created_at).toLocaleString() : "",
        action: e.action,
        details: typeof e.details === "string" ? e.details : JSON.stringify(e.details)
      })));
      setDbCalls({
        count: audits.length,
        lastCall: audits.length > 0 ? audits[0].action : "(audit log empty)"
      });
    }
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 20000);
    return () => clearInterval(interval);
  }, []);

  return { serverLoad, errorLogs, dbCalls, allErrorLogs, recursionDetected };
}

async function logClientError(err: Error | string, details?: Record<string, any>) {
  const action = typeof err === "string" ? err : err.message;
  await supabase.from("audit_logs").insert([{
    action: "client_error",
    performed_by: null,
    details: { reason: action, ...details }
  }]);
}

const DebuggerDashboard = () => {
  const navigate = useNavigate();
  const { serverLoad, errorLogs, dbCalls, allErrorLogs, recursionDetected } = useDashboardMetrics();
  const [serviceStatus, setServiceStatus] = useState(initialServiceStatus);
  const [testingRow, setTestingRow] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [showErrorLogsPanel, setShowErrorLogsPanel] = useState(false);

  const handleTest = async (name: string) => {
    setTestingRow(name);
    try {
      const resp = await testServiceHealth(name);
      setServiceStatus(prev => ({
        ...prev,
        [name]: {
          status: resp.status === "ok" ? "ok" : "fail",
          lastChecked: new Date().toLocaleTimeString(),
          error: resp.error ?? ""
        }
      }));
      setExpandedRows(old => resp.status === "ok" ? old.filter(val => val !== name) : Array.from(new Set([...old, name])));
      toast({
        title: resp.status === "ok" ? "Service healthy" : "Service failed",
        description: resp.status === "ok" ? `Test succeeded for ${name}` : `Error: ${resp.error || "Unknown error"}`,
        variant: resp.status === "ok" ? "default" : "destructive"
      });
    } catch (err: any) {
      setServiceStatus(prev => ({
        ...prev,
        [name]: {
          status: "fail",
          lastChecked: new Date().toLocaleTimeString(),
          error: err?.message || "Test call failed"
        }
      }));
      setExpandedRows(old => Array.from(new Set([...old, name])));
      toast({
        title: "Service check failed",
        description: err?.message || "Could not run test",
        variant: "destructive"
      });
      logClientError(err, { context: "testServiceHealth" });
    } finally {
      setTestingRow(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      <div className="w-full px-4 py-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          <AdminNavigation />

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin')}
            className="text-muted-foreground hover:text-foreground -mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <Bug className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">System Debugger</h2>
              <p className="text-sm text-muted-foreground">Monitor service health, error logs, and system status</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 bg-card/40 backdrop-blur-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/20">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{serverLoad.value.toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Server Load (10m)</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-card/40 backdrop-blur-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Database className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dbCalls.count}</p>
                  <p className="text-sm text-muted-foreground">DB Calls (recent)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/40 backdrop-blur-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{allErrorLogs.length}</p>
                  <p className="text-sm text-muted-foreground">Error Logs</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/40 backdrop-blur-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Server className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{HOOKS_AND_SERVICES_LIST.length}</p>
                  <p className="text-sm text-muted-foreground">Services Tracked</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Health */}
          <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Service Health Monitor
            </h3>
            
            <div className="space-y-3">
              {HOOKS_AND_SERVICES_LIST.map((service) => {
                const status = serviceStatus[service.name];
                const isExpanded = expandedRows.includes(service.name);
                const isTesting = testingRow === service.name;
                
                return (
                  <div 
                    key={service.name}
                    className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${status.status === 'ok' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-xs text-muted-foreground">{service.type} • Last checked: {status.lastChecked}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTest(service.name)}
                          disabled={isTesting}
                          className="h-8"
                        >
                          {isTesting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Test
                            </>
                          )}
                        </Button>
                        
                        {status.error && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedRows(prev => 
                              prev.includes(service.name) 
                                ? prev.filter(v => v !== service.name) 
                                : [...prev, service.name]
                            )}
                            className="h-8 w-8 p-0"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {isExpanded && status.error && (
                      <div className="px-4 pb-4">
                        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                          <p className="text-sm text-red-400 font-mono">{status.error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Logs Panel */}
          <div className="rounded-2xl border border-white/10 bg-card/40 backdrop-blur-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Error Logs
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowErrorLogsPanel(!showErrorLogsPanel)}
              >
                {showErrorLogsPanel ? 'Hide Full Log' : 'Show Full Log'}
              </Button>
            </div>

            {allErrorLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Check className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No error logs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Timestamp</th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Action</th>
                      <th className="text-left px-4 py-2 font-medium text-muted-foreground">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showErrorLogsPanel ? allErrorLogs : allErrorLogs.slice(0, 5)).map((err, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{err.timestamp}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-medium">
                            {err.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{err.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebuggerDashboard;
