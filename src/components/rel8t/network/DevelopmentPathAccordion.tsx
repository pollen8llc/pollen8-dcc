import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { TrendingUp } from "lucide-react";
import { DevelopmentPathCard } from "./DevelopmentPathCard";
import { Outreach } from "@/services/rel8t/outreachService";
import { CompletedPathInstance, TierProgressBar } from "./TierProgressBar";

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
  completedPathInstances?: CompletedPathInstance[];
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
  completedPathInstances = [],
  totalStepsInPath = 4,
  onPlanTouchpoint,
}: DevelopmentPathAccordionProps) {
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
            <div className="flex items-center gap-2 mt-1">
              {/* Use mini TierProgressBar for header summary */}
              <div className="w-24">
                <TierProgressBar
                  currentTier={pathTier}
                  currentStepIndex={currentStepIndex}
                  totalStepsInCurrentPath={totalStepsInPath}
                  completedPathInstances={completedPathInstances}
                  size="sm"
                  animated={false}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                Step {currentStepIndex + 1}/{totalStepsInPath}
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
          completedPathInstances={completedPathInstances}
          onPlanTouchpoint={onPlanTouchpoint}
        />
      </AccordionContent>
    </AccordionItem>
  );
}