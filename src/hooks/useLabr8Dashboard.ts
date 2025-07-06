
import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/modul8';
import { getUserServiceProvider, getServiceProviderRequests } from '@/services/modul8Service';

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
        const requests = await getServiceProviderRequests(provider.id);
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

  // Filter requests by status - include accepted and agreed states
  const pendingRequests = allRequests.filter(req => 
    req.status === 'open' || req.status === 'pending'
  );
  
  const negotiatingRequests = allRequests.filter(req => 
    req.status === 'negotiating' || req.status === 'in_discussion'
  );
  
  const activeProjects = allRequests.filter(req => 
    req.status === 'agreed' || req.status === 'in_progress' || req.status === 'accepted'
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
