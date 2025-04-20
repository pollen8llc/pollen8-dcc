
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

const DebuggerDashboard = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string[]>([]);
  const [recursionDetected, setRecursionDetected] = useState(false);
  
  useEffect(() => {
    // Store original console.log
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Create a buffer for logs
    const logBuffer: string[] = [];
    
    // Override console.log
    console.log = (...args) => {
      // Call original console.log
      originalConsoleLog(...args);
      
      // Add to our buffer
      logBuffer.push(`INFO: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')}`);
      
      // Update state (limiting to last 100 entries)
      setLogs(prev => [...logBuffer].slice(-100));
    };
    
    // Override console.error
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError(...args);
      
      // Check for recursion errors
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      if (errorMessage.includes('Maximum update depth exceeded') || 
          errorMessage.includes('recursion')) {
        setRecursionDetected(true);
      }
      
      // Add to our buffer
      logBuffer.push(`ERROR: ${errorMessage}`);
      
      // Update state (limiting to last 100 entries)
      setLogs(prev => [...logBuffer].slice(-100));
    };
    
    // Override console.warn
    console.warn = (...args) => {
      // Call original console.warn
      originalConsoleWarn(...args);
      
      // Add to our buffer
      logBuffer.push(`WARN: ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ')}`);
      
      // Update state (limiting to last 100 entries)
      setLogs(prev => [...logBuffer].slice(-100));
    };
    
    // Log that debugger initialized
    console.log('Debug console initialized');
    
    // Restore original on cleanup
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log('Debug console terminated');
    };
  }, []);
  
  const clearLogs = () => {
    setLogs([]);
    setRecursionDetected(false);
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h1 className="text-3xl font-bold">Debug Console</h1>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto"
          onClick={clearLogs}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear Logs
        </Button>
      </div>
      
      {recursionDetected && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Recursion Error Detected</AlertTitle>
          <AlertDescription>
            The application has detected an infinite update loop. This is likely caused by a component
            updating its state during render or in an effect without proper dependencies.
            Check your useEffect hooks and event handlers in your components.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Console Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full rounded-md border p-4">
            <div className="font-mono text-sm whitespace-pre-wrap">
              {logs.length === 0 ? (
                <p className="text-muted-foreground">No logs yet. Interact with the application to see logs.</p>
              ) : (
                logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`py-1 ${
                      log.startsWith('ERROR') 
                        ? 'text-red-500' 
                        : log.startsWith('WARN') 
                          ? 'text-yellow-500' 
                          : 'text-green-500'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebuggerDashboard;
