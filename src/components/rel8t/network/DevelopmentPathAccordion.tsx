import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { TrendingUp } from "lucide-react";
import { DevelopmentPathCard } from "./DevelopmentPathCard";
import { Outreach } from "@/services/rel8t/outreachService";
import { PathHistoryEntry, SkippedPathEntry } from "@/hooks/useActv8Contacts";
import { cn } from "@/lib/utils";

interface LinkedOutreach {
  stepIndex: number;
  outreach: Outreach;
}

interface DevelopmentPathAccordionProps {
  pathId?: string;
  currentStepIndex?: number;
  completedSteps?: string[];
  linkedOutreaches?: LinkedOutreach[];
  actv8ContactId?: string;
  pathTier?: number;
  pathHistory?: PathHistoryEntry[];
  skippedPaths?: SkippedPathEntry[];
  totalStepsInPath?: number;
  onPlanTouchpoint?: (stepIndex: number) => void;
}

export function DevelopmentPathAccordion({
  pathId,
  currentStepIndex = 0,
  completedSteps,
  linkedOutreaches = [],
  actv8ContactId,
  pathTier = 1,
  pathHistory = [],
  skippedPaths = [],
  totalStepsInPath = 4,
  onPlanTouchpoint,
}: DevelopmentPathAccordionProps) {
  // Generate 16 progress dots (4 tiers × 4 steps)
  const getSegmentStatus = (segmentIndex: number) => {
    const tier = Math.floor(segmentIndex / 4) + 1;
    const stepInTier = segmentIndex % 4;
    
    // Check if this tier was skipped
    const isSkipped = skippedPaths.some(s => s.tier_at_skip === tier);
    if (isSkipped) return 'skipped';
    
    // Check if this tier was completed (in path history)
    const completedTierCount = pathHistory.length;
    if (tier <= completedTierCount) return 'completed';
    
    // Current tier logic
    if (tier === pathTier) {
      // Calculate which step we're on in the current tier
      const stepsPerPath = totalStepsInPath || 4;
      const normalizedStepIndex = Math.floor((currentStepIndex / stepsPerPath) * 4);
      
      if (stepInTier < normalizedStepIndex) return 'completed';
      if (stepInTier === normalizedStepIndex) return 'current';
      return 'future';
    }
    
    // Future tiers
    return 'future';
  };

  const getSegmentColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[hsl(224,76%,48%)]'; // Royal Blue
      case 'skipped': return 'bg-amber-500'; // Yellow
      case 'current': return 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]'; // White with glow
      default: return 'bg-muted-foreground/30'; // Dark gray
    }
  };

  return (
    <AccordionItem 
      value="development-path" 
      className="border rounded-2xl bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden"
    >
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/5 transition-colors">
        <div className="flex items-center gap-3 text-left flex-1">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <span className="font-medium text-sm">Relationship Development</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">
                Step {currentStepIndex + 1} of {totalStepsInPath}
              </span>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      
      <AccordionContent className="px-4 pb-4">
        <DevelopmentPathCard
          pathId={pathId}
          currentStepIndex={currentStepIndex}
          completedSteps={completedSteps}
          linkedOutreaches={linkedOutreaches}
          actv8ContactId={actv8ContactId}
          pathTier={pathTier}
          pathHistory={pathHistory}
          skippedPaths={skippedPaths}
          onPlanTouchpoint={onPlanTouchpoint}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
