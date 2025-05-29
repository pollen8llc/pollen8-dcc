
import { cn } from "@/lib/utils";
import React from "react";

export interface StepProps {
  title: string;
}

export interface StepsProps {
  currentStep: number;
  className?: string;
  children?: React.ReactNode;
  steps?: string[]; // Add support for steps array
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
              "w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all",
              currentStep === index + 1
                ? "bg-[#00eada] text-primary-foreground knowledge-tag-border"
                : currentStep > index + 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {currentStep > index + 1 ? "✓" : index + 1}
          </div>
          
          <div className="text-sm mt-2 text-center font-medium">
            {step.title}
          </div>
          
          {index !== stepsData.length - 1 && (
            <div
              className={cn(
                "absolute top-5 left-1/2 w-full h-0.5",
                currentStep > index + 1 ? "bg-primary" : "bg-muted"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
