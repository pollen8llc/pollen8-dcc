
import { useEffect, useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash, PlusCircle, Clock, AlertTriangle, Info, CheckCircle } from "lucide-react";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-expand when errors appear, with proper dependency array
  useEffect(() => {
    const hasErrors = logs.some(log => log.type === 'error');
    if (hasErrors) {
      setIsExpanded(true);
      setIsVisible(true);
    }
  }, [logs]); // Only run when logs change

  if (!isVisible) {
    return (
      <Button 
        variant="outline" 
        className="fixed bottom-4 right-4 z-50 bg-background" 
        onClick={() => setIsVisible(true)}
      >
        <PlusCircle className="h-4 w-4 mr-2" /> 
        Show Debug Console
      </Button>
    );
  }

  return (
    <Card className="mt-6 border-2 border-primary/20 fixed bottom-4 right-4 z-50 w-[95%] md:w-[500px] shadow-xl">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <CardTitle className="text-sm font-medium">Debug Console</CardTitle>
            <Badge 
              variant={logs.some(log => log.type === 'error') ? 'destructive' : 'outline'} 
              className="ml-2"
            >
              {logs.length} logs
            </Badge>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '−' : '+'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 text-muted-foreground" 
              onClick={() => setIsVisible(false)}
            >
              ×
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <ScrollArea className="h-[300px] w-full rounded-md border p-2">
            {logs.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No logs yet
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-2 rounded-lg p-2 text-xs ${
                    log.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-200' :
                    log.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-200' :
                    'bg-blue-500/10 text-blue-500 border border-blue-200'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {log.type === 'error' ? <AlertTriangle className="h-3 w-3 mr-1" /> : 
                     log.type === 'success' ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                     <Info className="h-3 w-3 mr-1" />}
                    <span className="text-[10px] opacity-70 flex items-center">
                      <Clock className="h-2.5 w-2.5 mr-1" />
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap break-words">{log.message}</p>
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
