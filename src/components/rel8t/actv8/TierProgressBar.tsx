import { useTierLabels, StepInstance } from "@/hooks/useRelationshipLevels";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompletedPathInstance {
  id: string;
  path_id: string;
  status: "active" | "ended" | "skipped";
  tier?: number;
}

interface TierProgressBarProps {
  currentTier: number;
  currentStepIndex: number;
  totalStepsInCurrentPath: number;
  completedPathInstances?: CompletedPathInstance[];
  stepInstances?: StepInstance[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SEGMENTS_PER_TIER = 4;
const TOTAL_TIERS = 4;

type SegmentStatus =
  | "completed"        // Blue - completed first try
  | "retried"          // Purple - completed after retry
  | "missed"           // Red - missed or overdue
  | "active"           // White pulsing - current step
  | "skipped"          // Amber - tier was skipped
  | "future"           // Gray - not yet reached
  | "locked";          // Dark gray - tier not unlocked

export function TierProgressBar({
  currentTier,
  currentStepIndex,
  totalStepsInCurrentPath,
  completedPathInstances = [],
  stepInstances = [],
  size = "md",
  className,
}: TierProgressBarProps) {
  const tierLabels = useTierLabels();

  // Determine segment status for each dot
  const getSegmentStatus = (tier: number, segmentIndex: number): SegmentStatus => {
    const globalIndex = (tier - 1) * SEGMENTS_PER_TIER + segmentIndex;

    // Check if this tier was completed (ended) in path instances
    const tierInstance = completedPathInstances.find(
      (p) => p.tier === tier && p.status === "ended"
    );
    if (tierInstance) {
      return "completed";
    }

    // Check if this tier was skipped
    const skippedInstance = completedPathInstances.find(
      (p) => p.tier === tier && p.status === "skipped"
    );
    if (skippedInstance) {
      return "skipped";
    }

    // For current tier, check step instances
    if (tier === currentTier) {
      const stepInstance = stepInstances.find((s) => s.step_index === segmentIndex);
      
      if (stepInstance) {
        if (stepInstance.status === "completed") {
          return stepInstance.retry_count > 0 ? "retried" : "completed";
        }
        if (stepInstance.status === "missed") {
          return "missed";
        }
        if (stepInstance.status === "active" || stepInstance.status === "retrying") {
          return "active";
        }
      }

      // No step instance - determine based on position
      if (segmentIndex < currentStepIndex) {
        return "completed";
      }
      if (segmentIndex === currentStepIndex) {
        return "active";
      }
      return "future";
    }

    // Past tiers without explicit status
    if (tier < currentTier) {
      return "completed";
    }

    // Future tiers
    return "locked";
  };

  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
  };

  const gapClasses = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  };

  return (
    <TooltipProvider>
      <div className={cn("space-y-2", className)}>
        {/* 16-dot progress bar */}
        <div className={cn("flex items-center", gapClasses[size])}>
          {Array.from({ length: TOTAL_TIERS }).map((_, tierIdx) => (
            <div key={tierIdx} className={cn("flex items-center", gapClasses[size])}>
              {Array.from({ length: SEGMENTS_PER_TIER }).map((_, segIdx) => {
                const tier = tierIdx + 1;
                const status = getSegmentStatus(tier, segIdx);
                
                return (
                  <Tooltip key={`${tier}-${segIdx}`}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "rounded-full transition-all duration-300",
                          sizeClasses[size],
                          // Status-based colors
                          status === "completed" && "bg-blue-500 shadow-sm shadow-blue-500/50",
                          status === "retried" && "bg-purple-500 shadow-sm shadow-purple-500/50",
                          status === "missed" && "bg-red-500 shadow-sm shadow-red-500/50",
                          status === "active" && "bg-white shadow-md shadow-white/50 animate-pulse",
                          status === "skipped" && "bg-amber-500 shadow-sm shadow-amber-500/50",
                          status === "future" && "bg-muted-foreground/30",
                          status === "locked" && "bg-muted/40"
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p className="font-medium">{tierLabels[tier] || `Tier ${tier}`}</p>
                      <p className="text-muted-foreground">
                        Step {segIdx + 1} · {status}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
              
              {/* Tier separator (except after last tier) */}
              {tierIdx < TOTAL_TIERS - 1 && (
                <div className="w-px h-3 bg-border mx-1" />
              )}
            </div>
          ))}
        </div>

        {/* Tier labels */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
          {Array.from({ length: TOTAL_TIERS }).map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "transition-colors",
                idx + 1 === currentTier && "text-primary font-medium"
              )}
            >
              {tierLabels[idx + 1]?.slice(0, 4) || `T${idx + 1}`}
            </span>
          ))}
        </div>

        {/* Color legend */}
        <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span>Retried</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Skipped</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-white border border-border" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
