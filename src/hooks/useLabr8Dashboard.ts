
import { useState, useEffect } from 'react';
import { ServiceRequest } from '@/types/modul8';
import { getUserServiceProvider, getProviderServiceRequests } from '@/services/modul8Service';
import { getProposalCards } from '@/services/proposalCardService';

export const useLabr8Dashboard = (userId?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceProvider, setServiceProvider] = useState(null);
  const [allRequests, setAllRequests] = useState<ServiceRequest[]>([]);
  const [requestsWithCards, setRequestsWithCards] = useState<{[key: string]: {hasPending: boolean, hasFinalization: boolean}}>({});

  const loadData = async () => {
    if (!userId) {
      console.log('❌ useLabr8Dashboard: No userId provided');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useLabr8Dashboard: Loading data for user:', userId);
      
      const provider = await getUserServiceProvider(userId);
      console.log('👤 useLabr8Dashboard: Service provider found:', provider?.id);
      setServiceProvider(provider);
      
      if (provider) {
        const requests = await getProviderServiceRequests(provider.id);
        console.log('📋 useLabr8Dashboard: Requests loaded:', requests?.length || 0);
        setAllRequests(requests || []);
        
        // Load proposal cards for each request to determine categorization
        const cardsData: {[key: string]: {hasPending: boolean, hasFinalization: boolean}} = {};
        for (const request of requests || []) {
          try {
            const cards = await getProposalCards(request.id);
            const hasPendingCard = cards.some(card => card.status === 'pending');
            const hasFinalizationCard = cards.some(card => card.status === 'agreement');
            cardsData[request.id] = { hasPending: hasPendingCard, hasFinalization: hasFinalizationCard };
          } catch (error) {
            console.error(`Error loading cards for request ${request.id}:`, error);
            cardsData[request.id] = { hasPending: false, hasFinalization: false };
          }
        }
        setRequestsWithCards(cardsData);
      }
    } catch (err) {
      console.error('❌ Error loading LAB-R8 dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  // Filter requests by status - with new logic for pending cards
  const pendingRequests = allRequests.filter(req => {
    const cardData = requestsWithCards[req.id];
    // Include if status is pending/assigned AND does NOT have pending cards or has finalization card
    return (req.status === 'pending' || req.status === 'assigned') && 
           (!cardData?.hasPending || cardData?.hasFinalization);
  });
  
  const negotiatingRequests = allRequests.filter(req => {
    const cardData = requestsWithCards[req.id];
    // Include if status is negotiating OR has pending cards without finalization card
    return req.status === 'negotiating' || 
           (cardData?.hasPending && !cardData?.hasFinalization);
  });
  
  // Include accepted, agreed, and in_progress requests in active projects
  const activeProjects = allRequests.filter(req => 
    req.status === 'agreed' || req.status === 'in_progress'
  );
  
  const completedProjects = allRequests.filter(req => 
    req.status === 'completed'
  );

  console.log('📊 useLabr8Dashboard: Request distribution:', {
    total: allRequests.length,
    pending: pendingRequests.length,
    negotiating: negotiatingRequests.length,
    active: activeProjects.length,
    completed: completedProjects.length
  });

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
