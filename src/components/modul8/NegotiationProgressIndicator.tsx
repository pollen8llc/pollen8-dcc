
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface NegotiationProgressIndicatorProps {
  currentStatus: string;
}

export const NegotiationProgressIndicator: React.FC<NegotiationProgressIndicatorProps> = ({
  currentStatus
}) => {
  const getStageNumber = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'negotiating': return 2;
      case 'agreed': return 3;
      case 'in_progress': return 4;
      case 'completed': return 5;
      default: return 1;
    }
  };

  const getStageTitle = (status: string) => {
    switch (status) {
      case 'pending': return 'Initiated';
      case 'negotiating': return 'Proposal';
      case 'agreed': return 'Agreement';
      case 'in_progress': return 'Contract';
      case 'completed': return 'Completed';
      default: return 'Initiated';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Project Progress</h3>
        <Badge variant="outline" className="font-medium">
          Stage {getStageNumber(currentStatus)} of 5
        </Badge>
      </div>
      
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4, 5].map((stage) => {
          const isActive = stage <= getStageNumber(currentStatus);
          const isCurrent = stage === getStageNumber(currentStatus);
          
          return (
            <div key={stage} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2
                ${isActive 
                  ? 'bg-[#00eada] border-[#00eada] text-black' 
                  : 'bg-background border-muted-foreground/30 text-muted-foreground'
                }
                ${isCurrent ? 'ring-2 ring-[#00eada]/30' : ''}
              `}>
                {stage}
              </div>
              {stage < 5 && (
                <div className={`
                  w-12 h-0.5 mx-2
                  ${isActive ? 'bg-[#00eada]' : 'bg-muted-foreground/30'}
                `} />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium text-[#00eada]">
          {getStageTitle(currentStatus)}
        </h4>
      </div>
    </div>
  );
};
