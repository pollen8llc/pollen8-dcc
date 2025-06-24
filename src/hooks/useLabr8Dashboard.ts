
import { useState, useEffect, useCallback } from "react";
import { getUserServiceProvider, getProviderServiceRequests, getAvailableServiceRequestsForProvider } from "@/services/modul8Service";
import { ServiceProvider, ServiceRequest } from "@/types/modul8";

/**
 * Consolidated dashboard logic for LAB-R8 provider.
 */
export function useLabr8Dashboard(userId?: string) {
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [assignedRequests, setAssignedRequests] = useState<ServiceRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!userId) {
      console.log('No user ID provided to useLabr8Dashboard');
      setLoading(false);
      return;
    }
    
    console.log('Loading LAB-R8 dashboard data for user:', userId);
    setLoading(true);
    setError(null);
    
    try {
      // First get the service provider profile
      console.log('Fetching service provider for user:', userId);
      const provider = await getUserServiceProvider(userId);
      console.log('Service provider loaded:', provider);
      setServiceProvider(provider);
      
      if (!provider) {
        console.log('No service provider found for user:', userId);
        setLoading(false);
        return;
      }

      // Load assigned requests (requests assigned to this provider)
      console.log('Loading assigned requests for provider:', provider.id);
      const assigned = await getProviderServiceRequests(provider.id);
      console.log('Assigned requests loaded:', assigned.length, 'requests');
      setAssignedRequests(assigned);

      // Load available requests (open market requests)
      console.log('Loading available requests for provider:', provider.id);
      const available = await getAvailableServiceRequestsForProvider(provider.id);
      console.log('Available requests loaded:', available.length, 'requests');
      setIncomingRequests(available);

    } catch (err: any) {
      console.error('Error loading LAB-R8 dashboard data:', err);
      const errorMessage = err?.message ? String(err.message) : "Failed to load dashboard data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const reload = () => {
    console.log('Reloading LAB-R8 dashboard data');
    loadData();
  };

  // Proper categorization based on status
  const pendingRequests = incomingRequests.filter(r => {
    const isPending = r.status === "pending";
    if (isPending) console.log('Pending request found:', r.title, r.id);
    return isPending;
  });
  
  const negotiatingRequests = assignedRequests.filter(r => {
    const isNegotiating = r.status === "negotiating";
    if (isNegotiating) console.log('Negotiating request found:', r.title, r.id);
    return isNegotiating;
  });
  
  const activeProjects = assignedRequests.filter(r => {
    const isActive = ["agreed", "in_progress"].includes(r.status);
    if (isActive) console.log('Active project found:', r.title, r.id);
    return isActive;
  });
  
  const completedProjects = assignedRequests.filter(r => {
    const isCompleted = r.status === "completed";
    if (isCompleted) console.log('Completed project found:', r.title, r.id);
    return isCompleted;
  });

  console.log('LAB-R8 Dashboard state:', {
    loading,
    error,
    serviceProvider: serviceProvider?.business_name,
    pendingCount: pendingRequests.length,
    negotiatingCount: negotiatingRequests.length,
    activeCount: activeProjects.length,
    completedCount: completedProjects.length
  });

  return {
    loading,
    error,
    serviceProvider,
    pendingRequests,
    negotiatingRequests,
    activeProjects,
    completedProjects,
    reload,
  };
}
