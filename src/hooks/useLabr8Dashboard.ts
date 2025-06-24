
import { useState, useEffect } from 'react';
import { ServiceRequest, ServiceProvider } from '@/types/modul8';

export interface DashboardData {
  serviceProvider: ServiceProvider | null;
  pendingRequests: ServiceRequest[];
  negotiatingRequests: ServiceRequest[];
  activeProjects: ServiceRequest[];
  completedProjects: ServiceRequest[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export const useLabr8Dashboard = (userId?: string) => {
  const [data, setData] = useState<DashboardData>({
    serviceProvider: null,
    pendingRequests: [],
    negotiatingRequests: [],
    activeProjects: [],
    completedProjects: [],
    loading: true,
    error: null,
    reload: () => {}
  });

  const [isLoading, setIsLoading] = useState(true);

  const reload = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        loading: false
      }));
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    reload();
  }, [userId]);

  // Return both the expected format for backward compatibility
  return {
    data: {
      ...data,
      reload
    },
    isLoading,
    // Individual properties for destructuring
    loading: data.loading,
    error: data.error,
    serviceProvider: data.serviceProvider,
    pendingRequests: data.pendingRequests,
    negotiatingRequests: data.negotiatingRequests,
    activeProjects: data.activeProjects,
    completedProjects: data.completedProjects,
    reload
  };
};
