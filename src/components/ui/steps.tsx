
import { cn } from "@/lib/utils";

interface StepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Steps({ steps, currentStep, className }: StepsProps) {
  return (
    <div className={cn("flex w-full", className)}>
      {steps.map((step, index) => (
        <div
          key={step}
          className={cn(
            "flex-1 flex flex-col items-center",
            index !== steps.length - 1 && "relative"
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              currentStep === index
                ? "bg-primary text-primary-foreground"
                : currentStep > index
                ? "bg-primary/80 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {currentStep > index ? "✓" : index + 1}
          </div>
          
          <div className="text-xs mt-2 text-center">{step}</div>
          
          {index !== steps.length - 1 && (
            <div
              className={cn(
                "absolute top-4 left-1/2 w-full h-0.5",
                currentStep > index ? "bg-primary/80" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
