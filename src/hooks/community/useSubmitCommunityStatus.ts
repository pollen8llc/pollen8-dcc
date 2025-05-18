
import { useState, useEffect } from 'react';
import { checkDistributionStatus, DistributionStatus } from '@/services/community/communityDistributionService';

const useSubmitCommunityStatus = (submissionId: string | null) => {
  const [status, setStatus] = useState<DistributionStatus | null>(null);
  const [communityId, setCommunityId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let intervalId: number;

    const checkStatus = async () => {
      if (!submissionId) return;

      try {
        setIsLoading(true);
        const result = await checkDistributionStatus(submissionId);
        setStatus(result.status as DistributionStatus);
        setCommunityId(result.community_id);
        
        // If we reached a terminal state, stop polling
        if (
          result.status === DistributionStatus.COMPLETED || 
          result.status === DistributionStatus.FAILED
        ) {
          clearInterval(intervalId);
          if (result.status === DistributionStatus.FAILED && result.error_message) {
            setError(result.error_message);
          }
        }
      } catch (error) {
        console.error('Error checking submission status:', error);
        setError('Failed to check submission status');
        clearInterval(intervalId);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 3 seconds
    intervalId = window.setInterval(checkStatus, 3000);

    return () => clearInterval(intervalId);
  }, [submissionId]);

  return { status, communityId, error, isLoading };
};

export default useSubmitCommunityStatus;
