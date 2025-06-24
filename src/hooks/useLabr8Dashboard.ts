
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
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const provider = await getUserServiceProvider(userId);
      setServiceProvider(provider);
      if (!provider) return;
      const assigned = await getProviderServiceRequests(provider.id);
      const available = await getAvailableServiceRequestsForProvider(provider.id);
      setAssignedRequests(assigned);
      setIncomingRequests(available);
    } catch (err: any) {
      setError(
        err?.message ? String(err.message) : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const reload = () => loadData();

  // Categorization
  const pendingRequests = incomingRequests.filter(r => r.status === "pending");
  const negotiatingRequests = assignedRequests.filter(
    r => r.status === "negotiating" || r.status === "assigned"
  );
  const activeProjects = assignedRequests.filter(r =>
    ["agreed", "in_progress"].includes(r.status)
  );
  const completedProjects = assignedRequests.filter(r => r.status === "completed");

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
