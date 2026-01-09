import { cn } from "@/lib/utils";
import { PathHistoryEntry, SkippedPathEntry } from "@/hooks/useActv8Contacts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TierProgressBarProps {
  currentTier: number; // 1-4
  currentStepIndex: number; // 0-3 within current path
  totalStepsInCurrentPath?: number;
  pathHistory?: PathHistoryEntry[];
  skippedPaths?: SkippedPathEntry[];
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  animated?: boolean;
}

type SegmentState = 'completed-tier' | 'in-progress' | 'current' | 'skipped' | 'future';

const tierLabels: Record<number, string> = {
  1: "Foundation",
  2: "Growth", 
  3: "Professional",
  4: "Advanced",
};

const sizeConfig = {
  sm: { height: 'h-1.5', gap: 'gap-0.5', tierGap: 'gap-1' },
  md: { height: 'h-2', gap: 'gap-0.5', tierGap: 'gap-1.5' },
  lg: { height: 'h-3', gap: 'gap-1', tierGap: 'gap-2' },
};

export function TierProgressBar({
  currentTier,
  currentStepIndex,
  totalStepsInCurrentPath = 4,
  pathHistory = [],
  skippedPaths = [],
  size = 'sm',
  showLabels = false,
  animated = true,
}: TierProgressBarProps) {
  const config = sizeConfig[size];

  // Get the number of completed tiers (from path history)
  const completedTiers = pathHistory.length;

  // Get skipped tier numbers
  const skippedTierNumbers = skippedPaths.map(s => s.tier_at_skip);

  const getSegmentState = (tier: number, step: number): SegmentState => {
    // Tier is 1-indexed, step is 0-indexed (0-3)
    
    // Check if this tier was skipped
    if (skippedTierNumbers.includes(tier)) {
      return 'skipped';
    }

    // Check if this tier is fully completed (tier < currentTier means completed)
    if (tier < currentTier) {
      return 'completed-tier';
    }

    // Current tier
    if (tier === currentTier) {
      if (step < currentStepIndex) return 'in-progress';
      if (step === currentStepIndex) return 'current';
      return 'future';
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
        // Blue - user actually completed all steps in this tier
        return cn(
          baseClasses,
          "bg-[hsl(224,76%,48%)] shadow-[0_0_8px_hsl(224,76%,48%,0.5)]"
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
    if (tier < currentTier) {
      const skippedPath = skippedPaths.find(s => s.tier_at_skip === tier);
      if (skippedPath) {
        return `${tierLabels[tier]} - Skipped${skippedPath.reason ? `: ${skippedPath.reason}` : ''}`;
      }
      const completedPath = pathHistory.find((_, i) => i + 1 === tier);
      if (completedPath) {
        return `${tierLabels[tier]} - Completed: ${completedPath.path_name}`;
      }
      return `${tierLabels[tier]} - Completed`;
    }
    if (tier === currentTier) {
      return `${tierLabels[tier]} - In Progress (Step ${currentStepIndex + 1}/4)`;
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
                tier < currentTier ? "text-[hsl(224,76%,48%)]" :
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
