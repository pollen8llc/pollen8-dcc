
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { checkDistributionStatus, type DistributionStatus } from '@/services/community/communityDistributionService';

export const useSubmitCommunityStatus = (distributionId: string | null) => {
  const [status, setStatus] = useState<DistributionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [communityId, setCommunityId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!distributionId) return;

    let isSubscribed = true;
    const checkStatus = async () => {
      try {
        const record = await checkDistributionStatus(distributionId);
        
        if (!isSubscribed) return;
        
        setStatus(record.status);
        if (record.error_message) {
          setError(record.error_message);
        }
        if (record.community_id) {
          setCommunityId(record.community_id);
        }

        // Show toast based on status
        if (record.status === 'failed') {
          toast({
            variant: "destructive",
            title: "Error",
            description: record.error_message || "Failed to create community",
          });
        } else if (record.status === 'completed') {
          toast({
            title: "Success",
            description: "Community created successfully!",
          });
        }

        // Continue polling if still processing
        if (record.status === 'pending' || record.status === 'processing') {
          setTimeout(checkStatus, 1000);
        }
      } catch (err: any) {
        if (!isSubscribed) return;
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      }
    };

    checkStatus();

    return () => {
      isSubscribed = false;
    };
  }, [distributionId, toast]);

  return {
    status,
    error,
    communityId,
    isProcessing: status === 'pending' || status === 'processing'
  };
};
