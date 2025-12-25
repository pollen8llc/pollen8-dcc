import { getDevelopmentPath, DevelopmentPath } from "@/data/mockNetworkData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DevelopmentPathCardProps {
  pathId?: string;
  currentStepIndex?: number;
  completedSteps?: string[];
  onPlanTouchpoint?: (stepIndex: number) => void;
  onAdvanceStep?: () => void;
  onChangePath?: () => void;
}

export function DevelopmentPathCard({
  pathId,
  currentStepIndex,
  completedSteps,
  onPlanTouchpoint,
  onAdvanceStep,
  onChangePath
}: DevelopmentPathCardProps) {
  const path = pathId ? getDevelopmentPath(pathId) : null;

  if (!path) {
    return (
      <div className="border border-border/40 rounded-lg p-4">
        <p className="text-sm text-muted-foreground mb-3">No development path assigned</p>
        <Button variant="outline" size="sm" onClick={onChangePath}>
          Start Development Path
        </Button>
      </div>
    );
  }

  const stepIndex = currentStepIndex ?? 0;
  const completed = completedSteps ?? [];
  const progress = ((stepIndex) / path.steps.length) * 100;
  const isComplete = stepIndex >= path.steps.length;

  return (
    <div className="space-y-4">
      {/* Path Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{path.name}</h4>
          <p className="text-xs text-muted-foreground">{path.description}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onChangePath} className="text-xs">
          Change Path
        </Button>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>Step {Math.min(stepIndex + 1, path.steps.length)} of {path.steps.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {path.steps.map((step, index) => {
          const isCompleted = index < stepIndex || completed.includes(step.id);
          const isCurrent = index === stepIndex;
          const isUpcoming = index > stepIndex;

          return (
            <div
              key={step.id}
              className={`p-3 rounded-lg border transition-all ${
                isCurrent 
                  ? 'border-primary/50 bg-primary/5' 
                  : isCompleted 
                    ? 'border-border/30 bg-muted/30' 
                    : 'border-border/20 bg-background/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Step Indicator */}
                <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-xs font-medium ${
                  isCompleted 
                    ? 'bg-emerald-500 text-white' 
                    : isCurrent 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? '✓' : index + 1}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-sm ${isUpcoming ? 'text-muted-foreground' : ''}`}>
                      {step.name}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] text-emerald-500 font-medium">COMPLETED</span>
                    )}
                    {isCurrent && (
                      <span className="text-[10px] text-primary font-medium">CURRENT</span>
                    )}
                    {isUpcoming && (
                      <span className="text-[10px] text-muted-foreground">UPCOMING</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  
                  {/* Current Step Actions */}
                  {isCurrent && (
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        className="h-7 text-xs"
                        onClick={() => onPlanTouchpoint?.(index)}
                      >
                        Plan Touchpoint
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={onAdvanceStep}
                      >
                        Skip Step
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Path Complete State */}
      {isComplete && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
          <p className="font-medium text-emerald-600 dark:text-emerald-400 mb-2">Path Complete!</p>
          <div className="flex gap-2 justify-center">
            <Button size="sm" variant="outline" onClick={onChangePath}>
              Choose New Path
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
