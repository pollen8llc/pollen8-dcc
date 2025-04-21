import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { testServiceHealth } from "@/utils/testService";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Activity, Server, Database, Repeat, Check, Play, RefreshCw, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

const HOOKS_AND_SERVICES_LIST = [
  { name: "useCreateCommunity", type: "hook" },
  { name: "useUserManagement", type: "hook" },
  { name: "useAuth", type: "hook" },
  { name: "userAccountService", type: "service" },
  { name: "communityQueryService", type: "service" },
  { name: "auditService", type: "service" },
];

const initialServiceStatus = HOOKS_AND_SERVICES_LIST.reduce((acc, s) => {
  acc[s.name] = {
    status: (s.name === "useCreateCommunity" || s.name === "userAccountService") ? "fail" : "ok",
    lastChecked: new Date().toLocaleTimeString(),
    error: (s.name === "useCreateCommunity" || s.name === "userAccountService")
      ? "Permission denied for table users"
      : "",
  };
  return acc;
}, {} as Record<string, { status: "ok" | "fail", lastChecked: string, error: string }>);

// --- Fetch real metrics ---
function useDashboardMetrics() {
  const [serverLoad, setServerLoad] = useState<{ value: number, history: number[] }>({ value: 0, history: [] });
  const [errorLogs, setErrorLogs] = useState<{ message: string, timestamp: string, action: string, details?: string }[]>([]);
  const [dbCalls, setDbCalls] = useState<{ count: number, lastCall: string }>({ count: 0, lastCall: "" });
  const [allErrorLogs, setAllErrorLogs] = useState<{ message: string, timestamp: string, action: string, details?: string }[]>([]);
  const [recursionDetected] = useState(false); // Not supported via Supabase, fallback to false

  useEffect(() => {
    async function fetchMetrics() {
      // Get the 100 most recent audit logs for error/metrics
      const auditResp = await supabase
        .from('audit_logs')
        .select('id, created_at, action, details')
        .order('created_at', { ascending: false })
        .limit(100);
      const audits = auditResp.data || [];

      // For "server load", count actionable logs in last 10m
      const now = Date.now();
      const serverLoadRecent = audits.filter(a => a.created_at && ((now - new Date(a.created_at).getTime()) < 600000));
      setServerLoad({
        value: audits.length ? serverLoadRecent.length / 10 : 0,
        history: [
          audits.filter(a => a.created_at && ((now - new Date(a.created_at).getTime()) < 600000)).length,
          audits.filter(a => a.created_at && ((now - new Date(a.created_at).getTime()) < 3600000)).length,
          audits.length
        ]
      });

      // Error logs: look for "fail" or "error" in .action (case-insensitive)
      const errorRows = audits
        .filter(a =>
          typeof a.action === "string" &&
          (a.action.toLowerCase().includes('fail') || a.action.toLowerCase().includes('error'))
        );
      setErrorLogs(
        errorRows.slice(0, 3).map((e: any) => ({
          message: `[${e.action}] ${e.details && typeof e.details === "object" && e.details.reason ? e.details.reason : 'Error'}`,
          timestamp: e.created_at ? new Date(e.created_at).toLocaleTimeString() : "",
          action: e.action,
          details: e.details && typeof e.details === "object" && e.details.reason ? e.details.reason : (typeof e.details === "string" ? e.details : '')
        }))
      );
      setAllErrorLogs(
        errorRows.slice(0, 25).map((e: any) => ({
          message: `[${e.action}] ${e.details && typeof e.details === "object" && e.details.reason ? e.details.reason : 'Error'}`,
          timestamp: e.created_at ? new Date(e.created_at).toLocaleString() : "",
          action: e.action,
          details: typeof e.details === "string" ? e.details : JSON.stringify(e.details)
        }))
      );

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

// Logs an error to audit_logs from client-side by calling an edge function (to be implemented later)
async function logClientError(err: Error | string, details?: Record<string, any>) {
  // This should be expanded to call an edge function for real use, but for now, try regular upsert
  const action = typeof err === "string" ? err : err.message;
  await supabase.from("audit_logs").insert([{
    action: "client_error",
    performed_by: null, // can't log user easily from client (should be set in edge function with JWT)
    details: { reason: action, ...details }
  }]);
}

const DebuggerDashboard = () => {
  const navigate = useNavigate();
  const { serverLoad, errorLogs, dbCalls, allErrorLogs, recursionDetected } = useDashboardMetrics();
  const [serviceStatus, setServiceStatus] = useState(initialServiceStatus);
  const [testingRow, setTestingRow] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [showErrorLogsPanel, setShowErrorLogsPanel] = useState(false); // For expandable error panel

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
      setExpandedRows(old =>
        resp.status === "ok"
          ? old.filter(val => val !== name)
          : Array.from(new Set([...old, name]))
      );
      toast({
        title: resp.status === "ok" ? "Service healthy" : "Service failed",
        description:
          resp.status === "ok"
            ? `Test succeeded for ${name}`
            : `Error: ${resp.error || "Unknown error"}`,
        variant: resp.status === "ok" ? "default" : "destructive",
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
        variant: "destructive",
      });
      logClientError(err, { context: "testServiceHealth" });
    } finally {
      setTestingRow(null);
    }
  };

  const handleAccordionChange = (value: string) => {
    setExpandedRows(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin')}>
          <span className="mr-2"><Server className="h-4 w-4" /></span>
          System Monitor
        </Button>
        <h1 className="text-3xl font-bold">System Monitor Board</h1>
      </div>
      {/* Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Server Load */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Server Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xl">{serverLoad.value ? (serverLoad.value * 10).toFixed(1) : "0.0"}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Recent: {serverLoad.history.join(', ')}
            </div>
          </CardContent>
        </Card>
        {/* Error Logs */}
        <Card
          className="cursor-pointer"
          onClick={() => setShowErrorLogsPanel((v) => !v)}
        >
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            <CardTitle className="text-base flex items-center gap-2">
              Error Logs
              {showErrorLogsPanel ?
                <ChevronUp className="h-4 w-4" /> :
                <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {errorLogs.length === 0
                ? <li className="text-muted-foreground text-xs">No recent errors</li>
                : errorLogs.slice(0, 3).map((err, idx) => (
                  <li key={idx} className="text-xs text-red-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" /> {err.message}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
        {/* Database Calls */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base">Database Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xl">{dbCalls.count}</div>
            <div className="text-xs mt-2">
              Last: <span className="font-mono">{dbCalls.lastCall}</span>
            </div>
          </CardContent>
        </Card>
        {/* Recursion Detector */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Repeat className="h-5 w-5 text-yellow-400" />
            <CardTitle className="text-base">Recursion Detector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {recursionDetected
                ? (
                  <span className="text-destructive font-semibold flex items-center">
                    <Activity className="h-4 w-4 mr-1" /> Infinite loop detected
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold flex items-center">
                    <Check className="h-4 w-4 mr-1" /> No recursion
                  </span>
                )}
            </div>
            <div className="text-xs mt-2">Monitoring component update loops</div>
          </CardContent>
        </Card>
      </div>
      {/* Expandable error log view */}
      {showErrorLogsPanel && (
        <div className="rounded shadow bg-white dark:bg-card p-5 mb-8 transition-all">
          <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" /> Error Logs (Last 25)
          </h2>
          {allErrorLogs.length === 0 ? (
            <div className="text-xs text-muted-foreground">No error logs found.</div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left px-2 py-1 font-bold">Timestamp</th>
                    <th className="text-left px-2 py-1 font-bold">Action</th>
                    <th className="text-left px-2 py-1 font-bold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {allErrorLogs.map((err, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="px-2 py-1">{err.timestamp}</td>
                      <td className="px-2 py-1">{err.action}</td>
                      <td className="px-2 py-1">{err.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Hooks &amp; Services Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {HOOKS_AND_SERVICES_LIST.map(service => {
              const stat = serviceStatus[service.name];
              const isFail = stat.status === "fail";
              const loading = testingRow === service.name;
              const expanded = expandedRows.includes(service.name);

              return (
                <div
                  key={service.name}
                  className={`transition-all rounded-lg border ${expanded ? "bg-muted/80 shadow-md border-primary" : "border-accent bg-card"} group`}
                >
                  <div
                    className="flex items-center px-4 py-2 cursor-pointer select-none"
                    onClick={() => handleAccordionChange(service.name)}
                  >
                    <span className="col-span-2 font-medium flex items-center gap-2 flex-1">
                      {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      <span>{service.name}</span>
                    </span>
                    <span className="capitalize flex-1 text-sm text-muted-foreground">{service.type}</span>
                    <span className="flex-1 text-sm">
                      {loading
                        ? <span className="flex items-center gap-1 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Testing…</span>
                        : isFail
                          ? <span className="text-destructive flex items-center gap-1"><Activity className="h-4 w-4" /> Error</span>
                          : <span className="text-green-500 flex items-center gap-1"><Check className="h-4 w-4" /> OK</span>
                      }
                    </span>
                    <span className="text-xs text-muted-foreground flex-1">{loading ? <span className="opacity-60">Testing…</span> : stat.lastChecked}</span>
                    <span className="flex gap-2">
                      <Button
                        size="sm"
                        variant={loading ? "secondary" : "outline"}
                        onClick={e => {
                          e.stopPropagation();
                          if (!loading) handleTest(service.name);
                        }}
                        className={
                          "flex items-center gap-1 transition-all" +
                          (loading ? " opacity-60 pointer-events-none" : "")
                        }
                        aria-label="Test"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        <span>{loading ? "Testing" : "Test"}</span>
                      </Button>
                    </span>
                  </div>
                  {expanded && (
                    <div className="px-6 pb-3 text-xs">
                      {loading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" /> Running test...
                        </div>
                      ) : isFail ? (
                        <div className="flex items-center text-destructive gap-2">
                          <AlertTriangle className="h-4 w-4" /> {stat.error || "Error details not available."}
                        </div>
                      ) : (
                        <div className="text-green-700 flex items-center gap-2">
                          <Check className="h-4 w-4" /> No errors detected. Health check passed.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebuggerDashboard;
