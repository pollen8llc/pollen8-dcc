
import { useState, useCallback } from "react";

export interface DebugLog {
  type: 'info' | 'error' | 'success';
  message: string;
  timestamp: string;
}

export const useDebugLogger = (maxLogs: number = 30) => {
  const [debugLogs, setDebugLogs] = useState<DebugLog[]>([]);

  const addDebugLog = useCallback((type: DebugLog['type'], message: string) => {
    console.log(`[${type.toUpperCase()}] ${message}`);
    setDebugLogs(prev => {
      const newLogs = [
        {
          type,
          message,
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ];
      
      return newLogs.slice(0, maxLogs);
    });
  }, [maxLogs]);

  const clearDebugLogs = useCallback(() => {
    setDebugLogs([]);
  }, []);

  return {
    debugLogs,
    addDebugLog,
    clearDebugLogs
  };
};
