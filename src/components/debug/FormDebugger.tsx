
import { useEffect, useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, CheckCircle, Minimize, Maximize, X } from "lucide-react";

interface DebugData {
  type: 'info' | 'error' | 'success';
  message: string;
  timestamp: string;
}

interface FormDebuggerProps {
  logs: DebugData[];
}

// Using memo to prevent unnecessary re-renders
export const FormDebugger = memo(({ logs }: FormDebuggerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  // Only show errors and important logs in compact mode
  const filteredLogs = isExpanded 
    ? logs 
    : logs.filter(log => log.type === 'error' || log.message.includes('successfully'));

  // Auto-expand only for errors, with proper dependency array
  useEffect(() => {
    const hasErrors = logs.some(log => log.type === 'error');
    if (hasErrors) {
      setIsVisible(true);
    }
  }, [logs]); // Only run when logs change

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-background shadow-md" 
        onClick={() => setIsVisible(true)}
      >
        Show Debug
      </Button>
    );
  }

  const errorCount = logs.filter(log => log.type === 'error').length;

  return (
    <Card className={`fixed bottom-4 right-4 z-50 ${isExpanded ? 'w-[350px]' : 'w-[200px]'} shadow-xl border-2 ${errorCount > 0 ? 'border-red-400/30' : 'border-primary/20'}`}>
      <CardHeader className="p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CardTitle className="text-xs font-medium">Debug</CardTitle>
            {errorCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {errorCount} {errorCount === 1 ? 'error' : 'errors'}
              </Badge>
            )}
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-muted-foreground" 
              onClick={() => setIsVisible(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-2">
          <ScrollArea className="h-[150px] w-full rounded-md border p-2">
            {filteredLogs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                No logs yet
              </div>
            ) : (
              filteredLogs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-2 rounded-lg p-1.5 text-[10px] ${
                    log.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-200' :
                    log.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-200' :
                    'bg-blue-500/10 text-blue-500 border border-blue-200'
                  }`}
                >
                  <div className="flex items-center">
                    {log.type === 'error' ? <AlertTriangle className="h-2.5 w-2.5 mr-1" /> : 
                     log.type === 'success' ? <CheckCircle className="h-2.5 w-2.5 mr-1" /> : 
                     <Info className="h-2.5 w-2.5 mr-1" />}
                    <span className="opacity-70">{log.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words mt-1">{log.message}</p>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
});

FormDebugger.displayName = 'FormDebugger';
