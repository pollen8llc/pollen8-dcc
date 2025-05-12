
import { cn } from "@/lib/utils";
import React from "react";

export interface StepProps {
  title: string;
}

export interface StepsProps {
  currentStep: number;
  className?: string;
  children?: React.ReactNode;
  steps?: string[]; // Add support for simple array of step titles
}

export const Step: React.FC<StepProps> = ({ title }) => {
  // This is a dummy component that just serves to provide type safety
  // The actual rendering happens in the Steps component
  return null;
};

export const Steps: React.FC<StepsProps> = ({ 
  currentStep, 
  className,
  children,
  steps
}) => {
  // Extract step titles from children or use provided steps prop
  const stepsData = steps 
    ? steps.map((title, index) => ({ title, index }))
    : React.Children.toArray(children)
      .filter(child => React.isValidElement(child) && child.type === Step)
      .map((child, index) => ({
        title: React.isValidElement(child) ? (child.props as StepProps).title : `Step ${index + 1}`,
        index
      }));

  return (
    <div className={cn("flex w-full", className)}>
      {stepsData.map((step, index) => (
        <div
          key={step.title}
          className={cn(
            "flex-1 flex flex-col items-center",
            index !== stepsData.length - 1 && "relative"
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              currentStep === index + 1
                ? "bg-primary text-primary-foreground"
                : currentStep > index + 1
                ? "bg-primary/80 text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {currentStep > index + 1 ? "✓" : index + 1}
          </div>
          
          <div className="text-xs mt-2 text-center">{step.title}</div>
          
          {index !== stepsData.length - 1 && (
            <div
              className={cn(
                "absolute top-4 left-1/2 w-full h-0.5",
                currentStep > index + 1 ? "bg-primary/80" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
