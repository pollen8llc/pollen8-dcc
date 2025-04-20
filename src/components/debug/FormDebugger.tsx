
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DebugData {
  type: 'info' | 'error' | 'success';
  message: string;
  timestamp: string;
}

interface FormDebuggerProps {
  logs: DebugData[];
}

export const FormDebugger = ({ logs }: FormDebuggerProps) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Debug Console</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`mb-2 rounded-lg p-2 text-sm ${
                log.type === 'error' ? 'bg-red-500/10 text-red-500' :
                log.type === 'success' ? 'bg-green-500/10 text-green-500' :
                'bg-blue-500/10 text-blue-500'
              }`}
            >
              <span className="opacity-70">{log.timestamp}</span>
              <p className="mt-1">{log.message}</p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
