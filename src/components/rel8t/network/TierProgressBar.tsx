import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTierLabels, StepInstance } from "@/hooks/useRelationshipLevels";

export interface CompletedPathInstance {
  id: string;
  path_id: string;
  path_name: string;
  tier: number;
  status: 'ended' | 'skipped';
  started_at: string;
  ended_at?: string;
}

interface TierProgressBarProps {
  currentTier: number; // 1-4 (tier of currently active path)
  currentStepIndex: number; // 0-based index within current path
  totalStepsInCurrentPath?: number; // Total steps in the active path
  completedPathInstances?: CompletedPathInstance[]; // Source of truth for completed/skipped tiers
  stepInstances?: StepInstance[]; // Individual step tracking for outcome visualization
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  animated?: boolean;
}

// Extended segment states with outcome tracking
type SegmentState = 
  | 'completed-tier'     // Blue - completed successfully on first try
  | 'completed-retried'  // Purple - completed after retry
  | 'missed'             // Red - missed/overdue, needs retry
  | 'in-progress'        // White - steps completed within current tier
  | 'current'            // White pulsing - current active step
  | 'skipped'            // Amber - tier was skipped during initial assessment
  | 'future';            // Gray - not yet reached

const sizeConfig = {
  sm: { height: 'h-1.5', gap: 'gap-0.5', tierGap: 'gap-1' },
  md: { height: 'h-2', gap: 'gap-0.5', tierGap: 'gap-1.5' },
  lg: { height: 'h-3', gap: 'gap-1', tierGap: 'gap-2' },
};

export function TierProgressBar({
  currentTier,
  currentStepIndex,
  totalStepsInCurrentPath = 4,
  completedPathInstances = [],
  stepInstances = [],
  size = 'sm',
  showLabels = false,
  animated = true,
}: TierProgressBarProps) {
  const tierLabels = useTierLabels();
  const config = sizeConfig[size];

  // Derive completed and skipped tiers from path instances (source of truth)
  const completedTiers = new Set(
    completedPathInstances
      .filter(p => p.status === 'ended')
      .map(p => p.tier)
  );
  
  const skippedTiers = new Set(
    completedPathInstances
      .filter(p => p.status === 'skipped')
      .map(p => p.tier)
  );

  // Check if current path is complete (currentStepIndex >= totalSteps)
  const isCurrentPathComplete = currentStepIndex >= totalStepsInCurrentPath;

  // Normalize step index to 4 segments (0-3)
  // Maps any step count to a 0-3 range
  const normalizedStepIndex = Math.min(
    3,
    Math.floor((currentStepIndex / totalStepsInCurrentPath) * 4)
  );

  // Get step instance for a specific normalized step index in the current tier
  const getStepInstanceForSegment = (tier: number, normalizedStep: number): StepInstance | undefined => {
    if (tier !== currentTier || stepInstances.length === 0) return undefined;
    
    // Map normalized step (0-3) back to actual step index
    const actualStepIndex = Math.floor((normalizedStep / 4) * totalStepsInCurrentPath);
    return stepInstances.find(si => si.step_index === actualStepIndex);
  };

  const getSegmentState = (tier: number, step: number): SegmentState => {
    // Tier is 1-indexed, step is 0-indexed (0-3)
    
    // Check if this tier was completed via path instances
    if (completedTiers.has(tier)) {
      return 'completed-tier';
    }
    
    // Check if this tier was skipped
    if (skippedTiers.has(tier)) {
      return 'skipped';
    }

    // Current tier logic - check individual step instances
    if (tier === currentTier) {
      // If current path is complete, show entire tier as completed
      if (isCurrentPathComplete) {
        return 'completed-tier';
      }
      
      // Check step instance for this segment
      const stepInstance = getStepInstanceForSegment(tier, step);
      
      if (stepInstance) {
        // Step-level outcome tracking
        if (stepInstance.status === 'completed') {
          // Was it retried before completion?
          if (stepInstance.retry_count > 0) {
            return 'completed-retried';
          }
          return 'completed-tier';
        }
        
        if (stepInstance.status === 'missed') {
          return 'missed';
        }
        
        if (stepInstance.status === 'active' || stepInstance.status === 'retrying') {
          return 'current';
        }
      }
      
      // Fallback to index-based logic when no step instances
      if (step < normalizedStepIndex) return 'in-progress';
      if (step === normalizedStepIndex) return 'current';
      return 'future';
    }

    // Tiers before current (but not in instances) - should be marked as completed or skipped
    // This handles edge cases where tier completion wasn't tracked properly
    if (tier < currentTier) {
      return 'completed-tier';
    }

    // Future tiers
    return 'future';
  };

  const getSegmentClasses = (state: SegmentState) => {
    const baseClasses = cn(
      "flex-1 rounded-sm transition-all",
      animated && "duration-500"
    );

    switch (state) {
      case 'completed-tier':
        // Blue - user actually completed all steps in this tier on first try
        return cn(
          baseClasses,
          "bg-[hsl(224,76%,48%)] shadow-[0_0_8px_hsl(224,76%,48%,0.5)]"
        );
      case 'completed-retried':
        // Purple - completed after retry
        return cn(
          baseClasses,
          "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
        );
      case 'missed':
        // Red - missed/overdue, needs retry
        return cn(
          baseClasses,
          "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
        );
      case 'in-progress':
        // White - steps completed within current tier
        return cn(
          baseClasses,
          "bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]"
        );
      case 'current':
        // White with pulse - current active step
        return cn(
          baseClasses,
          "bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]",
          animated && "animate-pulse"
        );
      case 'skipped':
        // Solid yellow/amber - tier was skipped during initial assessment
        return cn(
          baseClasses,
          "bg-amber-500"
        );
      case 'future':
      default:
        // Gray - not yet reached
        return cn(
          baseClasses,
          "bg-muted/30 border border-white/5"
        );
    }
  };

  const getTierTooltip = (tier: number) => {
    // Find the path instance for this tier
    const completedInstance = completedPathInstances.find(
      p => p.tier === tier && p.status === 'ended'
    );
    const skippedInstance = completedPathInstances.find(
      p => p.tier === tier && p.status === 'skipped'
    );
    
    if (completedInstance) {
      return `${tierLabels[tier]} - Completed: ${completedInstance.path_name}`;
    }
    
    if (skippedInstance) {
      return `${tierLabels[tier]} - Skipped`;
    }
    
    if (tier === currentTier) {
      if (isCurrentPathComplete) {
        return `${tierLabels[tier]} - Completed (pending save)`;
      }
      
      // Check for missed steps
      const missedSteps = stepInstances.filter(si => si.status === 'missed').length;
      if (missedSteps > 0) {
        return `${tierLabels[tier]} - ${missedSteps} step(s) need retry`;
      }
      
      const displayStep = Math.min(currentStepIndex + 1, totalStepsInCurrentPath);
      return `${tierLabels[tier]} - In Progress (Step ${displayStep}/${totalStepsInCurrentPath})`;
    }
    
    if (tier < currentTier) {
      return `${tierLabels[tier]} - Completed`;
    }
    
    return `${tierLabels[tier]} - Locked`;
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className={cn("flex", config.tierGap)}>
        {[1, 2, 3, 4].map((tier) => (
          <TooltipProvider key={tier}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("flex flex-1", config.gap)}>
                  {[0, 1, 2, 3].map((step) => {
                    const state = getSegmentState(tier, step);
                    const globalIndex = (tier - 1) * 4 + step;
                    
                    return (
                      <div
                        key={step}
                        className={cn(
                          config.height,
                          getSegmentClasses(state)
                        )}
                        style={{
                          transitionDelay: animated && (state === 'in-progress' || state === 'completed-tier')
                            ? `${globalIndex * 50}ms`
                            : '0ms'
                        }}
                      />
                    );
                  })}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {getTierTooltip(tier)}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between mt-2 px-1">
          {[1, 2, 3, 4].map((tier) => (
            <span 
              key={tier} 
              className={cn(
                "text-[10px] font-medium transition-colors",
                completedTiers.has(tier) || tier < currentTier ? "text-[hsl(224,76%,48%)]" :
                skippedTiers.has(tier) ? "text-amber-500" :
                tier === currentTier ? "text-white" : 
                "text-muted-foreground/50"
              )}
            >
              {tierLabels[tier]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
