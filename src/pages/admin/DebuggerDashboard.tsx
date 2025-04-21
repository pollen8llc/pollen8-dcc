import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { AlertTriangle, Activity, Server, Database, Repeat, Check, Play, RefreshCw, Loader2 } from 'lucide-react';
import { testServiceHealth } from "@/utils/testService";
import { toast } from "@/hooks/use-toast";

const fakeMetrics = {
  serverLoad: { value: 0.27, history: [0.20, 0.23, 0.19, 0.27, 0.22] },
  errorLogs: [
    { message: "Failed to load users: Timeout", timestamp: "00:11:03" },
    { message: "Permission denied for table users", timestamp: "00:12:02" },
  ],
  dbCalls: { count: 1523, lastCall: "SELECT * FROM communities" },
  recursionDetected: false,
};

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

const DebuggerDashboard = () => {
  const navigate = useNavigate();
  const [recursionDetected, setRecursionDetected] = useState(fakeMetrics.recursionDetected);
  const [errorLogs, setErrorLogs] = useState(fakeMetrics.errorLogs);
  const [serviceStatus, setServiceStatus] = useState(initialServiceStatus);
  const [testingRow, setTestingRow] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Server Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xl">{(fakeMetrics.serverLoad.value * 100).toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1">Recent: {fakeMetrics.serverLoad.history.join(', ')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="h-5 w-5 text-red-500" />
            <CardTitle className="text-base">Error Logs</CardTitle>
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
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base">Database Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-xl">{fakeMetrics.dbCalls.count}</div>
            <div className="text-xs mt-2">
              Last: <span className="font-mono">{fakeMetrics.dbCalls.lastCall}</span>
            </div>
          </CardContent>
        </Card>
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
