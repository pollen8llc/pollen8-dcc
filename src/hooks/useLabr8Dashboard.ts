
import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/modul8';
import { getUserServiceProvider, getProviderServiceRequests } from '@/services/modul8Service';

export const useLabr8Dashboard = (userId?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [allRequests, setAllRequests] = useState<ServiceRequest[]>([]);

  const loadData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const provider = await getUserServiceProvider(userId);
      setServiceProvider(provider);
      
      if (provider) {
        const requests = await getProviderServiceRequests(provider.id);
        setAllRequests(requests || []);
      }
    } catch (err) {
      console.error('Error loading LAB-R8 dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  // Filter requests by status - using correct status values
  const pendingRequests = allRequests.filter(req => 
    req.status === 'pending' || req.status === 'assigned'
  );
  
  const negotiatingRequests = allRequests.filter(req => 
    req.status === 'negotiating'
  );
  
  const activeProjects = allRequests.filter(req => 
    req.status === 'agreed' || req.status === 'in_progress'
  );
  
  const completedProjects = allRequests.filter(req => 
    req.status === 'completed'
  );

  return {
    loading,
    error,
    serviceProvider,
    pendingRequests,
    negotiatingRequests,
    activeProjects,
    completedProjects,
    reload: loadData
  };
};
