import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { AlertTriangle, Activity, Server, Database, Repeat, Check, Play, RefreshCw, Loader2 } from 'lucide-react';

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

  const handleTest = (name: string) => {
    setTestingRow(name);

    setTimeout(() => {
      const isOk = Math.random() > 0.5;
      setServiceStatus(prev => ({
        ...prev,
        [name]: {
          status: isOk ? "ok" : "fail",
          lastChecked: new Date().toLocaleTimeString(),
          error: isOk ? "" : "Permission denied for table users",
        }
      }));
      setTestingRow(null);
    }, 1200);
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
          <Accordion type="multiple" className="w-full">
            {HOOKS_AND_SERVICES_LIST.map(service => {
              const stat = serviceStatus[service.name];
              const isFail = stat.status === "fail";
              const loading = testingRow === service.name;

              return (
                <AccordionItem key={service.name} value={service.name} className="border-b-0 group">
                  <div className="flex items-center transition-all">
                    <AccordionTrigger className={ 
                      `w-full flex-1 px-0 py-2 hover:bg-accent rounded text-left 
                      ${loading ? "opacity-70 pointer-events-none select-none" : "opacity-100"}`
                    }>
                      <div className="grid grid-cols-6 items-center w-full">
                        <span className="col-span-2 font-medium flex items-center gap-2">
                          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                          <span>{service.name}</span>
                        </span>
                        <span className="capitalize col-span-1">{service.type}</span>
                        <span className="col-span-1">
                          {loading
                            ? <span className="flex items-center gap-1 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Testing…</span>
                            : isFail
                              ? <span className="text-destructive flex items-center gap-1"><Activity className="h-4 w-4" /> Error</span>
                              : <span className="text-green-500 flex items-center gap-1"><Check className="h-4 w-4" /> OK</span>
                          }
                        </span>
                        <span className="col-span-1 text-xs text-muted-foreground">
                          {loading ? <span className="opacity-60">Testing…</span> : stat.lastChecked}
                        </span>
                        <span className="col-span-1 flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
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
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className={`bg-muted/80 transition-all ${loading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
                    {loading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Testing connection...
                      </div>
                    ) : isFail ? (
                      <div className="flex items-center text-destructive gap-2">
                        <AlertTriangle className="h-4 w-4" /> {stat.error}
                      </div>
                    ) : (
                      <div className="text-green-700 flex items-center gap-2">
                        <Check className="h-4 w-4" /> No errors detected. Health check passed.
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebuggerDashboard;
