import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function WizardProgress({ currentStep, totalSteps, className }: WizardProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className={cn("space-y-2", className)}>
      {/* Progress Bar */}
      <div className="h-1 bg-secondary/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step Indicator */}
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-primary font-medium">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
