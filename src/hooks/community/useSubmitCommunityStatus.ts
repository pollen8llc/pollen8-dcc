
import { useState, useEffect } from 'react';
import { checkDistributionStatus, type DistributionStatus } from '@/services/community/communityDistributionService';

export const useSubmitCommunityStatus = (distributionId: string | null) => {
  const [status, setStatus] = useState<DistributionStatus | null>(null);
  const [communityId, setCommunityId] = useState<string | null>(null);

  useEffect(() => {
    if (!distributionId) return;

    let isSubscribed = true;
    const checkStatus = async () => {
      try {
        const record = await checkDistributionStatus(distributionId);
        
        if (!isSubscribed) return;
        
        setStatus(record.status as DistributionStatus);
        if (record.community_id) {
          setCommunityId(record.community_id);
        }

        // Continue polling if still processing
        if (record.status === 'pending' || record.status === 'processing') {
          setTimeout(checkStatus, 1000);
        }
      } catch (err: any) {
        if (!isSubscribed) return;
        console.error('Status check error:', err);
      }
    };

    checkStatus();

    return () => {
      isSubscribed = false;
    };
  }, [distributionId]);

  return {
    status,
    communityId,
    isProcessing: status === 'pending' || status === 'processing'
  };
};
